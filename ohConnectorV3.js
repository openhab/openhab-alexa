/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * An Amazon Echo Smart Home Skill API implementation for openHAB (v2.x)
 */
var uuid = require('uuid/v4');
var log = require('./log.js');
var utils = require('./utils.js');
var rest = require('./rest.js');
var alexaCapabilities = require('./alexaCapabilities.js');
var contextProperties = require('./alexaContextProperties.js');

var GROUP_TAG_PATTERN = /^Alexa\.Endpoint\.(\w+)/;

var directive;
var context;
var propertyMap;

/**
 * Main entry point for all requests
 * @param {*} directive
 * @param {*} context
 */
exports.handleRequest = function (_directive, _context) {
  directive = _directive;
  context = _context;
  //if we have a JSON cookie, parse it and set on endpoint
  if(directive.endpoint && directive.endpoint.cookie && directive.endpoint.cookie.propertyMap){
    propertyMap = JSON.parse(directive.endpoint.cookie.propertyMap)
  }

  var namespace = directive.header.namespace; //ex: Alexa.BrightnessController
  var name = directive.header.name; // ex: AdjustBrightness

  switch (namespace) {
    case "Alexa":
      switch (name) {
        case 'ReportState':
          reportState();
      }
      break;
    case "Alexa.Discovery":
      discoverDevices();
      break;
    case "Alexa.PowerController":
      setPowerState();
      break;
    case "Alexa.PowerLevelController":
    case "Alexa.BrightnessController":
    case "Alexa.PercentageController":
      adjustPercentage();
      break;
    case "Alexa.ColorController":
      setColor();
      break;
    case "Alexa.ColorTemperatureController":
      adjustColorTemperature();
      break;
    case "Alexa.ThermostatController":
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
    case "Alexa.LockController":
      setLockState();
      break;
    case "Alexa.ChannelController":
      switch (name) {
        case 'ChangeChannel':
          setChannel();
          break;
        case 'SkipChannels':
          adjustChannel();
          break;
      }
      break;
    case "Alexa.InputController":
      setInput();
      break;
    case "Alexa.PlaybackController":
      setPlayback();
      break;
    case "Alexa.SceneController":
      setScene();
      break;
    case "Alexa.Speaker":
      switch (name) {
        case "AdjustVolume":
          adjustSpeakerVolume();
          break;
        case "SetVolume":
          setSpeakerVolume();
          break;
        case "SetMute":
          setSpeakerMute();
          break;
      }
      break;
    case "Alexa.StepSpeaker":
      switch (name) {
        case "AdjustVolume":
          adjustStepSpeakerVolume();
          break;
        case "SetMute":
          setStepSpeakerMute();
          break;
      }
      break;
    case "Alexa.CameraStreamController":
      break;
    default:
  }
};

/**
 * Answers a "ReportState" request.  Returns the state(s) of an endpoint
 */
function reportState() {
  rest.getItemStates(directive.endpoint.scope.token,
    function (items) {
      var properties = contextProperties.propertiesResponseForItems(items, propertyMap);
      var result = {
        context: {
          properties: properties
        },
        event: {
          header: {
            messageId: uuid(),
            name: "StateReport",
            namespace: "Alexa",
            payloadVersion: directive.header.payloadVersion,
            correlationToken: directive.header.correlationToken
          },
          endpoint: {
            scope : directive.endpoint.scope,
            endpointId : directive.endpoint.endpointId
          },
          payload: {}
        }
      };
      log.debug('report done with result' + JSON.stringify(result));
      context.succeed(result);
    }, function (error) {
      log.error("Could not report on item: " + JSON.stringify(error));
    });
}

/**
 * Turns a Switch ON or OFF
 */
