/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
const catalog = require('@lib/catalog.js');
const { CAPABILITIES, PROPERTY_SCHEMAS, INTERFACE_PATTERN, PROPERTY_PATTERN,
  ASSET_IDENTIFIERS, DISPLAY_CATEGORIES, FRIENDLY_NAMES_FORBIDDEN, LOCALES,
  SEMANTIC_IDENTIFIERS, UNIT_OF_MEASUREMENT } = require('./config.js');

/**
 * Returns alexa capability display category for a given interface
 * @param  {String} interfaceName
 * @return {String}
 */
function getCapabilityCategory(interfaceName) {
  // Strip instance name from interface name if present
  interfaceName = interfaceName.match(INTERFACE_PATTERN)[1];
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
  [interfaceName, instance] = interfaceName.match(INTERFACE_PATTERN).slice(1);

  // Skip capability if interface not defined
  if (!CAPABILITIES[interfaceName]) {
    return;
  }

  // Use default capability interface properties if not provided (e.g. EndpointHealth)
  if (!properties) {
    properties = CAPABILITIES[interfaceName].properties.reduce((map, property) =>
      Object.assign(map, {[property.name]: {item: {}, parameters: {}, schema: {}}}), {});
  }

  // Initialize capability interface object
  const capability = {
    'type': 'AlexaInterface',
    'interface': interfaceName === 'Alexa'? 'Alexa' : 'Alexa.' + interfaceName,
    'version': '3'
  };

  // Define default language based on regional settings if defined, otherwise default to 'en'
  const language = settings.regional && settings.regional.language || 'en';

  // Initialize capability common properties
  const configuration = {};
  const resources = {};
  const semantics = {};
  const supported = [];
  let retrievable = true;
  let nonControllable = false;

  // Iterate over interface properties
  Object.keys(properties).forEach((propertyName) => {
    const item = properties[propertyName].item;
    const parameters = properties[propertyName].parameters;
    const schema = properties[propertyName].schema.name;
    // Extract component and tag from property name
    const [name, component, tag] = propertyName.match(PROPERTY_PATTERN).slice(1);
    // Get capability property settings
    settings = Object.assign({}, settings, {property: getPropertySettings(interfaceName, propertyName)});

    // Delete and skip property if any of its property links not present in interface properties
    if (settings.property.links && settings.property.links.some(name => !properties[name + (tag ? '#' + tag : '')])) {
      delete properties[propertyName];
      return;
    }

    // Add unique property name to supported list if property is supported
    if (settings.property.isSupported !== false && !supported.find(property => property.name === name)) {
      supported.push({name: name});
    }

    // Update properties retrievable if item state retrievable is set to false
    if (item.stateRetrievable === false) {
      retrievable = false;
    }

    // Update properties non-controllable if parameter is set to true
    if (parameters.nonControllable === true) {
      nonControllable = true;
    }

    // Get capability resources if friendly names parameter defined
    if (parameters.friendlyNames) {
      Object.assign(resources, getResourcesObject({
        labels: parameters.friendlyNames, language: parameters.language || language, type: 'capability'}));
    }

    // Get capability semantics if action or state mappings parameter defined
    if (parameters.actionMappings || parameters.statesMappings) {
      Object.assign(semantics, getSemanticsObject({
        actionMappings: parameters.actionMappings, stateMappings: parameters.stateMappings}));
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
              labels: mode.split(/[=:]/).slice(1), language: parameters.language || language, type: 'mode'})
          }))
        });
        break;
      case 'playback':
        capability.supportedOperations = ['Play', 'Pause', 'Next', 'Previous', 'Rewind', 'FastForward'];
        break;
      case 'rangeValue':
        Object.assign(configuration, {
          'supportedRange': parameters.supportedRange
        }, parameters.unitOfMeasure && {
          'unitOfMeasure': 'Alexa.Unit.' + parameters.unitOfMeasure
        }, parameters.presets && {
          'presets': parameters.presets.map(preset => ({
            'rangeValue': parseInt(preset.split('=').shift()),
            'presetResources': getResourcesObject({
              labels: preset.split(/[=:]/).slice(1), language: parameters.language || language, type: 'preset'})
          }))
        });
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
  // Add capability properties if supported is not empty,
  //  appending non-controllable property if multi-instance enabled (mode, range & toggle)
  if (supported.length > 0) {
    capability.properties = Object.assign({
      'supported': supported,
      'proactivelyReported': false,
      'retrievable': retrievable
    }, settings.property.multiInstance && {
      'nonControllable': nonControllable
    });
  }
  // Add capability configuration if not empty
  if (Object.keys(configuration).length > 0) {
    capability.configuration = configuration;
  }
  // Add capability semantics if not empty
  if (Object.keys(semantics).length > 0) {
    capability.semantics = semantics;
  }

  return capability;
}

