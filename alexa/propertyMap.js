/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * Amazon Smart Home Skill Property Map for API V3
 */
const camelcase = require('camelcase');
const utils = require('@lib/utils.js');
const { getPropertySettings, getPropertyStateMap, isSupportedDisplayCategory } = require('./capabilities.js');
const { CAPABILITY_PATTERN, THERMOSTAT_MODES } = require('./config.js');
const { normalize } = require('./propertyState.js');

/**
 * Defines parameter item property format pattern
 * @type {RegExp}
 */
const PARAMETER_ITEM_PATTERN = /^item(\w+)$/;

/**
 * Defines parameter type mapping
 * @type {Object}
 */
const PARAMETER_TYPE_MAPPING = {
  'supportedInputs': 'list',
  'supportedModes': 'list',
  'supportsDeactivation': 'boolean'
};

/**
 * Defines unit of measurement scale mapping
 * @type {Object}
 */
const UNIT_MEASUREMENT_SCALE_MAPPING = {
  '°C': 'CELSIUS',
  '°F': 'FAHRENHEIT'
};

/**
 * Defines property map class to associate items to an endpoint from metadata, per the description below:
 *
 * openHAB Metadata
 *
 * Number FooTargetSetPoint "Foo Target SetPoint" {alexa="ThermostatController.targetSetpoint" [scale="Fahrenheit"]}
 * Number FooUpperSetPoint  "Foo Upper SetPoint"  {alexa="ThermostatController.upperSetpoint" [scale="Fahrenheit"]}
 * Number FooLowerSetPoint  "Foo Lower SetPoint"  {alexa="ThermostatController.lowerSetpoint" [scale="Fahrenheit"]}
 * String FooMode           "Foo Mode"            {alexa="ThermostatController.thermostatMode" [OFF=0,HEAT=1,COOL=2,AUTO=3]}
 * Switch FooSwitch         "FooSwitch"           {alexa="PowerController.powerState"}
 *
 * returns
 *
 * propertyMap:
 *  {
 *    ThermostatController: {
 *      targetSetpoint: {
 *        item: {
 *          name: "FooTargetSetPoint",
 *          type: "Number",
 *        },
 *        schema: {
 *          name: "temperature"
 *        },
 *        parameters: {
 *          scale: "Fahrenheit",
 *        }
 *      },
 *      upperSetpoint: {
 *        item: {
 *          name: "FooTargetSetPoint",
 *          type: "Number",
 *        },
 *        schema: {
 *          name: "temperature"
 *        },
 *        parameters: {
 *          scale: "Fahrenheit",
 *        }
 *      },
 *      lowerSetpoint: {
 *        item: {
 *          name: "FooTargetSetPoint",
 *          type: "Number",
 *        },
 *        schema: {
 *          name: "temperature"
 *        },
 *        parameters: {
 *          scale: "Fahrenheit",
 *        }
 *      },
 *      thermostatMode: {
 *        item: {
 *          name: "FooMode",
 *          type: "Number",
 *        },
 *        schema: {
 *          name: "thermostatMode"
 *        },
 *        parameters: {}
 *      }
 *    },
 *    PowerController: {
 *      powerState: {
 *       item: {
 *         name: "FooSwitch"
 *          type: "Switch",
 *        },
 *        schema: {
 *          name: "powerState"
 *        },
 *        parameters: {}
 *      }
 *    }
 *
*/
class AlexaPropertyMap {
  /**
   * Clears property map object
   */
  clear() {
    Object.keys(this).forEach(property => delete this[property]);
  }

  /**
   * Dumps property map object to string format
   * @return {String}
   */
  dump() {
    return JSON.stringify(this);
  }

  /**
   * Loads json fomated string into property map object
   * @param  {String} propertyMap
   */
  load(propertyMap) {
    Object.assign(this, JSON.parse(propertyMap));
  }

