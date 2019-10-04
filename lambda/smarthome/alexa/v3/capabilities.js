/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/**
 * Amazon Smart Home Skill Capabilities for API V3
 */
const { CAPABILITIES, PROPERTY_SCHEMAS, ASSET_IDENTIFIERS, DISPLAY_CATEGORIES, UNIT_OF_MEASUREMENT } = require('./config.js');

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
  // Extract instance name from interface name
  [interfaceName, instance] = interfaceName.split(':');

  // Skip capability if interface not defined
  if (!CAPABILITIES[interfaceName]) {
    return;
  }

  // Use default capability interface properties if not provided (e.g. EndpointHealth)
  if (!properties) {
    properties = CAPABILITIES[interfaceName].properties.reduce((map, property) =>
      Object.assign(map, {[property.name]: {parameters: {}, schema: {}}}), {});
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

  // Initialize capability common properties
  const configuration = {};
  const resources = {};
  const supported = [];
  let nonControllable;

  // Iterate over interface properties
  Object.keys(properties).forEach((propertyName) => {
    const parameters = properties[propertyName].parameters;
    const schema = properties[propertyName].schema.name;
    let component;
    // Extract component from property name
    [propertyName, component] = propertyName.split(':');
    // Get capability property settings
    settings = Object.assign({}, settings, {property: getPropertySettings(interfaceName, propertyName)});

    // Add unique property name to supported list if property is supported
    if (settings.property.isSupported !== false && !supported.find(property => property.name === propertyName)) {
      supported.push({name: propertyName});
    }

    // Update non-controllable state if property is multi-instance enabled
    if (settings.property.multiInstance) {
      nonControllable = nonControllable || parameters.nonControllable === true;
    }

    // Get capability resources if friendly names parameter defined
    if (parameters.friendlyNames) {
      Object.assign(resources, getResourcesObject({
        labels: parameters.friendlyNames, locale: parameters.locale || locale}));
    }

    // Update properties based on schema name
    switch (schema) {
      case 'armState':
        Object.assign(configuration, {
          'supportedArmStates': parameters.supportedArmStates.map(state => ({'value': state}))
        }, parameters.supportsPinCodes === true && {
          'supportedAuthorizationTypes': [{
            'type': 'FOUR_DIGIT_PIN'
          }]
        });
        break;
      case 'equalizerBands':
        capability.configurations = Object.assign(capability.configurations || {}, {
          'bands': {
            'supported': [].concat(capability.configurations && capability.configurations.bands &&
              capability.configurations.bands.supported || [], {'name': component.toUpperCase()}),
            'range': capability.configurations && capability.configurations.bands &&
              capability.configurations.bands.range || parameters.range
          }
        });
        break;
      case 'equalizerMode':
        capability.configurations = Object.assign(capability.configurations || {}, {
          'modes': {
            'supported': parameters.supportedModes.map(mode => ({'name': mode}))
          }
        });
        break;
      case 'inputs':
        capability.inputs = parameters.supportedInputs.map(input => Object.assign({name: input}));
        break;
      case 'mode':
        Object.assign(configuration, {
          'ordered': parameters.ordered === true,
          'supportedModes': parameters.supportedModes.map(mode => ({
            'value': mode.split('=').shift(),
            'modeResources': getResourcesObject({
              labels: mode.split(/[=:]/).slice(1), locale: parameters.locale || locale})
          }))
        });
        break;
      case 'playback':
        capability.supportedOperations = ['Play', 'Pause', 'Next', 'Previous', 'Rewind', 'FastForward'];
        break;
      case 'rangeValue':
        Object.assign(configuration, Object.assign({
          'supportedRange': parameters.supportedRange
        }, parameters.unitOfMeasure && {
          'unitOfMeasure': 'Alexa.Unit.' + parameters.unitOfMeasure
        }, parameters.presets && {
          'presets': parameters.presets.map(preset => ({
            'rangeValue': parseInt(preset.split('=').shift()),
            'presetResources': getResourcesObject({
              labels: preset.split(/[=:]/).slice(1), locale: parameters.locale || locale})
          }))
        }));
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
    }
  });

  // Add capability instance if defined
  if (instance) {
    capability.instance = instance;
  }
  // Add capability resources if not empty
  if (Object.keys(resources).length > 0) {
    capability.capabilityResources = resources;
  }
  // Add capability properties if supported is not empty, appending non-controllable property if defined
  if (supported.length > 0) {
    capability.properties = Object.assign({
      'supported': supported,
      'proactivelyReported': false,
      'retrievable': true
    }, typeof nonControllable !== 'undefined' && {
      'nonControllable': nonControllable
    });
  }
  // Add capability configuration if not empty
  if (Object.keys(configuration).length > 0) {
    capability.configuration = configuration;
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
 * Returns alexa property schema values for a given schema name and optional object path
 * @param  {Object} schema
 * @param  {String} path    (optional)
 * @return {*}
 */
function getPropertySchema(schema, path = '') {
  return path.split('.').slice(1).reduce(
    (values, key) => typeof values === 'object' ? values[key] : undefined, PROPERTY_SCHEMAS[schema]);
}

/**
 * Returns alexa property settings for a given capability
 *
 *  {
 *    'name': <propertyName>,
 *    'schema': <propertySchemaName>,
 *    'report': <propertyReportName>,
 *    'components': <componentNames>,
 *    'isReportable': <boolean>,
 *    'isSupported': <boolean>,
 *    'multiInstance': <boolean>,
 *    'itemTypes': <itemTypes>,
 *    'state': {
 *      'map': <stateMap>,
 *      'type': <stateType>
 *    }
 *  }
 *
 * @param  {String} interfaceName
 * @param  {String} propertyName
 * @return {Object}
 */
function getPropertySettings(interfaceName, propertyName) {
  const properties = CAPABILITIES[interfaceName] && CAPABILITIES[interfaceName]['properties'] || [];
  const property = properties.find(property => property.name === propertyName) || {};

  return Object.assign({}, property, getPropertySchema(property.schema));
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
  const stateMap = getPropertySchema(property.schema.name, '.state.map') || {};
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
 * Returns unit of measurement based on given query
 * @param  {Object} query
 * @return {*}
 */
function getUnitOfMeasure(query) {
  let result;
  // Find unit of measurement matching query
  Object.keys(UNIT_OF_MEASUREMENT).some(dimension => {
    if (!query.dimension || query.dimension === dimension) {
      const values = UNIT_OF_MEASUREMENT[dimension].filter(measurement =>
        query.id && measurement.id === query.id ||
        query.symbol && measurement.symbol === query.symbol ||
        query.unit && measurement.unit === query.unit
      );
      // Search based on query system fallback to first value
      result = values.find(measurement => measurement.system === query.system) || values.shift();
      return result;
    }
  });
  // Find unit of measurement default value if result empty and query dimension defined
  if (!result && UNIT_OF_MEASUREMENT[query.dimension]) {
    const values = UNIT_OF_MEASUREMENT[query.dimension].filter(measurement => measurement.default);
    // Search based on query system fallback to international system (SI)
    result = values.find(measurement => measurement.system === query.system) ||
      values.find(measurement => measurement.system === 'SI');
  }
  // Return result property if defined, otherwise whole object
  return result && query.property ? result[query.property] : result;
}

/**
 * Determines if light endpoint is in color mode
 * @param  {Object}  colorItem
 * @param  {Object}  temperatureItem
 * @param  {String}  binding
 * @return {Boolean}
 */
function isInColorMode(colorItem, temperatureItem, binding) {
  if (typeof colorItem !== 'undefined' && typeof temperatureItem !== 'undefined') {
    const saturation = colorItem.state && colorItem.state.split(',')[1];
    const temperature = temperatureItem.state;
    const type = temperatureItem.type;
    // Determine omit saturation color mode property based on binding name
    const omitSaturationColorMode = getPropertySchema(
      'colorTemperatureInKelvin', `.state.map.custom:omitSaturationColorMode.${binding}`);

    switch (type) {
      case 'Dimmer':
        return typeof temperature === 'undefined' || saturation > 0 && !omitSaturationColorMode;
      case 'Number':
        return typeof temperature === 'undefined' || temperature === '0';
    }
  }
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
  getPropertySchema: getPropertySchema,
  getPropertySettings: getPropertySettings,
  getPropertyStateMap: getPropertyStateMap,
  getUnitOfMeasure: getUnitOfMeasure,
  isInColorMode: isInColorMode,
  isSupportedDisplayCategory: isSupportedDisplayCategory
};