function  setPowerState() {
  var state = directive.header.name === 'TurnOn' ? 'ON' : 'OFF';
  var itemName = propertyMap.PowerController.powerState.itemName;
  postItemAndReturn(itemName, state);
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
    case "AdjustPowerLevel":
      isSetCommand = false;
      propertyName = 'powerLevel';
      payloadValue = directive.payload.powerLevelDelta;
      break;
    case "SetPowerLevel":
      isSetCommand = true;
      propertyName = 'powerLevel';
      payloadValue = directive.payload.powerLevel;
      break;
    case "AdjustPercentage":
      isSetCommand = false;
      propertyName = 'percentage';
      payloadValue = directive.payload.percentageDelta;
      break;
    case "SetPercentage":
      isSetCommand = true;
      propertyName = 'percentage';
      payloadValue = directive.payload.percentage;
      break;
    case "AdjustBrightness":
      isSetCommand = false;
      propertyName = 'brightness';
      payloadValue = directive.payload.brightnessDelta;
      break;
    case "SetBrightness":
      isSetCommand = true;
      propertyName = 'brightness';
      payloadValue = directive.payload.brightness;
      break;
  }
  //remove 'Alexa.' from namespace
  var namespace = directive.header.namespace.split('Alexa.')[1];
  var itemName = propertyMap[namespace][propertyName].itemName;
  log.debug('Turning ' + itemName + ' to ' + payloadValue);

  //if this is a set command then just post it, otherwise we need to first retrieve the value of the item
  // so we can adjust it and then post it.
  if (isSetCommand) {
    postItemAndReturn(itemName, payloadValue);
  } else {
    rest.getItem(directive.endpoint.scope.token,
      itemName, function (item) {
        log.debug('itemGetSuccess: item state ' +
          item.state + ' delta ' + payloadValue);

        //skip this if we don't have a number to start with
        if (isNaN(item.state)) {
          context.done(null, generateGenericErrorResponse());
          return;
        }
        var oldState = parseInt(item.state);
        var newState = oldState + parseInt(payloadValue);
        newState = Math.min(100, newState);
        newState = Math.max(0, newState);
        postItemAndReturn(itemName, newState);
      }, function (error) {
        context.done(null, generateGenericErrorResponse());
      }
    );
  }
}

/**
 * Set the color of a color item
 */
function setColor() {
  var h = directive.payload.color.hue;
  var s = directive.payload.color.saturation * 100.0;
  var b = directive.payload.color.brightness * 100.0;
  var state = h + ',' + s + ',' + b;
  var itemName = propertyMap.ColorController.color.itemName;
  postItemAndReturn(itemName, state);
}

/**
 * Set the color of a color item
 */
function adjustColorTemperature() {
  var properties = propertyMap.ColorTemperatureController;
  var itemName = properties.colorTemperatureInKelvin.itemName;

  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state;

      if (directive.header.name === 'SetColorTemperature') {
        state = utils.normalizeColorTemperature(directive.payload.colorTemperatureInKelvin, item.type);
      } else {
        // Generate error if in color mode (color controller property defined & empty state)
        if (propertyMap.ColorController && !parseInt(item.state)) {
          context.done(null, generateControlError({
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'The light is currently set to a color.',
            currentDeviceMode: 'COLOR'
          }));
          return;
        }
        // Generate error if state not a number
        if (isNaN(item.state)) {
          log.debug('adjustColorTemperature error: Could not get numeric item state');
          context.done(null, generateGenericErrorResponse());
          return;
        }

        var isIncreaseRequest = directive.header.name === 'IncreaseColorTemperature';
        var increment = parseInt(properties.colorTemperatureInKelvin.parameters.increment);

        switch (item.type) {
          case 'Dimmer':
            // Send reverse command or value to OH since cold (0%) and warm (100%), depending if increment defined
            if (isNaN(increment)) {
              state = isIncreaseRequest ? 'DECREASE' : 'INCREASE';
            } else {
              state = parseInt(item.state) + (isIncreaseRequest ? -1 : 1) * increment;
              state = state < 0 ? 0 : state < 100 ? state : 100;
            }
            break;
          case 'Number':
            // Increment current state by defined value as Number item doesn't support IncreaseDecreaseType commands
            state = parseInt(item.state) + (isIncreaseRequest ? 1 : -1) * (increment || 500);
            state = utils.normalizeColorTemperature(state, item.type);
            break;
        }
      }

      log.debug('adjustColorTemperature to value: ' + state);
      postItemAndReturn(itemName, state);
    }
  );
}

/**
 * Sets the taget temperature, this can include upper, lower and target setpoints
 * in the same request.
 */