  /**
   * Adds item to property map object
   * @param  {Object} item
   * @param  {Object} globalSettings
   */
  addItem(item, globalSettings = {}) {
    const propertyMap = this;
    let matches;

    item.metadata.alexa.value.split(',').forEach((capability) => {
      if (matches = capability.match(CAPABILITY_PATTERN)) {
        const interfaceName = matches[1];
        const propertyName = matches[2];
        const propertySettings = getPropertySettings(capability);
        const properties = propertyMap[interfaceName] || {};
        const property = {
          parameters: item.metadata.alexa.config || {},
          item: {
            name: item.name,
            type: item.type
          },
          schema:{
            name: propertySettings.schema
          }
        };

        // Skip item if its (group)type not supported by capability
        if (!propertySettings.itemTypes || !propertySettings.itemTypes.includes(item.groupType || item.type)) {
          return;
        }

        // Iterate over parameters
        Object.keys(property.parameters).forEach((parameter) => {
          // Convert parameters that have a defined type
          if (PARAMETER_TYPE_MAPPING[parameter]) {
            let value = property.parameters[parameter];
            switch (PARAMETER_TYPE_MAPPING[parameter]) {
              case 'boolean':
                value = ['0', 'false', 'no'].includes(value.toString().toLowerCase()) ? false : true;
                break;
              case 'list':
                value = value.split(',').map(value => value.trim());
                break;
              case 'map':
                value = JSON.parse(value);
                break;
            }
            property.parameters[parameter] = value;
          }

          // Extract item property parameters from metadata config. These parameters start with 'item'.
          if (matches = parameter.match(PARAMETER_ITEM_PATTERN)) {
            const setting = camelcase(matches[1]);  // e.g. itemSensor => sensor
            property.item[setting] = property.item[setting] || property.parameters[parameter];
            delete property.parameters[parameter];
          }
        });

        // Set scale parameter based on unit of measurement number item type if not already defined
        if (item.type.startsWith('Number:') && !property.parameters.scale) {
          const unit = item.state.split(' ').pop();
          property.parameters.scale = UNIT_MEASUREMENT_SCALE_MAPPING[unit];
        }

        // Update specific parameters based on schema name
        switch (property.schema.name) {
          case 'inputs':
            // Normalize supported input names removing invalid values in the process
            property.parameters.supportedInputs = (property.parameters.supportedInputs || []).reduce(
              (inputs, value) => inputs.concat(normalize(property, value) || []), []);
            break;
          case 'temperature':
            // Use regional settings measurementSystem or region to determine scale if not already defined
            if (globalSettings.regional && !property.parameters.scale) {
              const setting = globalSettings.regional.measurementSystem || globalSettings.regional.region;
              property.parameters.scale = setting === 'US' ? 'FAHRENHEIT' : 'CELSIUS';
            }
            break;
          case 'thermostatMode':
            // Use property state map to determine thermostat supported modes if not defined, removing invalid values
            const values = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
            const supportedModes = values.reduce(
              (modes, value) => modes.concat(THERMOSTAT_MODES.includes(value) ? value : []), []);
            // Update supported modes parameter only if subset of alexa thermostat modes, otherwise remove it
            if (supportedModes.length > 0 && !THERMOSTAT_MODES.every(mode => supportedModes.includes(mode))) {
              property.parameters.supportedModes = supportedModes;
            } else {
              delete property.parameters.supportedModes;
            }
            break;
        }

        // Add property to map object
        propertyMap[interfaceName] = Object.assign(properties, {[propertyName]: property});
      }
    });
  }

  /**
   * Returns list of categories for a given interface name
   * @param  {String} interfaceName
   * @return {Array}
   */
  getCategories(interfaceName) {
    const properties = this[interfaceName] || {};
    const parameter = 'category';

    return Object.keys(properties).reduce((categories, propertyName) => {
      const category = (properties[propertyName].parameters[parameter] || '').toUpperCase();
      if (!categories.includes(category) && isSupportedDisplayCategory(category)) {
        categories.push(category);
      }
      return categories;
    }, []);
  }

  /**
   * Returns alexa context properties response for a given list of interface names
   *
   *  Properties array return format:
   *    [
   *      {
   *        namespace: 'Alexa.' + <interfaceName1>,
   *        name: <propertyName1>,
   *        value: <propertyState>,
   *        timeOfSample: <timeOfSample>,
   *        uncertaintyInMilliseconds: 0
   *      },
   *      ...
   *    ]
   *
   * @param  {Array}  interfaceNames
   * @return {Object}
   */
  getContextPropertiesResponse(interfaceNames) {
    const propertyMap = this;
    const response = [];

    // Returns property object for a given namespace, name and value
    const generateProperty = function (namespace, name, value) {
      return {
        namespace: namespace,
        name: name,
        value: value,
        timeOfSample: utils.date(),
        uncertaintyInMilliseconds: 0
      };
    };

    // Iterate over interface and property names
    interfaceNames.forEach((interfaceName) => {
      Object.keys(propertyMap[interfaceName]).forEach((propertyName) => {
        const capability = [interfaceName, propertyName].join('.');
        const propertySettings = getPropertySettings(capability);
        const type = propertySettings.state && propertySettings.state.type;
        let state = normalize(propertyMap[interfaceName][propertyName]);

        // Skip property if not reportable or its state type not defined
        if (propertySettings.isReportable === false || typeof type === 'undefined') {
          return;
        }

        // Convert property state to defined type if currently string
        if (typeof state === 'string') {
          switch (type) {
            case 'boolean':
              state = state === 'true';
              break;
            case 'float':
              state = parseFloat(state);
              break;
            case 'integer':
              state = parseInt(state);
              break;
          }
        }

        // Add property state to response
        response.push(generateProperty('Alexa.' + interfaceName, propertyName, state));
      });
    });

    // Add connectivity property state to response
    response.push(generateProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}));

    return response;
  }

  /**
   * Returns list of item objects for a given list of interface names
   *
   *  Items array return format:
   *    [
   *      {
   *        name: <name1>,
   *        param1: <param1>, (item parameter stored in property map)
   *        ...
   *        capabilities: [
   *          {
   *            interface: <interfaceName1>, property: <propertyName1>
   *          },
   *          ...
   *        ]
   *      },
   *      ...
   *    ]
   *
   * @param  {Array} interfaceNames
   * @return {Array}
   */
  getItemsByInterfaces(interfaceNames) {
    const propertyMap = this;

    return interfaceNames.reduce((items, interfaceName) => {
      const properties = propertyMap[interfaceName] || {};
      Object.keys(properties).forEach((propertyName) => {
        const capability = {interface: interfaceName, property: propertyName};
        const item = properties[propertyName].item;
        const index = items.findIndex(i => i.name === item.name);

        if (index === -1) {
          items.push(Object.assign(item, {capabilities: [capability]}));
        } else {
          items[index].capabilities.push(capability);
        }
      });
      return items;
    }, []);
  }
}

module.exports = AlexaPropertyMap;
