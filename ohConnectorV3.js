/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * An Amazon Echo Smart Home Skill API implementation for openHAB (v2.x)
 */
var decamelize = require('decamelize');
var uuid = require('uuid/v4');
var log = require('./log.js');
var utils = require('./utils.js');
var rest = require('./rest.js');
var alexaCapabilities = require('./alexaCapabilities.js');
var contextProperties = require('./alexaContextProperties.js');
var PropertyMap = require('./alexaPropertyMap.js');

// Define group endpoint format pattern
var ENDPOINT_PATTERN = /^(?:Alexa\.)?Endpoint\.(\w+)$/;

var directive;
var callback;
var propertyMap;

/**
 * Main entry point for all requests
 * @param {Object}   directive
 * @param {Object}   callback
 */
exports.handleRequest = function (_directive, _callback) {
  directive = _directive;
  callback = _callback;
  propertyMap = new PropertyMap();
  // if we have a JSON cookie, parse it and set on endpoint
  if (directive.endpoint && directive.endpoint.cookie && directive.endpoint.cookie.propertyMap) {
    propertyMap.load(directive.endpoint.cookie.propertyMap);
  }

  var namespace = directive.header.namespace; //ex: Alexa.BrightnessController
  var name = directive.header.name; // ex: AdjustBrightness

  switch (namespace) {
    case 'Alexa':
      switch (name) {
        case 'ReportState':
          reportState();
      }
      break;
    case 'Alexa.Discovery':
      discoverDevices();
      break;
    case 'Alexa.PowerController':
      setPowerState();
      break;
    case 'Alexa.PowerLevelController':
    case 'Alexa.BrightnessController':
    case 'Alexa.PercentageController':
      adjustPercentage();
      break;
    case 'Alexa.ColorController':
      setColor();
      break;
    case 'Alexa.ColorTemperatureController':
      switch(name) {
        case 'SetColorTemperature':
          setColorTemperature();
          break;
        case 'DecreaseColorTemperature':
        case 'IncreaseColorTemperature':
          adjustColorTemperature();
          break;
      }
      break;
    case 'Alexa.ThermostatController':
      switch (name) {
        case 'AdjustTargetTemperature':
          adjustTargetTemperature();
          break;
        case 'SetTargetTemperature':
          setTargetTemperature();
          break;
        case 'SetThermostatMode':
          setThermostatMode();
          break;
      }
      break;
    case 'Alexa.LockController':
      setLockState();
      break;
    case 'Alexa.ChannelController':
      switch (name) {
        case 'ChangeChannel':
          setChannel();
          break;
        case 'SkipChannels':
          adjustChannel();
          break;
      }
      break;
    case 'Alexa.InputController':
      setInput();
      break;
    case 'Alexa.PlaybackController':
      setPlayback();
      break;
    case 'Alexa.SceneController':
      setScene();
      break;
    case 'Alexa.Speaker':
      switch (name) {
        case 'AdjustVolume':
          adjustSpeakerVolume();
          break;
        case 'SetVolume':
          setSpeakerVolume();
          break;
        case 'SetMute':
          setSpeakerMute();
          break;
      }
      break;
    case 'Alexa.StepSpeaker':
      switch (name) {
        case 'AdjustVolume':
          adjustStepSpeakerVolume();
          break;
        case 'SetMute':
          setStepSpeakerMute();
          break;
      }
      break;
    case 'Alexa.CameraStreamController':
      break;
    default:
  }
};

/**
 * Answers a 'ReportState' request.  Returns the state(s) of an endpoint
 */
function reportState() {
  // Generate properties response based on property map received
  //  and return as state report
  getPropertiesResponseAndReturn(null, {header: {name: 'StateReport'}});
}

/**
 * Turns a Switch ON or OFF
 */
function setPowerState() {
  var postItem = Object.assign(propertyMap.PowerController.powerState.item, {
    state: directive.header.name === 'TurnOn' ? 'ON' : 'OFF'
  });
  postItemsAndReturn([postItem], 'PowerController');
}

/**
 * Adjust a percentage value on a item
 */