function setTargetTemperature() {
  var properties = propertyMap.ThermostatController;
  var promises = [];
  var items = [];
  Object.keys(properties).forEach(function (propertyName) {
    if (directive.payload[propertyName]) {
      var state = directive.payload[propertyName].value;
      var itemName = properties[propertyName].itemName;
      log.debug("Setting " + itemName + " to " + state);
      promises.push(new Promise(function(resolve, reject) {
        log.debug("PROMISE Setting " + itemName + " to " + state);
        rest.postItemCommand(directive.endpoint.scope.token,
          itemName, state, function (response) {
            log.debug("setTargetTemperature POST response to " + itemName + " : " + response);
            items.push({name:itemName,state:state});
            resolve(response);
          }, function (error){
            log.debug("setTargetTemperature POST ERROR to " + itemName + " : " + error);
            reject(error);
          });
      }));
    }
  });
  Promise.all(promises).then(function(values) {
    log.debug("Promise ALL done");
    log.debug("Promise items " + JSON.stringify(items));
    var result = {
      context: {
        properties: contextProperties.propertiesResponseForItems(items, propertyMap)
      },
      event: {
        header: generateResponseHeader(directive.header),
        payload: {}
      }
    };
    log.debug('setTargetTemperature done with result' + JSON.stringify(result));
    context.succeed(result);
  }).catch(function(err){
    log.debug('setTargetTemperature error ' + err);
    context.done(null, generateGenericErrorResponse());
  });

}

/**
 * Adjusts the target setpoint + or - the targetSetpointDelta
 */
function adjustTargetTemperature() {
  var properties = propertyMap.ThermostatController;
  if (properties.targetSetpoint) {
    var itemName = properties.targetSetpoint.itemName;
    rest.getItem(directive.endpoint.scope.token,
      itemName, function (item) {
        var state = parseFloat(item.state) + directive.payload.targetSetpointDelta.value;
        postItemAndReturn(itemName, state);
      }, function (error) {
        context.done(null, generateGenericErrorResponse());
      }
    );
  }
}

/**
 * Sets the mode of the thermostat
 */
function setThermostatMode() {
  var state = utils.normalizeThermostatMode(directive.payload.thermostatMode.value,
    propertyMap.ThermostatController.thermostatMode.parameters);
  var itemName = propertyMap.ThermostatController.thermostatMode.itemName;

  if (state) {
    postItemAndReturn(itemName, state);
  } else {
    context.done(null, generateControlError({
      type: "UNSUPPORTED_THERMOSTAT_MODE",
      message: itemName + " doesn't support thermostat mode [" + directive.payload.thermostatMode.value + "]",
    }));
  }
}

/**
 * Locks (ON) or unlocks (OFF) a item
 */
function setLockState() {
  var state = directive.header.name.toUpperCase() === 'LOCK' ? 'ON' : 'OFF';
  var itemName = propertyMap.LockController.lockState.itemName;
  postItemAndReturn(itemName, state);
}

/**
 * Sends the channel value to a string or number item
 */
function setChannel() {
  var itemName = propertyMap.ChannelController.channel.itemName;
  var state = directive.payload.channel.number;
  postItemAndReturn(itemName, state);
}

/**
 * Adjusts the channel value to a number item
 */
function adjustChannel() {
  var itemName = propertyMap.ChannelController.channel.itemName;
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state = parseInt(item.state);
      if(isNaN(state)){
        state = Math.abs(directive.payload.channelCount);
      } else {
        state += directive.payload.channelCount;
      }
      postItemAndReturn(itemName, state.toString());
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
    }
  );
}

/**
 * Sends the input value (HDMI1, Music, etc..) to a string item
 */
function setInput() {
  var itemName = propertyMap.InputController.input.itemName;
  var state = directive.payload.input.replace(/\s/g, '').toUpperCase();
  postItemAndReturn(itemName, state);
}
/**
 * Sends a playback command (PLAY, PASUE, REWIND, etc..) to a string or player item
 */
function setPlayback() {
  var itemName = propertyMap.PlaybackController.playback.itemName;
  var state = directive.header.name.toUpperCase();
  postItemAndReturn(itemName, state);
}