/**
 * Returns alexa resources object for a given list of parameters
 *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#resources-objects
 *
 *  {
 *    'labels': [ <assetIdOrText1>, <assetIdOrText2>, ... ],
 *    'language': <languageSetting>
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
        // Add asset object if supported in global Alexa catalog,
        //  otherwise add text objects if defined in skill catalog schema
        //  (This is a temporary solution until Amazon provides the ability to upload our own catalog:
        //    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#upload-your-own-catalog)
        if (isSupportedAssetId(assetId)) {
          names.push({
            '@type': 'asset',
            'value': {
              'assetId': 'Alexa.' + assetId
            }
          });
        } else if (Array.isArray(catalog.assetIds && catalog.assetIds[assetId])) {
          catalog.assetIds[assetId].forEach((value) => {
            names.push({
              '@type': 'text',
              'value': value
            });
          });
        }
      } else if (label) {
        // Add text object for each locale matching language parameter,
        //  if not capability resources type or if friendly name supported
        if (parameters.type !== 'capability' || isSupportedFriendlyName(label)) {
          LOCALES.filter(locale => locale.split('-')[0] === parameters.language.toLowerCase()).forEach((locale) => {
            names.push({
              '@type': 'text',
              'value': {
                'text': label,
                'locale': locale
              }
            });
          });
        }
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
 * Determines if friendly name is supported
 * @param  {String} name
 * @return {Boolean}
 */
function isSupportedFriendlyName(name) {
  return !FRIENDLY_NAMES_FORBIDDEN.includes(name.toLowerCase());
}

/**
 * Returns alexa semantics object for a given list of parameters
 *  https://developer.amazon.com/docs/device-apis/alexa-discovery.html#semantics-object
 *
 *  {
 *    'actionMappings': [
 *      { 'name': <actionName1>, 'directive': { 'name': <directiveName>, 'payload': <directivePayload } },
 *      ...
 *    ],
 *    'stateMappings': [
 *      { 'name': <stateName1>, 'value': <stateValue> },
 *      { 'name': <stateName2>, 'range': <rangeValues> },
 *      ...
 *    ]
 *  }
 *
 * @param  {Object} parameters
 * @return {Object}
 */