function adjustPercentage() {
  //is this a set command, or Increment/Decrement command
  var isSetCommand;
  var propertyName;
  var payloadValue;

  switch (directive.header.name) {
    case 'AdjustPowerLevel':
      isSetCommand = false;
      propertyName = 'powerLevel';
      payloadValue = directive.payload.powerLevelDelta;
      break;
    case 'SetPowerLevel':
      isSetCommand = true;
      propertyName = 'powerLevel';
      payloadValue = directive.payload.powerLevel;
      break;
    case 'AdjustPercentage':
      isSetCommand = false;
      propertyName = 'percentage';
      payloadValue = directive.payload.percentageDelta;
      break;
    case 'SetPercentage':
      isSetCommand = true;
      propertyName = 'percentage';
      payloadValue = directive.payload.percentage;
      break;
    case 'AdjustBrightness':
      isSetCommand = false;
      propertyName = 'brightness';
      payloadValue = directive.payload.brightnessDelta;
      break;
    case 'SetBrightness':
      isSetCommand = true;
      propertyName = 'brightness';
      payloadValue = directive.payload.brightness;
      break;
  }
  //remove 'Alexa.' from namespace
  var interfaceName = directive.header.namespace.split('Alexa.')[1];
  var postItem = propertyMap[interfaceName][propertyName].item;
  log.debug('Turning ' + postItem.name + ' to ' + payloadValue);

  //if this is a set command then just post it, otherwise we need to first retrieve the value of the item
  // so we can adjust it and then post it.
  if (isSetCommand) {
    postItem.state = payloadValue;
    postItemsAndReturn([postItem], interfaceName);
  } else {
    getItemState(postItem).then(function (item) {
      log.debug(`adjustPercentage: item state ${item.state} delta ${payloadValue}`);

      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw 'Could not get numeric item state';
      }

      var state = parseInt(item.state) + parseInt(payloadValue);
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      postItemsAndReturn([postItem], interfaceName);
    }).catch(function (error) {
      log.error('adjustPercentage failed with error:', JSON.stringify(error));
      returnAlexaResponse(generateGenericErrorResponse());
    });
  }
}

/**
 * Set the color of a color item
 */
function setColor() {
  var h = directive.payload.color.hue;
  var s = directive.payload.color.saturation * 100.0;
  var b = directive.payload.color.brightness * 100.0;
  var postItem = Object.assign(propertyMap.ColorController.color.item, {
    state: h + ',' + s + ',' + b
  });
  postItemsAndReturn([postItem], 'ColorController');
}

/**
 * Set the color temperature
 */
function setColorTemperature() {
  var properties = propertyMap.ColorTemperatureController;
  var postItem = Object.assign(properties.colorTemperatureInKelvin.item, {
    state: utils.normalizeColorTemperature(directive.payload.colorTemperatureInKelvin,
      properties.colorTemperatureInKelvin.item.type)
  });
  postItemsAndReturn([postItem], 'ColorTemperatureController');
}

/**
 * Adjust the color temperature
 */
