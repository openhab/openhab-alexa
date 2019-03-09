/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * Amazon Smart Home Skill Capabilities for API V3
 */
const { CAPABILITIES, PROPERTY_SCHEMAS, ASSET_IDENTIFIERS, DISPLAY_CATEGORIES, CAPABILITY_PATTERN } = require('./config.js');

/**
 * Returns alexa capability display category for a given interface
 * @param  {String} interfaceName
 * @return {String}
 */
function getCapabilityCategory(interfaceName) {
  // Strip instance name from interface name if present
  interfaceName = interfaceName.split(':').shift();
  return CAPABILITIES[interfaceName] && CAPABILITIES[interfaceName]['category'];
}

/**
 * Returns alexa capability interface object for a given interface
 *
 *  {
 *    'type': 'AlexaInterface',
 *    'interface': <interfaceName>
 *    'version': '3',
 *    'properties': {
 *      'supported': [
 *        {'name': <propertyName1>},
 *        ...
 *      ],
 *      'proactivelyReported': false,
 *      'retrievable': true
 *    },
 *    'configuration': {
 *      <configName1>: <configValue1>,
 *      ...
 *    }
 *  }
 *
 * @param  {String} interfaceName
 * @param  {Object} properties     (optional)
 * @param  {Object} settings       (optional)
 * @return {Object}
 */
function getCapabilityInterface(interfaceName, properties, settings = {}) {
  let instance;

  // Extract instance name from interface name if present
  if (interfaceName.split(':').length === 2) {
    [interfaceName, instance] = interfaceName.split(':');
  }

  // Skip capability if interface not defined
  if (!CAPABILITIES[interfaceName]) {
    return;
  }

  // Use default capability interface properties if not provided (e.g. EndpointHealth)
  if (!properties) {
    properties = CAPABILITIES[interfaceName].properties.reduce((map, property) => {
      return Object.assign(map, {[property.name]: {parameters: {}}});
    }, {});
  }

  // Initialize capability interface object
  const capability = {
    'type': 'AlexaInterface',
    'interface': interfaceName === 'Alexa'? 'Alexa' : 'Alexa.' + interfaceName,
    'version': '3'
  };

  // Define locale based on regional settings if defined, otherwise default to 'en-US'
  const locale = settings.regional && settings.regional.language && settings.regional.region ?
    [settings.regional.language, settings.regional.region].join('-') : 'en-US';

  const configuration = {};
  const resources = {};
  const supported = [];

  // Iterate over interface properties
  Object.keys(properties).forEach((propertyName) => {
    const parameters = properties[propertyName].parameters;
    // Add property name to supported list
    supported.push({name: propertyName});
    // Add specific property-based parameters
    switch (propertyName) {
      case 'input':
        capability.inputs = parameters.supportedInputs.map(input => Object.assign({name: input}));
        break;
      case 'playbackState':
        capability.supportedOperations = ['Play', 'Pause', 'Next', 'Previous', 'Rewind', 'FastForward'];
        break;
      case 'scene':
        capability.supportsDeactivation = parameters.supportsDeactivation === false ? false : true;
        break;
      case 'thermostatMode':
        Object.assign(configuration, {
          'supportsScheduling': false
        }, parameters.supportedModes && {
          'supportedModes': parameters.supportedModes
        });
        break;
      case 'mode':
        Object.assign(resources, parameters.friendlyNames && getResourcesObject({
          labels: parameters.friendlyNames, locale: parameters.locale || locale}));
        Object.assign(configuration, {
          'ordered': parameters.ordered === true,
          'supportedModes': parameters.supportedModes.reduce((modes, mode) => modes.concat({
            'value': mode.split('=').shift(),
            'modeResources': getResourcesObject({
              labels: mode.split(/[=:]/).slice(1), locale: parameters.locale || locale})
          }), [])
        });
        break;
      case 'rangeValue':
        Object.assign(resources, parameters.friendlyNames && getResourcesObject({
          labels: parameters.friendlyNames, locale: parameters.locale || locale}));
        Object.assign(configuration, Object.assign({
          'supportedRange': parameters.supportedRange
        }, parameters.unitOfMeasure && {
          'unitOfMeasure': 'Alexa.Unit.' + parameters.unitOfMeasure
        }, parameters.presets && {
          'presets': parameters.presets.reduce((presets, preset) => presets.concat({
            'rangeValue': parseInt(preset.split('=').shift()),
            'presetResources': getResourcesObject({
              labels: preset.split(/[=:]/).slice(1), locale: parameters.locale || locale})
          }), [])
        }));
        break;
      case 'toggleState':
        Object.assign(resources, parameters.friendlyNames && getResourcesObject({
          labels: parameters.friendlyNames, locale: parameters.locale || locale}));
        break;
    }
  });

  // Update capability with common properties, if deemed standard (no property added since initialized)
  if (Object.keys(capability).length === 3) {
    // Add capability instance if defined
    if (instance) {
      capability.instance = instance;
    }
    // Add capability resources if not empty
    if (Object.keys(resources).length > 0) {
      capability.capabilityResources = resources;
    }
    // Add capability properties if supported is not empty,
    if (supported.length > 0) {
      capability.properties = {
        'supported': supported,
        'proactivelyReported': false,
        'retrievable': true
      };
    }
    // Add capability configuration if not empty
    if (Object.keys(configuration).length > 0) {
      capability.configuration = configuration;
    }
  }

  return capability;
}

