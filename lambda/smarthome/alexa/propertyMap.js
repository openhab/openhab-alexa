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
 * Amazon Smart Home Skill Property Map for API V3
 */
const camelcase = require('camelcase');
const utils = require('@lib/utils.js');
const { getPropertySettings, getPropertyStateMap, isSupportedDisplayCategory } = require('./capabilities.js');
const { CAPABILITY_PATTERN, UNIT_OF_MEASUREMENT } = require('./config.js');
const { normalize } = require('./propertyState.js');

/**
 * Defines parameter item property format pattern
 * @type {RegExp}
 */
const PARAMETER_ITEM_PATTERN = /^item(\w+)$/;

/**
 * Defines parameter resources single element format pattern
 * @type {RegExp}
 */
const PARAMETER_RESOURCES_PATTERN = /^(\w+)(?:=(.+))?$/;

/**
 * Defines parameter type mapping
 * @type {Object}
 */
const PARAMETER_TYPE_MAPPING = {
  'friendlyNames': 'list',
  'ordered': 'boolean',
  'presets': 'list',
  'supportedArmStates': 'list',
  'supportedInputs': 'list',
  'supportedModes': 'list',
  'supportsDeactivation': 'boolean',
  'supportsPinCodes': 'boolean'
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
      if ((matches = capability.match(CAPABILITY_PATTERN))) {
        const propertySettings = getPropertySettings(matches[1], matches[2]);
        // Append item name, as instance name, if property multi-instance enabled
        const interfaceName = matches[1] + (propertySettings.multiInstance ? ':' + item.name : '');
        // Append component name if property components required
        const propertyName = matches[2] + (propertySettings.components ? ':' + matches[3] : '');
        const component = matches[3];
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

        // Skip property if its item (group)type not supported by capability
        if (!propertySettings.itemTypes || !propertySettings.itemTypes.includes(item.groupType || item.type)) {
          return;
        }

        // Skip property if component-enabled and not valid
        if (propertySettings.components && !propertySettings.components.includes(component)) {
          return;
        }

        // Set friendly names parameter on multi-instance property to use item synonyms metadata or label if not defined
        if (propertySettings.multiInstance && !property.parameters.friendlyNames) {
          property.parameters.friendlyNames = item.metadata.synonyms && item.metadata.synonyms.value || item.label;
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
          if ((matches = parameter.match(PARAMETER_ITEM_PATTERN))) {
            const setting = camelcase(matches[1]);  // e.g. itemSensor => sensor
            property.item[setting] = property.item[setting] || property.parameters[parameter];
            delete property.parameters[parameter];
          }
        });

        // Update specific parameters based on schema name
        switch (property.schema.name) {
          case 'inputs': {
            // Normalize supported input names removing invalid values in the process
            property.parameters.supportedInputs = (property.parameters.supportedInputs || []).reduce(
              (inputs, value) => inputs.concat(normalize(property, value) || []), []);
            break;
          }
          case 'temperature': {
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
          }
          case 'thermostatMode': {
            // Use item channel metadata value to determine binding parameter if not defined
            if (item.metadata.channel && item.metadata.channel.value && !property.parameters.binding) {
              property.parameters.binding = item.metadata.channel.value.split(':').shift();
            }
            // Use property state map to determine thermostat supported modes if not defined
            const thermostatModes = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
            // Update supported modes parameter removing invalid values based on alexa thermostat supported modes
            property.parameters.supportedModes = thermostatModes.reduce(
              (modes, value) => modes.concat(propertySettings.state.supported.includes(value) ? value : []), []);
            // Remove supported modes parameter if includes every alexa thermostat supported modes
            if (propertySettings.state.supported.every(mode => property.parameters.supportedModes.includes(mode))) {
              delete property.parameters.supportedModes;
            }
            break;
          }
          case 'armState': {
            // Use property state map to determine security panel supported arm states if not defined
            const armStates = property.parameters.supportedArmStates || Object.keys(getPropertyStateMap(property));
            // Update supported arm states parameter removing invalid values based on alexa supported arm states
            property.parameters.supportedArmStates = armStates.reduce(
              (states, value) => states.concat(propertySettings.state.supported.includes(value) ? value : []), []);
            // Update exit delay parameters within alexa supported spread (0-255) if defined
            property.parameters.exitDelay = !isNaN(property.parameters.exitDelay) ? property.parameters.exitDelay > 0 ?
              property.parameters.exitDelay < 255 ? property.parameters.exitDelay : 255 : 0 : undefined;
            // Remove pin codes support parameters if item type not string
            if (item.type !== 'String') {
              delete property.parameters.supportsPinCodes;
            }
            break;
          }
          case 'equalizerBands': {
            // Define equalizer range based on range parameter ([0] => minimum; [1] => maximum)
            let equalizerRange = (property.parameters.range || '').split(':').map(value => parseInt(value));
            // Update range values if not valid (min >= max) using default based on item type
            if (equalizerRange.length !== 2 || equalizerRange.some(value => isNaN(value)) ||
              equalizerRange[0] >= equalizerRange[1]) {
              equalizerRange = item.type === 'Dimmer' ? [0, 100] : [-10, 10];
            }
            // Define equalizer default based on parameter
            const equalizerDefault = parseInt(property.parameters.default);
            // Update default parameter if out of range or not defined using equalizer range midpoint spread
            property.parameters.default = equalizerRange[0] <= equalizerDefault &&
              equalizerDefault <= equalizerRange[1] ? equalizerDefault : (equalizerRange[0] + equalizerRange[1]) / 2;
            // Set range object
            property.parameters.range = {'minimum': equalizerRange[0], 'maximum': equalizerRange[1]};
            break;
          }
          case 'equalizerMode': {
            // Use property state map to determine equalizer supported modes if not defined
            const equalizerModes = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
            // Update supported modes parameter removing invalid values based on alexa equalizer supported modes
            property.parameters.supportedModes = equalizerModes.reduce(
              (modes, value) => modes.concat(propertySettings.state.supported.includes(value) ? value : []), []);
            break;
          }
          case 'mode': {
            // Use item state description options to determine supported modes and its mapping if not already defined
            if (item.stateDescription && item.stateDescription.options && !property.parameters.supportedModes) {
              property.parameters.supportedModes = item.stateDescription.options.reduce((modes, option) =>
                modes.concat(`${option.value}=${option.label}`), []);
            }
            // Update supported modes using mode as labels if not defined or first element empty
            property.parameters.supportedModes = (property.parameters.supportedModes || []).reduce((modes, value) => {
              // eslint-disable-next-line no-unused-vars
              const [match, mode, labels=''] = value.match(PARAMETER_RESOURCES_PATTERN) || [];
              return modes.concat(mode ? `${mode}=${labels.match(/^(:|$)/) ? mode : ''}${labels}` : []);
            }, []);
            break;
          }
          case 'rangeValue': {
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
            // Update presets parameter removing out of range values
            property.parameters.presets = (property.parameters.presets || []).reduce((presets, value) => {
              const [match, preset, labels=''] = value.match(PARAMETER_RESOURCES_PATTERN) || [];
              return rangeValues[0] <= preset && preset <= rangeValues[1] && labels ?
                [].concat(presets || [], match) : presets;
            }, undefined);
            // Use unit of measurement item state symbol and type dimension to determine unitOfMeasure if not defined
            if (item.type.startsWith('Number:') && !property.parameters.unitOfMeasure) {
              const symbol = item.state.split(' ').pop();
              const dimension = item.type.split(':').pop();
              const measurement = UNIT_OF_MEASUREMENT[dimension].find(meas => meas.symbol === symbol) || {};
              property.parameters.unitOfMeasure = measurement.id;
            }
            // Remove unitOfMeasure parameter if not found in supported unit of measurement
            if (property.parameters.unitOfMeasure && !Object.keys(UNIT_OF_MEASUREMENT).some(dimension =>
              UNIT_OF_MEASUREMENT[dimension].find(meas => meas.id === property.parameters.unitOfMeasure))) {
              delete property.parameters.unitOfMeasure;
            }
            break;
          }
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
   *        instance: <propertyInstance>,
   *        value: <propertyState>,
   *        timeOfSample: <timeOfSample>,
   *        uncertaintyInMilliseconds: 0
   *      },
   *      ...
   *    ]
   *
   * @param  {Array}   interfaceNames
   * @param  {Boolean} isEndpointHealthy  [endpoint health status] (optional)
   * @return {Object}
   */
  getContextPropertiesResponse(interfaceNames, isEndpointHealthy = true) {
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
        // Get normalized property state
        let state = normalize(propertyMap[interfaceName][propertyName]);
        let component, instance;
        // Extract instance name from interface name
        [interfaceName, instance] = interfaceName.split(':');
        // Extract component from property name
        [propertyName, component] = propertyName.split(':');
        // Get capability property settings
        const propertySettings = getPropertySettings(interfaceName, propertyName);
        const propertyReportName = propertySettings.report || propertyName;
        const type = propertySettings.state && propertySettings.state.type;

        // Skip property if not reportable, its state or type not defined
        if (propertySettings.isReportable === false || typeof state === 'undefined' || typeof type === 'undefined') {
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

        // Update state if component defined
        if (component) {
          state = [{'name': component.toUpperCase(), 'value': state}];
          // Concatenate state to property reponse value and go to next property if previously added
          const property = response.find(property => property.namespace === 'Alexa.' + interfaceName &&
            property.name === propertyReportName && property.instance === instance);
          if (property) {
            property.value = property.value.concat(state);
            return;
          }
        }

        // Add property state to response
        response.push(generateProperty('Alexa.' + interfaceName, propertyReportName, state, instance));
      });
    });

    // Add connectivity property state to response if endpoint healthly or at least one property response present
    if (isEndpointHealthy || response.length > 0) {
      response.push(generateProperty('Alexa.EndpointHealth', 'connectivity', {
        value: isEndpointHealthy ? 'OK' : 'UNREACHABLE'}));
    }

    return response;
  }

  /**
   * Returns list of reportable properties item objects for a given list of interface names
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
   * @param  {Array} propertyNames  [property names filter] (optional)
   * @return {Array}
   */
  getReportablePropertiesItems(interfaceNames, propertyNames) {
    const propertyMap = this;

    return interfaceNames.reduce((items, interfaceName) => {
      const properties = propertyMap[interfaceName] || {};
      Object.keys(properties).forEach((propertyName) => {
        // Skip property if not included in property names list
        if (Array.isArray(propertyNames) && !propertyNames.includes(propertyName)) {
          return;
        }
        // Skip property if not reportable
        if (getPropertySettings(interfaceName, propertyName).isReportable === false) {
          return;
        }
        // Add/update item object with capability to list
        const capability = {interface: interfaceName, property: propertyName};
        const item = Object.assign({}, properties[propertyName].item);
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