function adjustColorTemperature() {
  var properties = propertyMap.ColorTemperatureController;
  var postItem = properties.colorTemperatureInKelvin.item;

  getItemState(postItem).then(function (item) {
    // Generate error if in color mode (color controller property defined & empty state)
    if (propertyMap.ColorController && !parseInt(item.state)) {
      returnAlexaResponse(generateControlError({
        type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
        message: 'The light is currently set to a color.',
        currentDeviceMode: 'COLOR'
      }, directive.header.namespace));
      return;
    }
    // Throw error if state not a number
    if (isNaN(item.state)) {
      throw 'Could not get numeric item state';
    }

    var isIncreaseRequest = directive.header.name === 'IncreaseColorTemperature';
    var increment = parseInt(properties.colorTemperatureInKelvin.parameters.increment);
    var state;

    switch (item.type) {
      case 'Dimmer':
        // Send reverse command/value to OH since cold (0%) and warm (100%), depending if increment defined
        if (isNaN(increment)) {
          state = isIncreaseRequest ? 'DECREASE' : 'INCREASE';
        } else {
          state = parseInt(item.state) + (isIncreaseRequest ? -1 : 1) * increment;
          state = state < 0 ? 0 : state < 100 ? state : 100;
        }
        break;
      case 'Number':
        // Increment current state by defined value as Number doesn't support IncreaseDecreaseType commands
        state = parseInt(item.state) + (isIncreaseRequest ? 1 : -1) * (increment || 500);
        state = utils.normalizeColorTemperature(state, item.type);
        break;
    }

    postItem.state = state;
    postItemsAndReturn([postItem], 'ColorTemperatureController');
  }).catch(function (error) {
    log.error('adjustColorTemperature failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Sets the taget temperature, this can include upper, lower and target setpoints
 * in the same request.
 */
function setTargetTemperature() {
  var properties = propertyMap.ThermostatController;
  // Add requested properties to be updated that are part of the controller properties
  var postItems = Object.keys(properties).reduce(function (items, propertyName) {
    if (directive.payload[propertyName]) {
      items.push(Object.assign(properties[propertyName].item, {
        state: utils.normalizeTemperatureScale(directive.payload[propertyName],
          properties[propertyName].parameters.scale)
      }));
    }
    return items;
  }, []);

  // Support Comfort Ranges if only a target setpoint is sent by Alexa, but a user does not define one.
  // Only works if the user has no defined targetSetpoint, but does define a upper and lower (dual mode)
  if (directive.payload.targetSetpoint && !directive.payload.upperSetpoint && !directive.payload.lowerSetpoint &&
    !properties.targetSetpoint && properties.upperSetpoint && properties.lowerSetpoint) {
    // default range if not set
    var upperRange = properties.upperSetpoint.parameters.scale === 'FAHRENHEIT' ? 1 : .5;
    var lowerRange = properties.lowerSetpoint.parameters.scale === 'FAHRENHEIT' ? 1 : .5;
    // use user defined comfort range if set
    if (typeof properties.upperSetpoint.parameters.comfort_range !== 'undefined') {
      upperRange = parseFloat(properties.upperSetpoint.parameters.comfort_range);
    }
    if (typeof properties.lowerSetpoint.parameters.comfort_range !== 'undefined') {
      lowerRange = parseFloat(properties.lowerSetpoint.parameters.comfort_range);
    }
    // set dual setpoints
    postItems.push(
      Object.assign(properties.upperSetpoint.item, {
        state: utils.normalizeTemperatureScale(directive.payload.targetSetpoint,
          properties.upperSetpoint.parameters.scale) + upperRange
      }),
      Object.assign(properties.lowerSetpoint.item, {
        state: utils.normalizeTemperatureScale(directive.payload.targetSetpoint,
          properties.lowerSetpoint.parameters.scale) - lowerRange
      })
    );
  }

  log.debug('setTargetTemperature to values:', JSON.stringify(postItems));
  postItemsAndReturn(postItems, 'ThermostatController');
}

/**
 * Adjusts the target setpoint + or - the targetSetpointDelta
 */
function adjustTargetTemperature() {
  var properties = propertyMap.ThermostatController;
  var propertyNames = [];
  var promises = [];

  // adjust target setpoint if defined otherwise upper/lower setpoints if in dual mode
  if (properties.targetSetpoint) {
    propertyNames.push('targetSetpoint');
  } else if (properties.upperSetpoint && properties.lowerSetpoint) {
    propertyNames.push('upperSetpoint', 'lowerSetpoint');
  }
  propertyNames.forEach(function (propertyName) {
    promises.push(getItemState(properties[propertyName].item).then(item =>
      Object.assign(properties[propertyName].item, {
        state: parseFloat(item.state) + utils.normalizeTemperatureScale(
          directive.payload.targetSetpointDelta, properties[propertyName].parameters.scale, true)
      })
    ));
  });
  Promise.all(promises).then(function (postItems) {
    log.debug('adjustTargetTemperature to values:', JSON.stringify(postItems));
    postItemsAndReturn(postItems, 'ThermostatController');
  }).catch(function (error) {
    log.error('adjustTargetTemperature failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Sets the mode of the thermostat
 */
function setThermostatMode() {
  var properties = propertyMap.ThermostatController;
  var postItem = Object.assign(properties.thermostatMode.item, {
    state: utils.normalizeThermostatMode(directive.payload.thermostatMode.value,
      properties.thermostatMode.parameters)
  });

  if (typeof postItem.state !== 'undefined') {
    postItemsAndReturn([postItem], 'ThermostatController');
  } else {
    returnAlexaResponse(generateControlError({
      type: 'UNSUPPORTED_THERMOSTAT_MODE',
      message: `${postItem.name} doesn't support thermostat mode [${directive.payload.thermostatMode.value}]`,
    }, directive.header.namespace));
  }
}

/**
 * Locks (ON) or unlocks (OFF) a item
 */
function setLockState() {
  var properties = propertyMap.LockController;
  var postItem = Object.assign(properties.lockState.item, {
    state: directive.header.name.toUpperCase() === 'LOCK' ? 'ON' : 'OFF'
  });
  postItemsAndReturn([postItem], 'LockController');
}

/**
 * Sends the channel value to a string or number item
 */
function setChannel() {
  var properties = propertyMap.ChannelController;
  var postItem = Object.assign(properties.channel.item, {
    state: directive.payload.channel.number ||
      String(properties.channel.parameters[directive.payload.channelMetadata.name.toUpperCase()])
  });

  if (!isNaN(postItem.state)) {
    postItemsAndReturn([postItem], 'ChannelController');
  } else {
    returnAlexaResponse(generateControlError({
      type: 'INVALID_VALUE',
      message: `Invalid channel name [${directive.payload.channelMetadata.name}]`
    }));
  }
}

/**
 * Adjusts the channel value to a number item
 */
function adjustChannel() {
  var postItem = propertyMap.ChannelController.channel.item;
  getItemState(postItem).then(function (item) {
    var state = parseInt(item.state);
    if (isNaN(state)) {
      state = Math.abs(directive.payload.channelCount);
    } else {
      state += directive.payload.channelCount;
    }
    // Value defined as a string in alexa api
    postItem.state = state.toString();
    postItemsAndReturn([postItem], 'ChannelController');
  }).catch(function (error) {
    log.error('adjustChannel failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Sends the input value (HDMI1, Music, etc..) to a string item
 */
function setInput() {
  var postItem = Object.assign(propertyMap.InputController.input.item, {
    state: directive.payload.input.replace(/\s/g, '').toUpperCase()
  });
  postItemsAndReturn([postItem], 'InputController');
}

/**
 * Sends a playback command (PLAY, PASUE, REWIND, etc..) to a string or player item
 */
function setPlayback() {
  var postItem = Object.assign(propertyMap.PlaybackController.playback.item, {
    state: directive.header.name.toUpperCase()
  });
  postItemsAndReturn([postItem], 'PlaybackController');
}

/**
 * Sends a send name to a string item
 */
function setScene() {
  var postItem = Object.assign(propertyMap.SceneController.scene.item, {
    state: directive.header.name === 'Activate' ? 'ON' : 'OFF'
  });
  var response = {
    context: {},
    event: {
      header: generateResponseHeader({
        name: directive.header.name === 'Activate' ? 'ActivationStarted' : 'DeactivationStarted',
        namespace: directive.header.namespace
      }),
      payload: {
        cause: {
          type: 'VOICE_INTERACTION'
        },
        timestamp: utils.date()
      }
    }
  };
  postItemsAndReturn([postItem], 'SceneController', {response: response});
}

/**
 * Adjusts a number + or - the volume payload
 */
function adjustSpeakerVolume() {
  var postItem = propertyMap.Speaker.volume.item;
  var defaultIncrement = parseInt(propertyMap.Speaker.volume.parameters.increment);
  var volumeIncrement = directive.payload.volumeDefault && defaultIncrement > 0 ?
    (directive.payload.volume >= 0 ? 1 : -1) * defaultIncrement : directive.payload.volume;
  getItemState(postItem).then(function (item) {
    var state = parseInt(item.state);
    if (isNaN(state)) {
      state = Math.abs(volumeIncrement);
    } else {
      state += volumeIncrement;
    }
    postItem.state = state;
    postItemsAndReturn([postItem], 'Speaker');
  }).catch(function (error) {
    log.error('adjustSpeakerVolume failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Sets a number item to the volume payload
 */
function setSpeakerVolume() {
  var postItem = Object.assign(propertyMap.Speaker.volume.item, {
    state: directive.payload.volume
  });
  postItemsAndReturn([postItem], 'Speaker');
}

/**
 * Sets a switch item to muted (ON), or unmuted (OFF)
 */
function setSpeakerMute() {
  var postItem = Object.assign(propertyMap.Speaker.muted.item, {
    state: directive.payload.mute ? 'ON' : 'OFF'
  });
  postItemsAndReturn([postItem], 'Speaker');
}

/**
 * Sends a volume step (+1, -1) to a item
 */
function adjustStepSpeakerVolume() {
  var postItem = propertyMap.StepSpeaker.volume.item;
  getItemState(postItem).then(function (item) {
    var state = parseInt(item.state);
    if (isNaN(state)) {
      state = Math.abs(directive.payload.volumeSteps);
    } else {
      state += directive.payload.volumeSteps;
    }
    postItem.state = state;
    postItemsAndReturn([postItem], 'StepSpeaker');
  }).catch(function (error) {
    log.error('adjustStepSpeakerVolume failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Sets a switch item to muted (ON), or unmuted (OFF)
 */
function setStepSpeakerMute() {
  var postItem = Object.assign(propertyMap.StepSpeaker.muted.item, {
    state: directive.payload.mute ? 'ON' : 'OFF'
  });
  postItemsAndReturn([postItem], 'StepSpeaker');
}

/**
 * Generic method to post list of items to OH
 *  and then return a formatted response to the Alexa request
 *
 *
 * @param {Array}  items
 * @param {String} interfaceName
 * @param {Object} parameters     Additional parameters [header, payload, response] (optional)
 */
function postItemsAndReturn(items, interfaceName, parameters = {}) {
  var promises = [];
  items.forEach(function (item) {
    promises.push(rest.postItemCommand(directive.endpoint.scope.token, item.name, item.state));
  });
  Promise.all(promises).then(function () {
    if (parameters.response) {
      log.debug('postItemsAndReturn done with response:', JSON.stringify(parameters.response));
      returnAlexaResponse(parameters.response);
    } else {
      getPropertiesResponseAndReturn(interfaceName, parameters);
    }
  }).catch(function (error) {
    log.error('postItemsAndReturn failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Generic method to generate properties response
 *  based of interface-specific properties latest item state from OH
 *  and then return a formatted response to the Alexa request
 *
 * @param {String} interfaceName
 * @param {Object} parameters     Additional parameters [header, payload, response] (optional)
 */
function getPropertiesResponseAndReturn(interfaceName, parameters = {}) {
  // Use the property map defined interface names if interfaceName not defined (e.g. reportState)
  var interfaceNames = interfaceName ? [interfaceName] : Object.keys(propertyMap);
  // Get list of all unique item objects part of interfaces
  var interfaceItems = propertyMap.getItemsByInterfaces(interfaceNames);
  var promises = [];

  interfaceItems.forEach(function (item) {
    promises.push(getItemState(item).then(function (result) {
      // Update item information in propertyMap object for each item capabilities
      item.capabilities.forEach(function (capability) {
        propertyMap[capability.interface][capability.property].item = result;
      });
      return result;
    }));
  });
  Promise.all(promises).then(function (items) {
    // Throw error if one of the state item is set to 'NULL'
    if (items.find(item => item.state === 'NULL')) {
      throw {message: 'Invalid item state returned by openHAB', items: items};
    }
    // Generate properties response
    var response = {
      context: {
        properties: contextProperties.propertiesResponseForInterfaces(interfaceNames, propertyMap)
      },
      event: {
        header: generateResponseHeader(parameters.header),
        endpoint: {
          scope: directive.endpoint.scope,
          endpointId: directive.endpoint.endpointId
        },
        payload: parameters.payload || {}
      }
    };
    log.debug('getPropertiesResponseAndReturn done with response:', JSON.stringify(response));
    returnAlexaResponse(response);

  }).catch(function (error) {
    log.error('getPropertiesResponseAndReturn failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Returns item state using item sensor name, if defined, over standard one
 * @param  {Object}  item
 * @return {Promise}
 */
function getItemState(item) {
  var itemName = item.sensor || item.name;
  return rest.getItem(directive.endpoint.scope.token, itemName).then(function (result) {
    // Normalize item state
    result.state = utils.normalizeItemState(result);
    return result;
  });
}

/**
 * Returns Alexa response
 * @param  {Object} response
 */
function returnAlexaResponse(response) {
  callback(null, response);
};

/**
 * V3 response header
 * @param  {Object} parameters  [name, namespace]
 * @return {Object}
 */
function generateResponseHeader(parameters = {}) {
  var header = {
    namespace: parameters.namespace || 'Alexa',
    name: parameters.name || 'Response',
    messageId: uuid(),
    payloadVersion: directive.header.payloadVersion
  };
  // Include correlationToken if provided in directive header request
  if (directive.header.correlationToken) {
    header.correlationToken = directive.header.correlationToken;
  }
  return header;
}

/**
 * V3 Control Error Response
 * @param  {Object} payload
 * @param  {String} namespace (optional)
 * @return {Object}
 */
function generateControlError(payload, namespace) {
  var response = {
    event: {
      header: generateResponseHeader({name: 'ErrorResponse', namespace: namespace}),
      payload: payload
    }
  };
  // Include endpoint if provided in directive request
  if (directive.endpoint) {
    response.event.endpoint = directive.endpoint;
  }

  log.debug('generateControlError done with response:', JSON.stringify(response));
  return response;
}

/**
 * V3 Generic Error Response
 * @return {Object}
 */
function generateGenericErrorResponse() {
  return generateControlError({
    type: 'ENDPOINT_UNREACHABLE',
    message: 'Unable to reach device'
  });
}

/**
 * Device discovery
 */
function discoverDevices() {
  //request all items with groups
  rest.getItemsRecursively(directive.payload.scope.token).then(function (items) {
    var discoverdDevices = [];
    //items here are part of a group and should not be added individually
    var groupItems = [];

    //log.debug('GET ITEMS:', JSON.stringify(items));

    //convert v2 style label/tag to v3
    convertV2Items(items);
    //log.debug('Items:', JSON.stringify(items));
    items.forEach(function (item) {
      //this item is already part of a group
      if (groupItems.includes(item.name)) {
        return;  //just returns forEach function
      }
      //array of device capabilities
      var capabilities = [];

      var displayCategories = [];
      function addDisplayCategory(category) {
        category = utils.supportedDisplayCategory(category) ? category : 'OTHER';
        if (!displayCategories.includes(category)) {
          displayCategories.push(category);
        }
      }

      var propertyMap = new PropertyMap();
      var isEndpointGroup = false;

      //OH Goups can act as a single Endpoint using its children for capabilities
      if (item.type === 'Group') {
        item.metadata.alexa.value.split(',').some(function (capability) {
          //found matching Endpoint capability
          var groupMatch;
          if (groupMatch = capability.match(ENDPOINT_PATTERN)) {
            log.debug('found group ' + groupMatch[0] + ' for item ' + item.name);
            isEndpointGroup = true;
            item.members.forEach(function (member) {
              log.debug('adding  ' + member.name + ' to group ' + item.name);
              groupItems.push(member.name);
              propertyMap.addItem(member);
            });
            //set display category for group
            addDisplayCategory(decamelize(groupMatch[1]).toUpperCase());
            return true;
          }
        });
      }

      if (!isEndpointGroup) {
        propertyMap.addItem(item);
      }

      //no capability found
      if (Object.keys(propertyMap).length === 0) {
        return;  //just returns forEach function
      }

      log.debug('Property Map:', JSON.stringify(propertyMap));

      capabilities.push(alexaCapabilities.alexa());

      Object.keys(propertyMap).forEach(function (interfaceName) {
        var properties = propertyMap[interfaceName];
        var capability;
        switch (interfaceName) {
          case 'PowerController':
            capability = alexaCapabilities.powerController();
            break;
          case 'BrightnessController':
            capability = alexaCapabilities.brightnessController();
            break;
          case 'PowerLevelController':
            capability = alexaCapabilities.powerLevelController();
            break;
          case 'PercentageController':
            capability = alexaCapabilities.percentageController();
            break;
          case 'ColorController':
            capability = alexaCapabilities.colorController();
            break;
          case 'ColorTemperatureController':
            capability = alexaCapabilities.colorTemperatureController();
            break;
          case 'TemperatureSensor':
            capability = alexaCapabilities.temperatureSensor();
            break;
          case 'ThermostatController':
            capability = alexaCapabilities.thermostatController(properties.targetSetpoint,
              properties.upperSetpoint, properties.lowerSetpoint, properties.thermostatMode);
            break;
          case 'Speaker':
            capability = alexaCapabilities.speaker(properties.volume, properties.muted);
            break;
          case 'StepSpeaker':
            capability = alexaCapabilities.stepSpeaker();
            break;
          case 'LockController':
            capability = alexaCapabilities.lockController();
            break;
          case 'CameraStreamController':
            capability = alexaCapabilities.cameraStreamController(properties.cameraStreamConfigurations);
            break;
          case 'SceneController':
            capability = alexaCapabilities.sceneController(properties.scene);
            break;
          case 'ChannelController':
            capability = alexaCapabilities.channelController();
            break;
          case 'InputController':
            capability = alexaCapabilities.inputController();
            break;
          case 'PlaybackController':
            capability = alexaCapabilities.playbackController();
            break;
          case 'ContactSensor':
            capability = alexaCapabilities.contactSensor();
            break;
          case 'MotionSensor':
            capability = alexaCapabilities.motionSensor();
            break;
          default:
            break;
        }

        if (capability) {
          //log.debug(`interfaceName: ${interfaceName} capability:`, JSON.stringify(capability));
          capabilities.push(capability.capabilities);
          // add properties or capability categories if not endpoint group item
          if (!isEndpointGroup) {
            var categories = propertyMap.getCategories(interfaceName);
            if (categories.length) {
              categories.forEach(category => addDisplayCategory(category));
            } else {
              addDisplayCategory(capability.category);
            }
          }
        }
      });

      var discoverdDevice = {
        endpointId: item.name,
        manufacturerName: 'openHAB',
        friendlyName: item.label,
        description: item.type + ' ' + item.name + ' via openHAB',
        displayCategories: displayCategories,
        cookie: {
          propertyMap: propertyMap.dump()
        },
        capabilities: capabilities
      };
      discoverdDevices.push(discoverdDevice);
    });

    var header = {
      messageId: directive.header.messageId,
      name: 'Discover.Response',
      namespace: directive.header.namespace,
      payloadVersion: directive.header.payloadVersion
    };

    //remove items that are already part of a group.
    for (var i = discoverdDevices.length - 1; i >= 0; i--) {
      if (groupItems.includes(discoverdDevices[i].endpointId)) {
        discoverdDevices.splice(i, 1);
      }
    }

    /**
     * Craft the final response back to Alexa Smart Home Skill. This will include all the
     * discoverd appliances.
     */
    var payload = {
      endpoints: discoverdDevices
    };
    var response = {
      event: {
        header: header,
        payload: payload
      }
    };

    log.debug('Discovery:', JSON.stringify(response));
    returnAlexaResponse(response);
  }).catch(function (error) {
    log.error('discoverDevices failed with error:', JSON.stringify(error));
    returnAlexaResponse(generateGenericErrorResponse());
  });
}

/**
 * Convert v2 style label/tag on items to V3
 * @param {Object} items
 */
function convertV2Items(items) {
  items.forEach(function (item) {
    convertV2Item(item);
  });
}

/**
 * Convert v2 style label/tag on a single item to V3
 * @param {Object} item
 * @param {Object} group  [group level config parameters] (optional)
 */
function convertV2Item(item, group = {}) {

  function v2Tempformat(item) {
    if (item.tags.indexOf('Fahrenheit') > -1 || item.tags.indexOf('fahrenheit') > -1) {
      return 'Fahrenheit';
    } else {
      return 'Celsius';
    }
  };

  // Initialize alexa metadata item object if not defined
  if (!item.metadata || !item.metadata.alexa) {
    item.metadata = Object.assign({ alexa: { value: '', config: {} } }, item.metadata);
  }
  // Metadata information:
  //  values: fallback to tags if no metadata value defined
  //  config: metadata config parameters
  var metadata = {
    values: item.metadata.alexa.value ? item.metadata.alexa.value.split(',') : item.tags,
    config: item.metadata.alexa.config || {}
  };

  // Convert metadata v2 style label values to capabilities
  metadata.values.forEach(function (label) {
    var capabilities = [];
    var parameters = {}

    // define endpoint tag for group item with no group type
    if (item.type === 'Group' && !item.groupType) {
      switch (label) {
        case 'Lighting':
          capabilities = ['Endpoint.Light'];
          break;
        case 'Switchable':
          capabilities = ['Endpoint.Switch'];
          break;
        case 'Thermostat':
          capabilities = ['Endpoint.Thermostat'];
          // add v2 tag scale parameter if group metadata config not defined
          if (!metadata.config.scale) {
            metadata.config.scale = v2Tempformat(item);
          }
          break;
        default:
          if (utils.supportedDisplayCategory(label)) {
            capabilities = ['Endpoint.' + label];
          }
      }
    } else {
      switch (label) {
        case 'Lighting':
        case 'Switchable':
          var category = label === 'Lighting' ? 'LIGHT' : 'SWITCH';
          capabilities = getV2SwitchableCapabilities(item);
          parameters = { category: category };
          break;
        case 'Lock':
          capabilities = ['LockController.lockState'];
          break;
        case 'CurrentTemperature':
          var scale = group.scale || v2Tempformat(item);
          capabilities = ['TemperatureSensor.temperature'];
          parameters = { scale: scale };
          break;
        case 'TargetTemperature':
          var scale = group.scale || v2Tempformat(item);
          capabilities = ['ThermostatController.targetSetpoint'];
          parameters = { scale: scale };
          break;
        case 'LowerTemperature':
          var scale = group.scale || v2Tempformat(item);
          capabilities = ['ThermostatController.lowerSetpoint'];
          parameters = { scale: scale };
          break;
        case 'UpperTemperature':
          var scale = group.scale || v2Tempformat(item);
          capabilities = ['ThermostatController.upperSetpoint'];
          parameters = { scale: scale };
          break;
        case 'HeatingCoolingMode':
        case 'homekit:HeatingCoolingMode':
          var binding = group.binding || 'default';
          capabilities = ['ThermostatController.thermostatMode'];
          parameters = { binding: binding }
          break;
        case 'ColorTemperature':
          capabilities = ['ColorTemperatureController.colorTemperatureInKelvin'];
          break;
        case 'Activity':
        case 'Scene':
          var category = label === 'Activity' ? 'ACTIVITY_TRIGGER' : 'SCENE_TRIGGER';
          capabilities = ['SceneController.scene'];
          parameters = { category: category };
          break;
        case 'EntertainmentChannel':
          capabilities = ['ChannelController.channel'];
          break;
        case 'EntertainmentInput':
          capabilities = ['InputController.input'];
          break;
        case 'MediaPlayer':
          capabilities = ['PlaybackController.playback'];
          break;
        case 'SpeakerMute':
          capabilities = ['Speaker.muted'];
          break;
        case 'SpeakerVolume':
          capabilities = ['Speaker.volume'];
          break;
        case 'ContactSensor':
          capabilities = ['ContactSensor.detectionState'];
          break;
        case 'MotionSensor':
          capabilities = ['MotionSensor.detectionState'];
          break;
      }
    }

    // Update recursively members of group item with endpoint capability
    if (item.type === 'Group' && metadata.values.find(value => value.match(ENDPOINT_PATTERN))) {
      item.members.forEach(member => convertV2Item(member, metadata.config));
    }

    // Push all capabilities to metadata values if not already included
    //  and merge parameters into metadata config
    capabilities.forEach(function (capability) {
      if (!metadata.values.find(value => value === capability)) {
        metadata.values.push(capability);
        metadata.config = Object.assign(parameters, metadata.config);
      }
    });
  });

  // Update recursively members of group item with endpoint capability
  if (item.type === 'Group' && metadata.values.find(value => value.match(ENDPOINT_PATTERN))) {
    item.members.forEach(member => convertV2Item(member, metadata.config));
  }

  // Update item alexa metadata information
  item.metadata = Object.assign(item.metadata, {
    alexa: {
      value: metadata.values.join(','),
      config: metadata.config
    }
  });
}

/**
 * V2 style tags, given an item, returns an array of action that are supported.
 * @param {Object} item
 */
function getV2SwitchableCapabilities(item) {
  switch (item.type === 'Group' ? item.groupType : item.type) {
    case 'Switch':
      return [
        'PowerController.powerState'
      ];
    case 'Dimmer':
      return [
        'PowerController.powerState',
        'BrightnessController.brightness'
      ];
    case 'Color':
      return [
        'PowerController.powerState',
        'BrightnessController.brightness',
        'ColorController.color'
      ];
    case 'Rollershutter':
      return [
        'PowerController.powerState',
        'PercentageController.percentage'
      ];
    default:
      return [];
  }
}