/**
 * Sends a send name to a string item
 */
function setScene() {
  var itemName = propertyMap.SceneController.scene.itemName;
  var state = directive.header.name === 'Activate' ? "ON" : "OFF";
  rest.postItemCommand(directive.endpoint.scope.token,
    itemName, state, function (response) {
      var result = {
        context: {},
        event: {
          header: {
            messageId: uuid(),
            name: directive.header.name === 'Activate' ? 'ActivationStarted' : 'DeactivationStarted',
            namespace: directive.header.namespace,
            payloadVersion: directive.header.payloadVersion,
            correlationToken: directive.header.correlationToken
          },
          payload: {
            cause: {
              type: 'VOICE_INTERACTION'
            },
            timestamp: utils.date()
          }
        }
      };
      log.debug('setScene done with result' + JSON.stringify(result));
      context.succeed(result);
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
    }
  );
}

/**
 * Adjusts a number + or - the volume payload
 */
function adjustSpeakerVolume() {
  var itemName = propertyMap.Speaker.volume.itemName;
  var defaultIncrement = parseInt(propertyMap.Speaker.volume.parameters.increment);
  var volumeIncrement = directive.payload.volumeDefault && defaultIncrement > 0 ?
    (directive.payload.volume >= 0 ? 1 : -1) * defaultIncrement : directive.payload.volume;
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state = parseInt(item.state);
      if(isNaN(state)){
        state = Math.abs(volumeIncrement);
      } else {
        state += volumeIncrement;
      }
      postItemAndReturn(itemName, state);
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
    }
  );
}

/**
 * Sets a number item to the volume payload
 */
function setSpeakerVolume() {
  var itemName = propertyMap.Speaker.volume.itemName;
  var state = directive.payload.volume;
  postItemAndReturn(itemName, state);
}

/**
 * Sets a switch item to muted (ON), or unmuted (OFF)
 */
function setSpeakerMute() {
  var itemName = propertyMap.Speaker.muted.itemName;
  var state = directive.payload.mute ? "ON" : "OFF";
  postItemAndReturn(itemName, state);
}

/**
 * Sends a volume step (+1, -1) to a item
 */
function adjustStepSpeakerVolume() {
  var itemName = propertyMap.StepSpeaker.volume.itemName;
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state = parseInt(item.state);
      if(isNaN(state)){
        state = Math.abs(directive.payload.volumeSteps);
      } else {
        state += directive.payload.volumeSteps;
      }
      postItemAndReturn(itemName, state);
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
      }
    );
}

/**
 * Sets a switch item to muted (ON), or unmuted (OFF)
 */
function setStepSpeakerMute() {
  var itemName = propertyMap.StepSpeaker.muted.itemName;
  var state = directive.payload.mute ? "ON" : "OFF";
  postItemAndReturn(itemName, state);
}

/**
 *
 * Generic method to get the latest state of an item in OH and then return a formatted result to the Alexa request
 * @param {*} itemName
 */
function getItemStateAndReturn(itemName) {
  log.debug('getItemStateAndReturn Getting ' + itemName + ' latest state');
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var result = {
        context: {
          properties: contextProperties.propertiesResponseForItems(
            [{ name: item.name, state: item.state, type: item.type }], propertyMap)
        },
        event: {
          header: generateResponseHeader(directive.header),
          endpoint: {
            scope : directive.endpoint.scope,
            endpointId : directive.endpoint.endpointId
          },
          payload: {}
        }
      };
      log.debug('postItemAndReturn done with result' + JSON.stringify(result));
      context.succeed(result);
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
    }
  );
}

/**
 *
 * Generic method to post an item to OH and then return a formatted result to the Alexa request
 * @param {*} itemName
 * @param {*} state
 */
function postItemAndReturn(itemName, state) {
  log.debug('postItemAndReturn Setting ' + itemName + ' to ' + state);
  rest.postItemCommand(directive.endpoint.scope.token,
    itemName, state, function (response) {
      getItemStateAndReturn(itemName);
    }, function (error) {
      context.done(null, generateGenericErrorResponse());
    }
  );
}

