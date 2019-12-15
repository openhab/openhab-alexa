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
const { sprintf } = require('sprintf-js');
const utils = require('@lib/utils.js');
const { getPropertySettings, getPropertyStateMap, getThermostatSetpointProperties,
  getUnitOfMeasure, isInColorMode, isSupportedDisplayCategory } = require('./capabilities.js');
const { CAPABILITY_PATTERN, INTERFACE_PATTERN, PROPERTY_PATTERN } = require('./config.js');
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
  'actionMappings': 'list',
  'friendlyNames': 'list',
  'itemStateRetrievable': 'boolean',
  'nonControllable': 'boolean',
  'ordered': 'boolean',
  'presets': 'list',
  'stateMappings': 'list',
  'supportedArmStates': 'list',
  'supportedInputs': 'list',
  'supportedModes': 'list',
  'supportsDeactivation': 'boolean',
  'supportsPinCodes': 'boolean',
  'supportsSetpointMode': 'boolean',
};

/**
 * Defines setpoint mapping format pattern
 * @type {RegExp}
 */
const SETPOINT_MAPPING_PATTERN = /^(\w+)(?:#(\w+))?@(\w+)$/;

/**
 * Defines item state presentation format pattern
 * @type {RegExp}
 */
const STATE_PRESENTATION_PATTERN = /[\d.]+\s*(?=.{1,4}$)([%'"]|°[CF]?|[a-zA-Z/]+\d?)$/;

/**
 * Defines normalize parameters functions
 * @type {Object}
 */
const normalizeParameters = {
  /**
   * Normalizes arm state parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  armState: function (property, item, settings) {
    // Use property state map to determine security panel supported arm states if not defined
    const armStates = property.parameters.supportedArmStates || Object.keys(getPropertyStateMap(property));
    // Update supported arm states parameter removing invalid values based on alexa supported arm states
    property.parameters.supportedArmStates = armStates.reduce(
      (states, value) => states.concat(settings.property.state.supported.includes(value) ? value : []), []);
    // Update exit delay parameters within alexa supported spread (0-255) if defined
    property.parameters.exitDelay = !isNaN(property.parameters.exitDelay) ? property.parameters.exitDelay > 0 ?
      property.parameters.exitDelay < 255 ? property.parameters.exitDelay : 255 : 0 : undefined;
    // Remove pin codes support parameters if item type not string
    if (item.type !== 'String') {
      delete property.parameters.supportsPinCodes;
    }
  },

  /**
   * Normalizes arm state parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  colorTemperatureInKelvin: function (property, item, settings) {
    // Use binding parameter or item channel metadata value to determine binding name & thing type
    const [binding, thingType] = property.parameters.binding && property.parameters.binding.split(':') ||
      item.metadata.channel && item.metadata.channel.value && item.metadata.channel.value.split(':') || [];
    // Use range parameter to determine color temperature range ([0] => minimum; [1] => maximum)
    let temperatureRange = (property.parameters.range || '').split(':').map(value => parseInt(value));
    // Update range values if not valid (min >= max) using custom values based on binding name & thing type
    if (temperatureRange.length !== 2 || temperatureRange.some(value => isNaN(value)) ||
      temperatureRange[0] >= temperatureRange[1]) {
      temperatureRange = settings.property.state.range['custom:binding'][binding] &&
        settings.property.state.range['custom:binding'][binding](thingType);
    }
    // Set range parameter
    property.parameters.range = temperatureRange;
  },

  /**
   * Normalizes equalizer bands parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  equalizerBands: function (property, item, settings) {
    // Define equalizer range based on range parameter ([0] => minimum; [1] => maximum)
    let equalizerRange = (property.parameters.range || '').split(':').map(value => parseInt(value));
    // Update range values if not valid (min >= max) using default based on item type
    if (equalizerRange.length !== 2 || equalizerRange.some(value => isNaN(value)) ||
      equalizerRange[0] >= equalizerRange[1]) {
      equalizerRange = settings.property.state.range.default[item.type.split(':').shift()];
    }
    // Define equalizer default based on parameter
    const equalizerDefault = parseInt(property.parameters.default);
    // Update default parameter if out of range or not defined using equalizer range midpoint spread
    property.parameters.default = equalizerRange[0] <= equalizerDefault &&
      equalizerDefault <= equalizerRange[1] ? equalizerDefault : (equalizerRange[0] + equalizerRange[1]) / 2;
    // Set range object
    property.parameters.range = {'minimum': equalizerRange[0], 'maximum': equalizerRange[1]};
  },

  /**
   * Normalizes equalizer mode parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  equalizerMode: function (property, item, settings) {
    // Use property state map to determine equalizer supported modes if not defined
    const equalizerModes = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
    // Update supported modes parameter removing invalid values based on alexa equalizer supported modes
    property.parameters.supportedModes = equalizerModes.reduce(
      (modes, value) => modes.concat(settings.property.state.supported.includes(value) ? value : []), []);
    // Set property as invalid if no valid supported modes
    if (property.parameters.supportedModes.length === 0) {
      property.valid = false;
    }
  },

  /**
   * Normalizes inputs parameters
   * @param  {Object} property
   */
  inputs: function (property) {
    // Normalize supported input names removing invalid values in the process
    property.parameters.supportedInputs = (property.parameters.supportedInputs || []).reduce(
      (inputs, value) => inputs.concat(normalize(property, value) || []), []);
    // Set property as invalid if no valid supported inputs
    if (property.parameters.supportedInputs.length === 0) {
      property.valid = false;
    }
  },

  /**
   * Normalizes mode parameters
   * @param  {Object} property
   * @param  {Object} item
   */
  mode: function (property, item) {
    // Use item state description options to determine supported modes and its mapping if not already defined
    if (item.stateDescription && item.stateDescription.options && !property.parameters.supportedModes) {
      property.parameters.supportedModes = item.stateDescription.options.reduce((modes, option) =>
        modes.concat(`${option.value}=${option.label}`), []);
    }
    // Update supported modes using mode as labels if not defined or first element empty
    property.parameters.supportedModes = (property.parameters.supportedModes || []).reduce((modes, value) => {
      const [mode, labels=''] = value.split('=');
      return modes.concat(mode ? `${mode}=${labels.match(/^(:|$)/) ? mode : ''}${labels}` : []);
    }, []);
    // Update action mappings parameter removing invalid mappings if defined
    if (property.parameters.actionMappings) {
      property.parameters.actionMappings = property.parameters.actionMappings.reduce((actions, mapping) => {
        const [name, value=''] = mapping.split('=');
        const directive = value.match(/^\([+-]?\d+\)$/) ? {
          name: 'AdjustMode', payload: {'modeDelta': parseInt(value.slice(1, -1))}
        } : {
          name: 'SetMode', payload: {'mode': value}
        };
        // Add action mapping object if adjust directive, mode delta numerical and ordered property,
        //  or if set directive and mode value supported
        return actions.concat(
          directive.name === 'AdjustMode' &&
            !isNaN(directive.payload.modeDelta) && property.parameters.ordered ||
          directive.name === 'SetMode' &&
            property.parameters.supportedModes.find(mode => mode.startsWith(`${value}=`)) ? {
              name: name, directive: directive} : []);
      }, []);
    }
    // Update state mappings parameter removing invalid mappings if defined
    if (property.parameters.stateMappings) {
      property.parameters.stateMappings = property.parameters.stateMappings.reduce((states, mapping) => {
        const [name, value] = mapping.split('=');
        // Add state mapping object if mode value supported
        return states.concat(
          property.parameters.supportedModes.find(mode => mode.startsWith(`${value}=`)) ? {
            name: name, value: value} : []);
      }, []);
    }
    // Set property as invalid if not at least two valid supported modes
    if (property.parameters.supportedModes.length < 2) {
      property.valid = false;
    }
  },

  /**
   * Normalizes range value parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  rangeValue: function (property, item, settings) {
    // Define range values based on supported range parameter ([0] => minimum; [1] => maximum; [2] => precision)
    let rangeValues = (property.parameters.supportedRange || '').split(':').map(value => parseFloat(value));
    // Update range values if not valid (min >= max; prec = 0; max - min <= prec) using default based on item type
    if (rangeValues.length !== 3 || rangeValues.some(value => isNaN(value)) || rangeValues[0] >= rangeValues[1] ||
      rangeValues[2] === 0 || rangeValues[1] - rangeValues[0] <= Math.abs(rangeValues[2])) {
      rangeValues = settings.property.state.range.default[item.type.split(':').shift()];
    }
    // Set supported range object
    property.parameters.supportedRange = {
      'minimumValue': rangeValues[0], 'maximumValue': rangeValues[1], 'precision': Math.abs(rangeValues[2])};
    // Update presets parameter removing out of range values if defined
    if (property.parameters.presets) {
      property.parameters.presets = property.parameters.presets.reduce((presets, value) => {
        const [preset, labels] = value.split('=');
        return presets.concat(rangeValues[0] <= preset && preset <= rangeValues[1] && labels ? value : []);
      }, []);
    }
    // Use item state presentation symbol and type dimension to determine unitOfMeasure if not defined or valid
    if (!property.parameters.unitOfMeasure || !getUnitOfMeasure({id: property.parameters.unitOfMeasure})) {
      property.parameters.unitOfMeasure = getUnitOfMeasure({
        dimension: item.type.split(':')[1],
        symbol: getStatePresentationSymbol(item.stateDescription && item.stateDescription.pattern),
        system: settings.regional &&
          (settings.regional.measurementSystem || settings.regional.region),
        property: 'id'
      });
    }
    // Update action mappings parameter removing invalid mappings if defined
    if (property.parameters.actionMappings) {
      property.parameters.actionMappings = property.parameters.actionMappings.reduce((actions, mapping) => {
        const [name, value=''] = mapping.split('=');
        const directive = value.match(/^\([+-]?\d+\.?\d*\)$/) ? {
          name: 'AdjustRangeValue', payload: {
            'rangeValueDelta': parseFloat(value.slice(1, -1)), 'rangeValueDeltaDefault': false}
        } : {
          name: 'SetRangeValue', payload: {
            'rangeValue': parseFloat(value)}
        };
        // Add action mapping object if adjust directive and range delta valid,
        //  or if set directive and range value valid
        return actions.concat(
          directive.name === 'AdjustRangeValue' &&
            rangeValues[1] - rangeValues[0] > Math.abs(directive.payload.rangeValueDelta) ||
          directive.name === 'SetRangeValue' &&
            rangeValues[0] <= value && value <= rangeValues[1] ? {
              name: name, directive: directive} : []);
      }, []);
    }
    // Update state mappings parameter removing out of range values if defined
    if (property.parameters.stateMappings) {
      property.parameters.stateMappings = property.parameters.stateMappings.reduce((states, mapping) => {
        const [name, ...values] = mapping.split(/[=:]/);
        // Add state mapping object if value(s) valid
        return states.concat(
          values.length > 0 &&
            values.every(value => rangeValues[0] <= value && value <= rangeValues[1]) ? Object.assign({
              name: name
            }, values.length === 2 ? {
              range: {'minimumValue': parseFloat(values[0]), 'maximumValue': parseFloat(values[1])}
            } : {
              value: parseFloat(values[0])
            }) : []);
      }, []);
    }
  },

  /**
   * Normalizes temperature parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  temperature: function (property, item, settings) {
    // Use scale parameter uppercased to determine temperature scale
    let temperatureScale = (property.parameters.scale || '').toUpperCase();
    // Use item state presentation symbol and regional settings to determine temperature scale if not already defined
    if (!temperatureScale) {
      temperatureScale = getUnitOfMeasure({
        dimension: 'Temperature',
        symbol: getStatePresentationSymbol(item.stateDescription && item.stateDescription.pattern),
        system: settings.regional &&
          (settings.regional.measurementSystem || settings.regional.region),
        property: 'unit'
      });
    }
    // Set scale parameter
    property.parameters.scale = temperatureScale === 'FAHRENHEIT' ? 'FAHRENHEIT' : 'CELSIUS';
    // Use setpoint range parameter to determine thermostat temperature range ([0] => minimum; [1] => maximum)
    const setpointRange = (property.parameters.setpointRange || '').split(':').map(value => parseFloat(value));
    // Set setpoint range parameter if valid (min < max)
    property.parameters.setpointRange = setpointRange[0] < setpointRange[1] ? setpointRange : undefined;
  },

  /**
   * Normalizes thermostat mode parameters
   * @param  {Object} property
   * @param  {Object} item
   * @param  {Object} settings
   */
  thermostatMode: function (property, item, settings) {
    // Use item channel metadata value to determine binding parameter if not defined
    if (item.metadata.channel && item.metadata.channel.value && !property.parameters.binding) {
      property.parameters.binding = item.metadata.channel.value.split(':').shift();
    }
    // Use property state map to determine thermostat supported modes if not defined
    const thermostatModes = property.parameters.supportedModes || Object.keys(getPropertyStateMap(property));
    // Update supported modes parameter removing invalid values based on alexa thermostat supported modes
    property.parameters.supportedModes = thermostatModes.reduce(
      (modes, value) => modes.concat(settings.property.state.supported.includes(value) ? value : []), []);
    // Remove supported modes parameter if includes every alexa thermostat supported modes
    if (settings.property.state.supported.every(mode => property.parameters.supportedModes.includes(mode))) {
      delete property.parameters.supportedModes;
    }
  },

  /**
   * Normalizes toggle state parameters
   * @param  {Object} property
   */
  toggleState: function (property) {
    // Update action mappings parameter removing invalid toggle value if defined
    if (property.parameters.actionMappings) {
      property.parameters.actionMappings = property.parameters.actionMappings.reduce((actions, mapping) => {
        const [name, value] = mapping.replace(/=\w+/, (text) => text.toUpperCase()).split('=');
        const directive = {name: value === 'ON' ? 'TurnOn' : 'TurnOff', payload: {}};
        // Add action mapping object if toggle value valid
        return actions.concat(value === 'ON' || value === 'OFF' ? {name: name, directive: directive} : []);
      }, []);
    }
    // Update state mappings parameter removing invalid toggle value if defined
    if (property.parameters.stateMappings) {
      property.parameters.stateMappings = property.parameters.stateMappings.reduce((states, mapping) => {
        const [name, value] = mapping.replace(/=\w+/, (text) => text.toUpperCase()).split('=');
        // Add state mapping object if toggle value valid
        return states.concat(value === 'ON' || value === 'OFF' ? {name: name, value: value} : []);
      }, []);
    }
  }
};

/**
 * Returns item state presentation symbol
 * @param  {String} format
 * @return {String}
 */
function getStatePresentationSymbol(format) {
  try {
    // Use a random number to format the state presentation
    return sprintf(format, Math.random()).match(STATE_PRESENTATION_PATTERN)[1];
  } catch (e) {
    return '';
  }
}

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
   * @param  {Object} settings
   */
  addItem(item, settings = {}) {
    const propertyMap = this;
    let matches;

    item.metadata.alexa.value.split(',').forEach((capability) => {
      if ((matches = capability.match(CAPABILITY_PATTERN))) {
        // Extract capability matching values
        let [interfaceName, propertyName, component, tag] = matches.slice(1);
        // Get capability property settings
        settings = Object.assign({}, settings, {property: getPropertySettings(interfaceName, propertyName)});
        // Append item name to interface name, as instance name, if property multi-instance-enabled
        interfaceName += settings.property.multiInstance ? ':' + item.name : '';
        // Append component name to property name, if component-enabled and defined
        propertyName += settings.property.components && component ? ':' + component : '';
        // Append tag name to property name, if tag-enabled and valid
        propertyName += settings.property.tags && settings.property.tags.includes(tag) ? '#' + tag : '';

        // Skip capability if already added
        if (propertyMap[interfaceName] && propertyMap[interfaceName][propertyName]) {
          return;
        }
        // Skip capability if its item (group)type not supported by capability
        if (!settings.property.itemTypes || !settings.property.itemTypes.includes(item.groupType || item.type)) {
          return;
        }
        // Skip capability if component-enabled and not valid
        if (settings.property.components && !settings.property.components.includes(component)) {
          return;
        }

        // Copy current capability properties
        const properties = Object.assign({}, propertyMap[interfaceName]);
        // Initialize capability property object to be added
        const property = {
          parameters: Object.assign({}, item.metadata.alexa.config),
          item: {
            name: item.name,
            type: item.groupType || item.type
          },
          schema: {
            name: settings.property.schema
          }
        };

        // Delete friendly names and action/state mappings parameters if not multi-instance property,
        //  otherwise set friendly names parameter to use item label & synonyms, if not already defined
        if (!settings.property.multiInstance) {
          delete property.parameters.friendlyNames;
          delete property.parameters.actionMappings;
          delete property.parameters.stateMappings;
        } else if (!property.parameters.friendlyNames) {
          property.parameters.friendlyNames = [
            item.label, item.metadata.synonyms && item.metadata.synonyms.value].filter(Boolean).join(',');
        }

        // Set item state retrievable parameter to use autoupdate metadata value, if not already defined
        if (item.metadata.autoupdate && !property.parameters.itemStateRetrievable) {
          property.parameters.itemStateRetrievable = item.metadata.autoupdate.value;
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
                value = value.split(',').map(value => value.trim()).filter(
                  (value, index, array) => array.indexOf(value) === index);
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

        // Normalize property parameters based on schema name if method defined
        if (typeof normalizeParameters[property.schema.name] === 'function') {
          normalizeParameters[property.schema.name](property, item, settings);
        }

        // Add property to map object if valid
        if (property.valid !== false) {
          propertyMap[interfaceName] = Object.assign(properties, {[propertyName]: property});
        }
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
   * Returns alexa context properties response for a given list of interface names and reportable properties items
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
   * @param  {Array}   items
   * @return {Object}
   */
  getContextPropertiesResponse(interfaceNames, items) {
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

    // Iterate over reportable properties
    this.getReportableProperties(interfaceNames).forEach((property) => {
      const interfaceName = property.interface;
      const instance = property.instance;
      // Define property name based on report setting if defined, fallback to name
      const propertyName = property.settings.report || property.name;
      const component = property.component;
      const type = property.settings.state && property.settings.state.type;
      let state = property.state;

      // Skip property if not reportable, its state or type not defined
      if (property.settings.isReportable === false || typeof state === 'undefined' || typeof type === 'undefined') {
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
          property.name === propertyName && property.instance === instance);
        if (property) {
          property.value = property.value.concat(state);
          return;
        }
      }

      // Add property state to response
      response.push(generateProperty('Alexa.' + interfaceName, propertyName, state, instance));
    });

    // Define endpoint health status based on every reportable properties item states being defined
    const isEndpointHealthy = items.every(item => typeof item.state !== 'undefined');

    // Add connectivity property state to response if endpoint healthly or at least one property response present
    if (isEndpointHealthy || response.length > 0) {
      response.push(generateProperty('Alexa.EndpointHealth', 'connectivity', {
        value: isEndpointHealthy ? 'OK' : 'UNREACHABLE'}));
    }

    return response;
  }

  /**
   * Returns list of reportable properties for a given list of interface names
   *   based on alexa api interface-specific properties requirements
   *
   *  Properties array return format:
   *    [
   *      {
   *        interface: <interfaceName1>,
   *        instance: <interfaceInstanceName1>,
   *        name: <propertyName1>,
   *        component: <propertyComponentName1>,
   *        tag: <propertyTageName1>,
   *        settings: <propertySettings>,
   *        state: <propertyState>,
   *      },
   *      ...
   *    ]
   *
   * @param  {Array} interfaceNames
   * @return {Array}
   */
  getReportableProperties(interfaceNames) {
    const propertyMap = this;

    // Determine properties from interface names
    let properties = interfaceNames.reduce((properties, interfaceName) => {
      Object.keys(propertyMap[interfaceName]).forEach((propertyName) => {
        const property = {};
        // Extract instance name from interface name
        [property.interface, property.instance] = interfaceName.match(INTERFACE_PATTERN).slice(1);
        // Extract component and tag from property name
        [property.name, property.component, property.tag] = propertyName.match(PROPERTY_PATTERN).slice(1);
        // Get property settings
        property.settings = getPropertySettings(interfaceName, propertyName);
        // Get normalized property state
        property.state = normalize(propertyMap[interfaceName][propertyName]);
        // Add property to object
        properties.push(property);
      });
      return properties;
    }, []);

    // ColorController & ColorTemperatureController interface properties requirements:
    //  - exclude temperature property if in color mode, otherwise exclude color property
    if (interfaceNames.includes('ColorController') && interfaceNames.includes('ColorTemperatureController')) {
      const colorItem = propertyMap.ColorController.color.item;
      const temperatureItem = propertyMap.ColorTemperatureController.colorTemperatureInKelvin.item;
      const binding = propertyMap.ColorTemperatureController.colorTemperatureInKelvin.parameters.binding;

      // Update properties list based on color mode
      if (isInColorMode(colorItem, temperatureItem, binding)) {
        // Remove ColorTemperatureController interface properties
        properties = properties.filter(property => property.interface !== 'ColorTemperatureController');
        // Set state to zero to exclude item from health check
        temperatureItem.state = 0;
      } else {
        // Remove ColorController interface properties
        properties = properties.filter(property => property.interface !== 'ColorController');
      }
    }

    // ThermostatController interface properties requirements:
    //  - exclude specific setpoints properties depending on current thermostat setpoints mode
    //  - update setpoint alias property report name if defined (e.g. upperSetpoint@targetSetpoint => targetSetpoint)
    if (interfaceNames.includes('ThermostatController')) {
      // Determine alexa normalized thermostat mode if property defined
      const thermostatMode = propertyMap.ThermostatController.thermostatMode &&
        normalize(propertyMap.ThermostatController.thermostatMode);
      // Determine setpoint mode properties based on thermostat mode
      const setpointProperties = getThermostatSetpointProperties(thermostatMode, propertyMap.ThermostatController);
      // Define thermostat controller reportable properties
      const thermostatProperties = [].concat('thermostatMode',
        setpointProperties.map(property => property.split('@').shift()));
      // Update properties based on thermostat controller reportable properties with tags
      properties = properties.filter(property => property.interface !== 'ThermostatController' ||
        thermostatProperties.includes(property.name + (property.tag ? '#' + property.tag : '')));
      // Update property report settings for setpoint properties with mapping alias
      setpointProperties.filter(property => property.split('@').length === 2).forEach(mapping => {
        const [name, tag, report] = mapping.match(SETPOINT_MAPPING_PATTERN).slice(1);
        const property = properties.find(property =>
          property.interface === 'ThermostatController' && property.name === name && property.tag === tag);
        property.settings.report = report;
      });
    }

    return properties;
  }

  /**
   * Returns list of reportable items for a given list of interface names
   *
   *  Items array return format:
   *    [
   *      {
   *        name: <name1>,
   *        param1: <param1>, (item parameter stored in property map)
   *        ...
   *      },
   *      ...
   *    ]
   *
   * @param  {Array} interfaceNames
   * @param  {Array} propertyNames  [property names filter] (optional)
   * @return {Array}
   */
  getReportableItems(interfaceNames, propertyNames) {
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

        const item = items.find(item => item.name === properties[propertyName].item.name);
        // Add property item object to list if not included yet, otherwise update its item reference
        if (typeof item === 'undefined') {
          items.push(properties[propertyName].item);
        } else {
          properties[propertyName].item = item;
        }
      });
      return items;
    }, []);
  }
}

module.exports = AlexaPropertyMap;
