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
const { CAPABILITIES, PROPERTY_SCHEMAS, DISPLAY_CATEGORIES, CAPABILITY_PATTERN } = require('./config.js');

/**
 * Returns alexa capability display category for a given interface
 * @param  {String} interfaceName
 * @return {String}
 */
function getCapabilityCategory(interfaceName) {
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
 * @return {Object}
 */
function getCapabilityInterface(interfaceName, properties) {
  const capability = {
    'type': 'AlexaInterface',
    'interface': interfaceName === 'Alexa'? 'Alexa' : 'Alexa.' + interfaceName,
    'version': '3',
  };
  const configuration = {};
  const resources = {};
  const supported = [];

  // Determines if capability standard
  const isStandardCapability = function () {
    const standardKeys = ['type', 'interface', 'version', 'capabilityResources', 'properties', 'configuration'];
    return Object.keys(capability).every(key => standardKeys.includes(key));
  };

  // Return capability if 'Alexa' interface name
  if (interfaceName === 'Alexa') {
    return capability;
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
        if (parameters.supportedModes) {
          configuration.supportedModes = parameters.supportedModes;
        }
        break;
    }
  });

  // Update capability with common properties, if deemed standard
  if (isStandardCapability()) {
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
  const match = capability.match(CAPABILITY_PATTERN);
  const interfaceName = match && match[1];
  const propertyName = match && match[2];
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
  const defaultMap = stateMap['default'] && stateMap['default'][type];

  // Use default map keys as alexa states if defined,
  //  otherwise use supportedModes parameter states (e.g. '<mode1>:<akaMode1>,...')
  const alexaStates = defaultMap ? Object.keys(defaultMap) : supportedModes.map(mode => mode.split(':').shift());
  // Define user map using property parameters keys present in alexa states list
  const userMap = Object.keys(parameters).reduce((map, param) => {
    return Object.assign(map, alexaStates.includes(param) && {[param]: parameters[param]});
  }, {});

  return Object.keys(userMap).length > 0 ? userMap : customMap || defaultMap || {};
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