/**
 * V3 response header
 * @param {*} header
 */
function generateResponseHeader(header) {
  return {
    messageId: uuid(),
    name: "Response",
    namespace: "Alexa",
    payloadVersion: header.payloadVersion,
    correlationToken: header.correlationToken
  };
}

/**
 * V3 Control Error Response
 * @param {*} directive
 * @param {*} payload
 */
function generateControlError(payload) {
    var header = {
        namespace: 'Alexa',
        name: 'ErrorResponse',
        messageId: directive.header.messageId,
        correlationToken: directive.header.correlationToken,
        payloadVersion: directive.header.payloadVersion
    };

    var result = {
        event: {
            header: header,
            endpoint: directive.endpoint,
            payload: payload
        }
    };

    log.debug('generateControlError done with result' + JSON.stringify(result));
    return result;
}

/**
 * V3 Generic Error Response
 * @param {*} directive
 */
function generateGenericErrorResponse() {
  return generateControlError({
    type: "ENDPOINT_UNREACHABLE",
    message: "Unable to reach device"
  });
}

/**
 * Device discovery
 * @param {*} directive
 * @param {*} context
 */
function discoverDevices() {
  //request all items with groups
  rest.getItemsRecursively(directive.payload.scope.token, function (items) {

    var discoverdDevices = [];
    //items here are part of a group and should not be added individually
    var groupItems = [];

    //log.debug("GET ITEMS: " + JSON.stringify(items));

    //convert alexa metadata to tags
    convertMetadataItems(items);
    //convert v2 style tags to v3
    convertV2Items(items);
    log.debug("Items: " + JSON.stringify(items));
    items.forEach(function (item) {
      //this item is already part of a group
      if (groupItems.includes(item.name)) {
        return;  //just returns forEach function
      }
      //array of device capabilities
      var capabilities = [];

      var displayCategories = [];
      function addDisplayCategory(category){
        category = utils.supportedDisplayCategory(category) ? category : 'OTHER';
        if(!displayCategories.includes(category)){
          displayCategories.push(category);
        }
      }

      var propertyMap;
      var isEndpointGroup = false;

      //OH Goups can act as a single Endpoint using its children for capabilities
      if (item.type === 'Group') {
        item.tags.forEach(function(tag){
          //found matching Endpoint tag
          var groupMatch;
          if(groupMatch = tag.match(GROUP_TAG_PATTERN)){
            log.debug("found group " + groupMatch[0] + " for item " + item.name);
            isEndpointGroup = true;
            item.members.forEach(function (member) {
              log.debug("adding  " + member.name + " to group " + item.name);
              groupItems.push(member.name);
              propertyMap = utils.tagsToPropertyMap(member, propertyMap);
            });
            //set dispay category for group
            addDisplayCategory(groupMatch[1].toUpperCase());
            return; //returns forEach
          }
        });
      }

      if(!isEndpointGroup) {
        propertyMap = utils.tagsToPropertyMap(item);
      }

      if (propertyMap && Object.keys(propertyMap).length) {
        log.debug("Property Map: " + JSON.stringify(propertyMap));
      } else {
        //no tags found
        return;  //just returns forEach function
      }

      capabilities.push(alexaCapabilities.alexa());

      Object.keys(propertyMap).forEach(function (interfaceName) {
        var properties = propertyMap[interfaceName];
        var capability;
        switch (interfaceName) {
          case "PowerController":
            capability = alexaCapabilities.powerController();
            break;
          case "BrightnessController":
            capability = alexaCapabilities.brightnessController();
            break;
          case "PowerLevelController":
            capability = alexaCapabilities.powerLevelController();
            break;
          case "PercentageController":
            capability = alexaCapabilities.percentageController();
            break;
          case "ColorController":
            capability = alexaCapabilities.colorController();
            break;
          case "ColorTemperatureController":
            capability = alexaCapabilities.colorTemperatureController();
            break;
          case "TemperatureSensor":
            capability = alexaCapabilities.temperatureSensor();
            break;
          case "ThermostatController":
            capability = alexaCapabilities.thermostatController(properties.targetSetpoint, properties.upperSetpoint, properties.lowerSetpoint, properties.thermostatMode);
            break;
          case "Speaker":
            capability = alexaCapabilities.speaker(properties.volume, properties.muted);
            break;
          case "LockController":
            capability = alexaCapabilities.lockController();
            break;
          case "CameraStreamController":
            capability = alexaCapabilities.cameraStreamController(properties.cameraStreamConfigurations);
            break;
          case "SceneController":
            capability = alexaCapabilities.sceneController(properties.scene);
            break;
          case "ChannelController":
            capability = alexaCapabilities.channelController();
            break;
          case "InputController":
            capability = alexaCapabilities.inputController();
            break;
          case "PlaybackController":
            capability = alexaCapabilities.playbackController();
            break;
          default:
            break;
        }

        if (capability) {
          //log.debug("interfaceName: " + interfaceName + " capability: " + JSON.stringify(capability));
          capabilities.push(capability.capabilities);
          // add properties or capability categories if not endpoint group item
          if (!isEndpointGroup) {
            if(properties.categories && properties.categories.length > 0 ){
              properties.categories.forEach(function(category){
                addDisplayCategory(category);
              });
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
          propertyMap : JSON.stringify(propertyMap)
        },
        capabilities: capabilities
      };
      discoverdDevices.push(discoverdDevice);
    });

    var header = {
      messageId: directive.header.messageId,
      name: "Discover.Response",
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
    var result = {
      event: {
        header: header,
        payload: payload
      }
    };

    log.debug('Discovery: ' + JSON.stringify(result));
    context.succeed(result);
  }, function (error) {
    log.error("discoverDevices failed: " + error.message);
    context.done(null, generateGenericErrorResponse());
  });
}

/**
 * Convert alexa metadata to tags
 * @param {*} items
 */
function convertMetadataItems(items) {
  items.forEach(function (item) {
    if (item.metadata && item.metadata.alexa) {
      item.metadata.alexa.value.split(',').forEach(function(value) {
        var capability = value.split('.').length == 2 ? 'Alexa.' + value : value;
        var parameters = Object.keys(item.metadata.alexa.config || {}).reduce(function(parameters, key, index) {
          parameters += `${index > 0 ? ',' : ':'}${key}=${item.metadata.alexa.config[key]}`;
          return parameters;
        }, '');
        // merge capability into item tags
        var index = item.tags.findIndex(tag => tag.startsWith(capability));
        item.tags[index > -1 ? index : item.tags.length] = capability + parameters;
        // convert group members items
        if (item.type === 'Group') {
          convertMetadataItems(item.members);
        }
      });
    }
  });
}

/**
 * Convert v2 tag on items to V3
 * @param {*} items
 */
function convertV2Items(items) {
  items.forEach(function (item) {
    convertV2Item(item);
  });
}

/**
 * Convert v2 tag on a single item to V3
 * @param {*} item
 * @param {*} properties  [upstream properties such as group-based] (optional)
 */
function convertV2Item(item, properties = {}) {

  function v2Tempformat(item){
    if (item.tags.indexOf('Fahrenheit') > -1 || item.tags.indexOf('fahrenheit') > -1) {
        return 'Fahrenheit';
    } else {
        return 'Celsius';
    }
  };

  item.tags.forEach(function (tag) {
    tag = tag.split(':').reduce(function(tag, value, index) {
      // skip if first index value is 'homekit' (e.g. homekit:HeatingCoolingMode)
      if (index > 0 || value !== 'homekit') {
        if (!tag.hasOwnProperty('name')) {
          tag.name = value;
        } else if (!tag.hasOwnProperty('parameters')) {
          tag.parameters = value.split(',');
        }
      }
      return tag;
    }, {});

    var capabilities = [];
    var parameters = [];

    // define endpoint tag for group item with no group type
    if (item.type === 'Group' && !item.groupType) {
      var groupProperties = (tag.parameters || []).reduce(function(parameters, parameter) {
        var keyValue = parameter.split('=', 2);
        if (keyValue.length == 2) parameters[keyValue[0]] = keyValue[1];
        return parameters;
      }, {});

      var category;

      switch (tag.name) {
        case 'Lighting':
          category = 'Light';
          break;
        case 'Switchable':
          category = 'Switch';
          break;
        case 'Thermostat':
          category = 'Thermostat';
          // add v2 tag scale parameter if group parameter not defined
          if (!groupProperties.scale) {
            groupProperties.scale = v2Tempformat(item);
          }
          break;
        default:
          if (utils.supportedDisplayCategory(tag.name)) {
            category = tag.name;
          }
      }
      if (category) {
        capabilities = ['Alexa.Endpoint.' + category];
        item.members.forEach(member => convertV2Item(member, groupProperties));
      }
    } else {
      switch (tag.name) {
        case 'Light':
        case 'Lighting':
        case 'Switch':
        case 'Switchable':
          var category = tag.name.startsWith('Light') ? 'LIGHT' : 'SWITCH';
          capabilities = getV2SwitchableCapabilities(item);
          parameters = ['category=' + category];
          break;
        case 'Outlet':
          capabilities = ['Alexa.PowerController.powerState'];
          parameters = ['category=SMARTPLUG'];
          break;
        case 'Lock':
          capabilities = ['Alexa.LockController.lockState'];
          break;
        case 'CurrentTemperature':
          var scale = properties.scale || v2Tempformat(item);
          capabilities = ['Alexa.TemperatureSensor.temperature'];
          parameters = ['scale=' + scale];
          break;
        case 'TargetTemperature':
          var scale = properties.scale || v2Tempformat(item);
          capabilities = ['Alexa.ThermostatController.targetSetpoint'];
          parameters = ['scale=' + scale];
          break;
        case 'LowerTemperature':
          var scale = properties.scale || v2Tempformat(item);
          capabilities = ['Alexa.ThermostatController.lowerSetpoint'];
          parameters = ['scale=' + scale];
          break;
        case 'UpperTemperature':
          var scale = properties.scale || v2Tempformat(item);
          capabilities = ['Alexa.ThermostatController.upperSetpoint'];
          parameters = ['scale=' + scale];
          break;
        case 'HeatingCoolingMode':
        case 'ThermostatMode':
          var binding = properties.binding || 'default';
          capabilities = ['Alexa.ThermostatController.thermostatMode'];
          parameters = ['binding=' + binding];
          break;
        case 'ColorTemperature':
          capabilities = ['Alexa.ColorTemperatureController.colorTemperatureInKelvin'];
          break;
        case 'Activity':
        case 'Scene':
          var category = tag.name === 'Activity' ? 'ACTIVITY_TRIGGER' : 'SCENE_TRIGGER';
          capabilities = ['Alexa.SceneController.scene'];
          parameters = ['category=' + category];
          break;
        case 'Channel':
          capabilities = ['Alexa.ChannelController.channel'];
          break;
        case 'Input':
          capabilities = ['Alexa.InputController.input'];
          break;
        case 'Mute':
          capabilities = ['Alexa.Speaker.muted'];
          break;
        case 'Volume':
          capabilities = ['Alexa.Speaker.volume'];
          break;
      }
    }

    // merge tag parameters if defined
    if (tag.parameters) {
      tag.parameters.forEach(function(parameter) {
        var key = parameter.split('=').shift();
        var index = parameters.findIndex(parameter => parameter.startsWith(key + '='));
        parameters[index > -1 ? index : parameters.length] = parameter;
      });
    }

    // push all capabilities to item tags if not already included
    capabilities.forEach(function(capability) {
      if (!item.tags.find(tag => tag.startsWith(capability))) {
        item.tags.push(capability + (parameters.length ? ':' + parameters.join(',') : ''));
      }
    });
  });
}

/**
 * V2 style tags, given an item, returns an array of action that are supported.
 * @param {*} item
 */
function getV2SwitchableCapabilities(item) {
  switch (item.type === 'Group' ? item.groupType : item.type) {
    case 'Switch':
      return [
        "Alexa.PowerController.powerState"
      ];
    case 'Dimmer':
      return [
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness"
      ];
    case 'Color':
      return [
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color"
      ];
    case 'Rollershutter':
      return [
        "Alexa.PowerController.powerState",
        "Alexa.PercentageController.percentage"
      ];
    default:
      return [];
  }
}
