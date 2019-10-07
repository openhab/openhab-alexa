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
 * Amazon Echo Smart Home Skill API implementation for openHAB (v2)
 */
const log = require('@lib/log.js');
const rest = require('@lib/rest.js');

let directive;
let context;

/**
 * Handles request
 * @param  {Object} _directive
 * @param  {Object} _context
 */
exports.handleRequest = function (_directive, _context) {
  directive = _directive;
  context = _context;

  const namespace = directive.header.namespace;
  const name = directive.header.name;

  switch (namespace) {
    /**
     * The namespace of 'Discovery' indicates a request is being made to the lambda for
     * discovering all appliances associated with the customer's appliance cloud account.
     * can use the accessToken that is made available as part of the payload to determine
     * the customer.
     */
    case 'Alexa.ConnectedHome.Discovery':
      this.handleDiscovery();
      break;

    /**
     * The namespace of 'Control' indicates a request is being made to us to turn a
     * given device on, off or brighten. This message comes with the 'appliance'
     * parameter which indicates the appliance that needs to be acted on.
     */
    case 'Alexa.ConnectedHome.Control':
    case 'Alexa.ConnectedHome.Query':
      this.handleControl();
      break;

    /**
     *  Requests the availability of the skill adapter. These are periodically sent by
     *  the Smart Home Skill API to the skill adapter.
     */
    case 'Alexa.ConnectedHome.System':
      // TODO - handle unhealthy device responses
      if (name === 'HealthCheckRequest') {
        const headers = {
          messageId: directive.header.messageId,
          name: directive.header.name.replace('Request', 'Response'),
          namespace: directive.header.namespace,
          payloadVersion: directive.header.payloadVersion
        };
        const payload = {
          description: 'The system is currently healthy',
          isHealthy: true
        };
        const result = {
          header: headers,
          payload: payload
        };

        returnAlexaResponse(result);
      }
      break;

    /**
     * We received an unexpected message
     */
    default:
      returnAlexaGenericErrorResponse({
        message: 'namespace not supported.'
      });
      break;
  }
}

/**
 * This method is invoked when we receive a 'Discovery' message from Alexa Smart Home Skill.
 * We are expected to respond back with a list of appliances that we have discovered for a given
 * customer.
 */
exports.handleDiscovery = function () {
  /**
   * Crafting the response header
   */
  const header = {
    messageId: directive.header.messageId,
    name: directive.header.name.replace('Request', 'Response'),
    namespace: directive.header.namespace,
    payloadVersion: directive.header.payloadVersion
  };

  /**
   * Craft the final response back to Alexa Smart Home Skill. This will include all the
   * discoverd appliances.
   */

  discoverDevices(directive.payload.accessToken, function (devices) {
    /**
     * Response body will be an array of discovered devices.
     */
    const payload = {
      discoveredAppliances: devices
    };
    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  }, function (error) {
    returnAlexaGenericErrorResponse(error);
  });
};

/**
 * Control messages are processed here.
 * This is called when Alexa requests an action (IE turn off appliance).
 */
exports.handleControl = function () {
  /**
   * Make a remote call to execute the action based on accessToken and the applianceId and the switchControlAction
   * Some other examples of checks:
   *	validate the appliance is actually reachable else return TARGET_OFFLINE error
   *	validate the authentication has not expired else return EXPIRED_ACCESS_TOKEN error
   * Please see the technical documentation for detailed list of errors
   */
  switch (directive.header.name) {
  case 'TurnOnRequest':
  case 'TurnOffRequest':
    turnOnOff();
    break;
  case 'GetTemperatureReadingRequest':
    getCurrentTemperature();
    break;
  case 'GetTargetTemperatureRequest':
    getTargetTemperature();
    break;
  case 'SetTargetTemperatureRequest':
  case 'IncrementTargetTemperatureRequest':
  case 'DecrementTargetTemperatureRequest':
    adjustTemperature();
    break;
  case 'SetPercentageRequest':
  case 'IncrementPercentageRequest':
  case 'DecrementPercentageRequest':
    adjustPercentage();
    break;
  case 'SetColorRequest':
    adjustColor();
    break;
  case 'GetLockStateRequest':
    getLockState();
    break;
  case 'SetLockStateRequest':
    setLockState();
    break;
  }
};