/**
 * Returns alexa resources object for a given list of parameters
 *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#resources-objects
 *
 *  {
 *    'labels': [ <assetIdOrText1>, <assetIdOrText2>, ... ],
 *    'locale': <localeSetting> [ Not used at the moment (en-US only supported) ]
 *  }
 *
 * @param  {Object} parameters
 * @return {Object}
 */
function getResourcesObject(parameters = {}) {
  return {
    friendlyNames: parameters.labels.reduce((names, label) => {
      if (label.startsWith('@')) {
        const assetId = label.slice(1);
        if (isSupportedAssetId(assetId)) {
          names.push({
            '@type': 'asset',
            'value': {
              'assetId': 'Alexa.' + assetId
            }
          });
        }
      } else if (label) {
        names.push({
          '@type': 'text',
          'value': {
            'text': label,
            'locale': 'en-US'
          }
        });
      }
      return names;
    }, [])
  };
}

/**
 * Determines if asset id is supported
 * @param  {String} assetId
 * @return {Boolean}
 */
function isSupportedAssetId(assetId) {
  const [type, name] = assetId.split('.');
  return typeof ASSET_IDENTIFIERS[type] !== 'undefined' && ASSET_IDENTIFIERS[type].includes(name);
}

/**
 * Returns alexa property settings for a given capability
 *
 *  {
 *    'name': <propertyName>
 *    'schema': <propertySchemaName>
 *    'isReportable': <boolean>
 *    'itemTypes': <itemTypes>,
 *    'state': {
 *      'map': <stateMap>
 *      'type': <stateType>
 *    }
 *  }
 *
 * @param  {String} capability
 * @return {Object}
 */
function getPropertySettings(capability) {
  const [match, interfaceName, propertyName] = capability.match(CAPABILITY_PATTERN) || [];
  const properties = CAPABILITIES[interfaceName] && CAPABILITIES[interfaceName]['properties'] || [];
  const property = properties.find(property => property.name === propertyName) || {};

  return Object.assign(property, PROPERTY_SCHEMAS[property.schema]);
}

/**
 * Returns alexa property state map from one of the maps in the order below:
 *    1) user map (provided in property parameters)
 *    2) custom map (based on a specific property parameter)
 *    3) default map (based on item type)
 *
 * @param  {Object} property
 * @return {Object}
 */
function getPropertyStateMap(property) {
  const parameters = property.parameters;
  const supportedModes = parameters.supportedModes || [];
  const schema = PROPERTY_SCHEMAS[property.schema.name] || {};
  const stateMap = schema.state && schema.state.map || {};
  const type = property.item.type;

  // Define custom map if defined in schema state map
  const customMap = Object.keys(stateMap).reduce((map, key) => {
    const param = parameters[key.split(':').pop()];
    return key.startsWith('custom:') && param ? stateMap[key][param] : map;
  }, undefined);
  // Define default map if defined in schema state map
  const defaultMap = stateMap['default'] && stateMap['default'][type] || {};
  // Define user map using default map keys as supported alexa states present in property parameters
  const userMap = Object.keys(defaultMap).reduce((map, state) =>
    Object.assign(map, typeof parameters[state] !== 'undefined' && {[state]: parameters[state]}), {});

  return Object.keys(userMap).length > 0 ? userMap : customMap || defaultMap;
}

/**
 * Determines if display category is supported
 * @param  {String} category
 * @return {Boolean}
 */
function isSupportedDisplayCategory(category) {
  return DISPLAY_CATEGORIES.includes(category.toUpperCase());
}

module.exports = {
  getCapabilityCategory: getCapabilityCategory,
  getCapabilityInterface: getCapabilityInterface,
  getPropertySettings: getPropertySettings,
  getPropertyStateMap: getPropertyStateMap,
  isSupportedDisplayCategory: isSupportedDisplayCategory
};