function getSemanticsObject(parameters = {}) {
  return Object.assign({
  }, parameters.actionMappings && {
    actionMappings: parameters.actionMappings.reduce((actions, {name, directive}) => {
      // Define action semantic id
      const action = 'Alexa.Actions.' + name;
      // Add mapping if action supported and not already defined in action mappings
      if (isSupportedSemanticId(action) && !actions.some(mapping => mapping.actions.includes(action))) {
        // Find defined action mappings index with same directive
        const index = actions.findIndex(mapping => JSON.stringify(mapping.directive) === JSON.stringify(directive));
        // Update existing mapping actions list if found, otherwise add new mapping
        if (index > -1) {
          actions[index].actions.push(action);
        } else {
          actions.push({
            '@type': 'ActionsToDirective',
            'actions': [action],
            'directive': directive
          });
        }
      }
      return actions;
    }, [])
  }, parameters.stateMappings && {
    stateMappings: parameters.stateMappings.reduce((states, {name, range, value}) => {
      // Define state semantic id
      const state = 'Alexa.States.' + name;
      // Add mapping if state supported and not already defined in state mappings
      if (isSupportedSemanticId(state) && !states.some(mapping => mapping.states.includes(state))) {
        // Find defined state mappings index with same value/range
        const index = states.findIndex(mapping => mapping.value === value &&
          JSON.stringify(mapping.range) === JSON.stringify(range));
        // Update existing mapping states list if found, otherwise add new mapping
        //  with range property if defined, otherwise with value property
        if (index > -1) {
          states[index].states.push(state);
        } else if (range) {
          states.push({
            '@type': 'StatesToRange',
            'states': [state],
            'range': range
          });
        } else {
          states.push({
            '@type': 'StatesToValue',
            'states': [state],
            'value': value
          });
        }
      }
      return states;
    }, [])
  });
}

/**
 * Determines if semantic id is supported
 * @param  {String}  semanticId
 * @return {Boolean}
 */
function isSupportedSemanticId(semanticId) {
  const [type, name] = semanticId.split('.').slice(1);
  return typeof SEMANTIC_IDENTIFIERS[type] !== 'undefined' && SEMANTIC_IDENTIFIERS[type].includes(name);
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
 * @param  {String} interfaceName
 * @param  {String} propertyName
 * @return {Object}
 */
function getPropertySettings(interfaceName, propertyName) {
  // Get capability properties, based on interface name without instance
  const capability = CAPABILITIES[interfaceName.match(INTERFACE_PATTERN)[1]];
  // Get property settings, based on property name without component or tag
  const property = capability && capability.properties.find(
    property => property.name === propertyName.match(PROPERTY_PATTERN)[1]) || {};

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
 * Returns thermostat setpoint mode properties list
 * @param  {String} thermostatMode
 * @param  {Object} properties
 * @return {Array}
 */
function getThermostatSetpointProperties(thermostatMode, properties) {
  // Determine setpoint properties based on thermostat mode and specific setpoint-named configured properties
  if (thermostatMode === 'AUTO' || thermostatMode === 'ECO') {
    const taggedProperties = Object.keys(properties).filter(name => name.toUpperCase().endsWith('#' + thermostatMode));
    // Use tagged properties setpoints if defined, otherwise upper/lower setpoints, fallback to target setpoint
    if (taggedProperties.length === 2) {
      return taggedProperties.map(name => name + '@' + name.split('#').shift());
    } else if (properties.upperSetpoint && properties.lowerSetpoint) {
      return ['upperSetpoint', 'lowerSetpoint'];
    } else if (properties.targetSetpoint) {
      return ['targetSetpoint'];
    }
  } else if (thermostatMode === 'COOL') {
    // Use target setpoint if defined, otherwise fallback to upper setpoint mapped as target setpoint
    if (properties.targetSetpoint) {
      return ['targetSetpoint'];
    } else if (properties.upperSetpoint) {
      return ['upperSetpoint@targetSetpoint'];
    }
  } else if (thermostatMode === 'HEAT') {
    // Use target setpoint if defined, otherwise fallback to lower setpoint mapped as target setpoint
    if (properties.targetSetpoint) {
      return ['targetSetpoint'];
    } else if (properties.lowerSetpoint) {
      return ['lowerSetpoint@targetSetpoint'];
    }
  } else if (thermostatMode === 'OFF') {
    // No setpoint
    return [];
  }
  // Return all setpoint-named configured properties as fallback
  return Object.keys(properties).filter(name => name.endsWith('Setpoint'));
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
      'colorTemperatureInKelvin', `.state.property.omitSaturationColorMode.${binding}`);

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
  getThermostatSetpointProperties: getThermostatSetpointProperties,
  getUnitOfMeasure: getUnitOfMeasure,
  isInColorMode: isInColorMode,
  isSupportedDisplayCategory: isSupportedDisplayCategory
};