/**
 * Turns a Switch Item on or off
 */
function turnOnOff() {
  const success = function () {
    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Confirmation'),
      namespace: directive.header.namespace,
        payloadVersion: directive.header.payloadVersion
    };

    const payload = {};

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  const state = directive.header.name === 'TurnOnRequest' ? 'ON' : 'OFF';

  rest.postItemCommand(directive.payload.accessToken, directive.payload.appliance.applianceId,
    state).then(success, failure);
}

/**
 * Adjust a percentage value on a item
 **/
function adjustPercentage() {

  //is this a set command, or Inc/Dec command
  const isSetCommand = directive.header.name === 'SetPercentageRequest';

  /**
   * Success functon for sending a percentage change command to OH
   */
  const itemPostSuccess = function () {

    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Confirmation'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const payload = {};

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  /**
   * Success Function for retrieveing an items state to use for INC/DEC logic
   */
  const itemGetSuccess = function (item) {

    log.debug('adjustPercentage: item state ' +
      item.state + ' delta ' + directive.payload.deltaPercentage.value);

    //inc/dec command
    //skip this if we don't have a number to start with
    if (isNaN(item.state)) {
      failure({
        message: 'Could not get numberic item state'
      });
      return;
    }

    const state = parseInt(item.state);

    let value;
    if (directive.header.name === 'IncrementPercentageRequest') {
      value = state + parseInt(directive.payload.deltaPercentage.value);
      if (value > 100) {
        value = 100;
      }
    } else {
      value = state - parseInt(directive.payload.deltaPercentage.value);
      if (value < 0) {
        value = 0;
      }
    }

    rest.postItemCommand(directive.payload.accessToken, directive.payload.appliance.applianceId,
      value.toString()).then(itemPostSuccess, failure);
  };

  /**
   * Failure Function used for both retieveing items and posting item commands.
   */
  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  if (isSetCommand) {
    rest.postItemCommand(directive.payload.accessToken, directive.payload.appliance.applianceId,
      directive.payload.percentageState.value.toString()).then(itemPostSuccess, failure);
  } else {
    rest.getItem(directive.payload.accessToken, directive.payload.appliance.applianceId).then(
      itemGetSuccess, failure);
  }
}

/**
 * Color control
 */
function adjustColor() {
  const success = function () {
    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Confirmation'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const payload = {
      achievedState : {
        color : directive.payload.color
      }
    };

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  const h = directive.payload.color.hue;
  const s = directive.payload.color.saturation * 100.0;
  const b = directive.payload.color.brightness * 100.0;
  const state = h + ',' + s + ',' + b;
  rest.postItemCommand(directive.payload.accessToken, directive.payload.appliance.applianceId,
    state).then(success, failure);
}

/**
 * Retrives the current temperature of a Thermostat or standalone currentTemperature tagged item
 **/
function getCurrentTemperature() {

  const success = function (item) {
    //if this is a thermostat group, get the currentTemperature item
    if (item.type == 'Group') {
      const items = getThermostatItems(item.members);
      item = items.currentTemperature;
    }

    if (!item || isNaN(item.state)) {
      failure({
        message: 'thermostat missing current temperature'
      });
      return;
    }

    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Response'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const value = parseFloat(item.state);
    const scale = directive.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit' ?
      'FAHRENHEIT' : 'CELSIUS';
    const payload = {
      temperatureReading: {
        value: value,
        scale: scale
      },
      applianceResponseTimestamp: new Date().toISOString()
    };

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  rest.getItem(directive.payload.accessToken, directive.payload.appliance.applianceId).then(
    success, failure);
}

/**
 * Retrives the current target temperature of a Thermostat
 **/
function getTargetTemperature() {

  const success = function (thermostatGroup) {

    const items = getThermostatItems(thermostatGroup.members);

    if (!items.targetTemperature || isNaN(items.targetTemperature.state)) {
      failure({
        message: 'thermostat missing current temperature'
      });
      return;
    }

    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Response'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const value = parseFloat(items.targetTemperature.state);
    const scale = directive.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit' ?
      'FAHRENHEIT' : 'CELSIUS';
    const mode = items.heatingCoolingMode ?
      normalizeThermostatMode(items.heatingCoolingMode.state) : 'AUTO';

    const payload = {
      targetTemperature: {
        value: value,
        scale: scale
      },
      applianceResponseTimestamp: new Date().toISOString(),
      temperatureMode: {
        value : mode
      }
    };

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  rest.getItem(directive.payload.accessToken, directive.payload.appliance.applianceId).then(
    success, failure);
}

/**
 * Adjust a thermostat's temperature by first reading its current values
 **/
function adjustTemperature() {

  const success = function (response) {
    const items = getThermostatItems(response.members);
    adjustTemperatureWithItems(items.currentTemperature, items.targetTemperature, items.heatingCoolingMode);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  rest.getItem(directive.payload.accessToken, directive.payload.appliance.applianceId).then(
    success, failure);
}

/**
 * Adjust a thermostat's temperature based on its current actual readings.
 **/
function adjustTemperatureWithItems(currentTemperature, targetTemperature, heatingCoolingMode) {

  const success = function () {

    const curMode = heatingCoolingMode ? normalizeThermostatMode(heatingCoolingMode.state) : 'AUTO';

    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Confirmation'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const payload = {
      targetTemperature: {
        value: setValue,
        scale: scale
      },
      temperatureMode: {
        value: curMode
      },
      previousState: {
        targetTemperature: {
          value: curValue,
          scale: scale
        },
        mode: {
          value: curMode
        }
      }
    };

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  if (!targetTemperature) {
    failure({
      message: 'Missing target temperature!'
    });
    return;
  }

  const curValue = parseFloat(targetTemperature.state);
  const scale = directive.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit' ?
    'FAHRENHEIT' : 'CELSIUS';

  /**
   * Alexa needs everything in Celsius, we will need to respect what a user has set
   */
  let setValue;
  switch (directive.header.name) {
    case 'SetTargetTemperatureRequest':
      setValue = scale === 'FAHRENHEIT' ?
        directive.payload.targetTemperature.value * 9 / 5 + 32 : directive.payload.targetTemperature.value;
      break;
    case 'IncrementTargetTemperatureRequest':
      setValue = curValue + directive.payload.deltaTemperature.value;
      break;
    case 'DecrementTargetTemperatureRequest':
      setValue = curValue - directive.payload.deltaTemperature.value;
      break;
  }

  log.debug('adjustTemperature setValue: ' + setValue);

  rest.postItemCommand(directive.payload.accessToken, targetTemperature.name,
    setValue.toString()).then(success, failure);
}

/**
 * Get lock state
 */
function getLockState() {
  const success = function (item) {
    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Response'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };
    const payload = {
      lockState: item.state == 'ON' ? 'LOCKED' : 'UNLOCKED'
    };
    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };
  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };
  rest.getItem(directive.payload.accessToken, directive.payload.appliance.applianceId).then(
    success, failure);
}

/**
 * Set lock state
 */
function setLockState() {
  const success = function () {
    const header = {
      messageId: directive.header.messageId,
      name: directive.header.name.replace('Request', 'Confirmation'),
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    const payload = {
      lockState: directive.payload.lockState //signal success
    };

    const result = {
      header: header,
      payload: payload
    };

    returnAlexaResponse(result);
  };

  const failure = function (error) {
    returnAlexaGenericErrorResponse(error);
  };

  const state = directive.payload.lockState === 'LOCKED' ? 'ON' : 'OFF';

  rest.postItemCommand(directive.payload.accessToken, directive.payload.appliance.applianceId,
    state).then(success, failure);
}

/**
 * Generate Control Error Response
 * @param  {String} name
 * @param  {Object} payload
 * @return {Object}
 */
function generateControlError(name, payload) {
  const header = {
    namespace: directive.header.namespace,
    name: name,
    payloadVersion: directive.header.payloadVersion,
    messageId: directive.header.messageId
  };

  const result = {
    header: header,
    payload: payload
  };

  return result;
}

/**
 * Returns Alexa response
 * @param  {Object} response
 */
function returnAlexaResponse(response) {
  log.info('Response:', response);
  context.succeed(response);
}

/**
 * Returns Alexa generic error response
 * @param  {Object} error
 */
function returnAlexaGenericErrorResponse(error) {
  // Define log level channel as warn if not instance of Error or is Request/StatusCodeError, otherwise as error
  const level = error instanceof Error === false ||
    ['RequestError', 'StatusCodeError'].includes(error.name) ? 'warn' : 'error';
  // Define error message using message property if not instance of Error,
  //  otherwise specific error property for request and status code errors, fallback to stack trace property
  const message = error instanceof Error === false ? error.message :
    error.name === 'RequestError' ? 'Request' + error.message :
    error.name === 'StatusCodeError' ? 'StatusCodeError: ' + error.statusCode :
    error.stack.split(/\n\s+/).slice(0, 2).join(' ');
  // Log error object in debug channel
  log.debug('Error:', error);
  // Log error message with essential directive properties in defined log level channel
  log[level](message, {directive: {
    namespace: directive.header.namespace,
    name: directive.header.name,
    payload: directive.payload
  }});
  context.done(null, generateControlError('DependentServiceUnavailableError', {
    dependentServiceName: error.message
  }));
}

/**
 * Add all devices that have been tagged
 **/
function discoverDevices(token, success, failure) {

  //callback for successfully getting items from rest call
  const getSuccess = function (items) {
    log.debug('Data:', {items: items});
    const discoverdDevices = [];

    items.forEach((item) => {
      item.tags.forEach((tag) => {
        /**
         * An array of actions that this device supports.
         **/
        let actions;

        /**
         * A list of string name-value pairs that provide additional information about a device for use by the skill adapter. The contents of this property cannot exceed 5000 bytes. Also, the Smart Home Skill API  does not understand or use this data.
         **/
        const additionalApplianceDetails = {};

        //checks for a Fahrenheit tag and sets the righ property on the
        //additionalApplianceDetails response object
        const setTempFormat = function () {
          additionalApplianceDetails.temperatureFormat =
            item.tags.find(tag => tag.toLowerCase() === 'fahrenheit') ? 'fahrenheit' : 'celsius';
        };

        /**
         * Appliance and Scene Categories
         * CAMERA	Indicates media devices with video or photo capabilities.
         * LIGHT	Indicates light sources or fixtures.
         * SMARTLOCK	Indicates door locks.
         * SMARTPLUG	Indicates modules that are plugged into an existing electrical outlet.	Can control a constiety of devices.
         * SWITCH	Indicates in-wall switches wired to the electrical system.	Can control a constiety of devices.
         * THERMOSTAT	Indicates thermostats that control temperature, stand-alone air conditioners, or heaters with direct temperature control.
         * ACTIVITY_TRIGGER	Describes a combination of devices set to a specific state, when the state change must occur in a specific order. For example, a "watch Neflix" scene might require the
         *   1) TV to be powered on.
         *   2) Input set to HDMI1.	Applies to Scenes
         * SCENE_TRIGGER  Describes a combination of devices set to a specific state, when the order of the state change is not important. For example a bedtime scene might include turning off lights and lowering the thermostat, but the order is unimportant.	Applies to Scenes
         **/
        let applianceTypes = [];

        switch (tag) {
          case 'Lock':
            actions = [
              'getLockState',
              'setLockState'
            ];
            applianceTypes = ['SMARTLOCK'];
            break;
          case 'Outlet':
            actions = [
              'turnOn',
              'turnOff'
            ];
            applianceTypes = ['SMARTPLUG'];
            break;
          case 'Lighting':
            actions = getSwitchableActions(item);
            applianceTypes = ['LIGHT'];
            break;
          case 'Switchable':
            actions = getSwitchableActions(item);
            applianceTypes = ['SWITCH'];
            break;
          case 'CurrentTemperature':
            //if this is not part of a thermostatGroup then add it
            //standalone otherwise it will be available as a thermostat
            if (!items.find(group => item.groupNames.includes(group.name) && group.tags.includes('Thermostat'))) {
              actions = [
                'getTemperatureReading'
              ];
              setTempFormat();
              applianceTypes = ['TEMPERATURE_SENSOR'];
            }
            break;
          case 'Thermostat':
            //only group items are allowed to have a Temperature tag
            if (item.type === 'Group') {
              actions = [
                'setTargetTemperature',
                'incrementTargetTemperature',
                'decrementTargetTemperature',
                'getTargetTemperature',
                'getTemperatureReading'
              ];
              setTempFormat();
              applianceTypes = ['THERMOSTAT'];
            }
            break;
          default:
            break;
        }

        if (typeof actions !== 'undefined') {
          log.debug('Discovery adding ' + item.name + ' with tag: ' + tag);
          discoverdDevices.push({
            actions: actions,
            applianceTypes: applianceTypes,
            applianceId: item.name,
            manufacturerName: 'openHAB',
            modelName: tag,
            version: '2',
            friendlyName: item.label,
            friendlyDescription: item.type + ' ' + item.name + ' ' + tag + ' via openHAB',
            isReachable: true,
            additionalApplianceDetails: Object.assign(additionalApplianceDetails, {
              itemType: item.type,
              itemTag: tag,
              openhabVersion: '2'
            })
          });
        }
      })
    });
    success(discoverdDevices);
  };
  rest.getItems(token).then(getSuccess, failure);
}

/**
 * Given an item, returns an array of action that are supported.
 * @param  {Object} item
 * @return {Array}
 */
function getSwitchableActions(item) {
  switch (item.type === 'Group' ? item.groupType : item.type) {
    case 'Switch':
      return [
        'turnOn',
        'turnOff'
      ];
    case 'Dimmer':
      return [
        'incrementPercentage',
        'decrementPercentage',
        'setPercentage',
        'turnOn',
        'turnOff'
      ];
    case 'Color':
      return [
        'incrementPercentage',
        'decrementPercentage',
        'setPercentage',
        'turnOn',
        'turnOff',
        'setColor'
      ];
    case 'Rollershutter':
      return [
        'setPercentage',
        'incrementPercentage',
        'decrementPercentage'
      ];
  }
}

/**
 * Rerturns a thermostat object based on memebers of a thermostat tagged group
 * @param  {Array} thermoGroup
 * @return {Object}
 */
function getThermostatItems(thermoGroup) {
  const values = {};
  thermoGroup.forEach((member) => {
    member.tags.forEach((tag) => {
      if (tag === 'CurrentTemperature') {
        values.currentTemperature = member;
      }
      if (tag === 'TargetTemperature') {
        values.targetTemperature = member;
      }
      if (tag === 'homekit:HeatingCoolingMode') {
        values.heatingCoolingMode = member;
      }
    });
  });
  return values;
}

/**
 * Define alexa thermostat mode mapping based on binding used in OH
 * @type {Object}
 */
const THERMOSTAT_MODE_MAPPING = {
  'ecobee1': {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', OFF: 'off'},
  'nest': {AUTO: 'HEAT_COOL', COOL: 'COOL', HEAT: 'HEAT', ECO: 'ECO', OFF: 'OFF'},
  'nest1': {AUTO: 'heat-cool', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'},
  'zwave1': {AUTO: '3', COOL: '2', HEAT: '1', OFF: '0'},
  'default': {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'}
};

/**
 * Normalizes thermostat modes based on binding name
 *   Alexa: AUTO, COOL, HEAT, ECO, OFF
 *   OH: depending on thermostat binding or user mappings defined
 *
 * @param  {String} mode
 * @param  {Object} parameters
 * @return {String}
 */
function normalizeThermostatMode(mode, parameters = {}) {
  const alexaModes = Object.keys(THERMOSTAT_MODE_MAPPING.default);
  const bindingName = parameters.binding ? parameters.binding.toLowerCase() : 'default';
  const userMap = Object.keys(parameters).reduce((map, param) => {
    return Object.assign(map, alexaModes.includes(param) ? {[param]: parameters[param]} : {});
  }, {});
  const thermostatModeMap = Object.keys(userMap).length > 0 ? userMap : THERMOSTAT_MODE_MAPPING[bindingName];

  // Convert Alexa to OH
  if (alexaModes.includes(mode)) {
    return thermostatModeMap[mode];
  }
  // Convert OH to Alexa
  else {
    return Object.keys(thermostatModeMap).reduce((result, alexaMode) => {
      if (typeof thermostatModeMap[alexaMode] !== 'undefined' &&
        thermostatModeMap[alexaMode].toString() === mode.toString()) result = alexaMode;
      return result;
    }, mode);
  }
}
