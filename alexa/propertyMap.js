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
const { CAPABILITY_PATTERN, THERMOSTAT_MODES, UNIT_OF_MEASUREMENT } = require('./config.js');
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
  'friendlyNames': 'list',
  'ordered': 'boolean',
  'presets': 'list',
  'supportedInputs': 'list',
  'supportedModes': 'list',
  'supportsDeactivation': 'boolean'
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
        const propertySettings = getPropertySettings(capability);
        // Append item name, as instance name, if property multi-instance enabled
        const interfaceName = matches[1] + (propertySettings.multiInstance ? ':' + item.name : '');
        const propertyName = matches[2];
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

        // Set friendly names parameter on property multi-instance enabled to use item label if not defined
        if (propertySettings.multiInstance && !property.parameters.friendlyNames && item.label) {
          property.parameters.friendlyNames = item.label;
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

        // Update specific parameters based on schema name
        switch (property.schema.name) {
          case 'inputs':
            // Normalize supported input names removing invalid values in the process
            property.parameters.supportedInputs = (property.parameters.supportedInputs || []).reduce(
              (inputs, value) => inputs.concat(normalize(property, value) || []), []);
            break;

          case 'temperature':
            // Use unit of measurement item state symbol to determine scale parameter if not already defined
            if (item.type === 'Number:Temperature' && !property.parameters.scale) {
              const symbol = item.state.split(' ').pop();
              const measurement = UNIT_OF_MEASUREMENT['Temperature'].find(meas => meas.symbol === symbol) || {};
              property.parameters.scale = measurement.unit;
            }
            // Use regional settings measurementSystem or region to determine scale parameter if not already defined
            if (globalSettings.regional && !property.parameters.scale) {
              const setting = globalSettings.regional.measurementSystem || globalSettings.regional.region;
              property.parameters.scale = setting === 'US' ? 'FAHRENHEIT' : setting === 'SI' ? 'CELSIUS' : undefined;
            }
            break;

          case 'thermostatMode':
            // Use property state map to determine thermostat supported modes if not defined
            const thermostatModes = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
            // Update supported modes parameter removing invalid values based on alexa thermostat supported modes
            property.parameters.supportedModes = thermostatModes.reduce(
              (modes, value) => modes.concat(THERMOSTAT_MODES.includes(value) ? value : []), []);
            // Remove supported modes parameter if includes every alexa thermostat supported modes
            if (THERMOSTAT_MODES.every(mode => property.parameters.supportedModes.includes(mode))) {
              delete property.parameters.supportedModes;
            }
            break;

          case 'mode':
            // Use item state description options to determine supported modes and its mapping if not already defined
            if (item.stateDescription && item.stateDescription.options && !property.parameters.supportedModes) {
              property.parameters.supportedModes = item.stateDescription.options.reduce((modes, option) => {
                property.parameters[option.label] = option.value;
                return modes.concat(option.label);
              }, []);
            }
            break;

          case 'rangeValue':
            // Define range values based on supported range parameter ([0] => minimum; [1] => maximum; [2] => precision)
            let rangeValues = (property.parameters.supportedRange || '').split(':').map(value => parseInt(value));
            // Update range values if not valid (min >= max; max - min <= precision) using default based on item type
            if (rangeValues.length !== 3 || rangeValues.some(value => isNaN(value)) ||
              rangeValues[0] >= rangeValues[1] || rangeValues[1] - rangeValues[0] <= Math.abs(rangeValues[2])) {
              rangeValues = ['Dimmer', 'Rollershutter'].includes(item.type) ? [0, 100, 1] : [0, 10, 1];
            }
            // Set supported range object
            property.parameters.supportedRange = {
              'minimumValue': rangeValues[0], 'maximumValue': rangeValues[1], 'precision': Math.abs(rangeValues[2])};
            // Remove invalid presets from parameter
            property.parameters.presets = (property.parameters.presets || []).reduce((presets, value) => {
              const presetValue = parseInt(value.split(':').shift());
              return rangeValues[0] <= presetValue && presetValue <= rangeValues[1] && value.split(':').length > 1 ?
                [].concat(presets || [], value) : presets;
            }, undefined);
            // Use unit of measurement item state symbol and type dimension to determine unitOfMeasure if not defined
            if (item.type.startsWith('Number:') && !property.parameters.unitOfMeasure) {
              const symbol = item.state.split(' ').pop();
              const dimension = item.type.split(':').pop();
              const measurement = UNIT_OF_MEASUREMENT[dimension].find(meas => meas.symbol === symbol) || {};
              property.parameters.unitOfMeasure = measurement.id;
            }
            // Remove unitOfMeasure parameter if not found in unit of measurement flattened values
            if (property.parameters.unitOfMeasure && !Object.values(UNIT_OF_MEASUREMENT).reduce((values, item) =>
              values.concat(item), []).find(meas => meas.id === property.parameters.unitOfMeasure)) {
              delete property.parameters.unitOfMeasure;
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

    // Returns property object for a given namespace, name, value and instance
    const generateProperty = function (namespace, name, value, instance) {
      return Object.assign({
        namespace: namespace,
        name: name
      }, instance && {
        instance: instance
      }, {
        value: value,
        timeOfSample: utils.date(),
        uncertaintyInMilliseconds: 0
      });
    };

    // Iterate over interface and property names
    interfaceNames.forEach((interfaceName) => {
      Object.keys(propertyMap[interfaceName]).forEach((propertyName) => {
        let state = normalize(propertyMap[interfaceName][propertyName]);
        let instance;

        // Extract instance name from interface name if present
        if (interfaceName.split(':').length === 2) {
          [interfaceName, instance] = interfaceName.split(':');
        }

        // Get capability property settings
        const capability = [interfaceName, propertyName].join('.');
        const propertySettings = getPropertySettings(capability);
        const type = propertySettings.state && propertySettings.state.type;

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
        response.push(generateProperty('Alexa.' + interfaceName, propertyName, state, instance));
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
