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
var controllerProperties = require('./alexaControllerProperties.js');

/**
 * Main entry point for all requests
 * @param {*} directive 
 * @param {*} context 
 */
exports.handleRequest = function (directive, context) {
  var namespace = directive.header.namespace; //ex: Alexa.BrightnessController
  var name = directive.header.name; // ex: AdjustBrightness

  //if we have a JSON cookie, parse it and set on endpoint
  if(directive.endpoint && directive.endpoint.cookie && directive.endpoint.cookie.propertyMap){
    directive.endpoint._propertyMap = JSON.parse(directive.endpoint.cookie.propertyMap)
  }
  switch (namespace) {
    case "Alexa":
      switch (name) {
        case 'ReportState':
          reportState(directive, context);
      }
      break;
    case "Alexa.Discovery":
      discoverDevices(directive, context);
      break;
    case "Alexa.PowerController":
      setPowerState(directive, context);
      break;
    case "Alexa.PowerLevelController":
    case "Alexa.BrightnessController":
    case "Alexa.PercentageController":
      adjustPercentage(directive, context);
      break;
    case "Alexa.ColorController":
      setColor(directive, context);
      break;
    case "Alexa.ColorTemperatureController":
      break;
    case "Alexa.ChannelController":
      break;
    case "Alexa.ThermostatController":
      switch (name) {
        case 'AdjustTargetTemperature':
          adjustTargetTemperature(directive, context);
          break;
        case 'SetTargetTemperature':
          setTargetTemperature(directive, context);
          break;
        case 'SetThermostatMode':
          setThermostatMode(directive, context);
          break;
      }
      break;
    case "Alexa.LockController":
      setLockState(directive, context);
      break;
    case "Alexa.InputController":
      setInput(directive, context);
      break;
    case "Alexa.PlaybackController":
      setPlayback(directive, context);
      break;
    case "Alexa.SceneController":
      setScene(directive, context);
      break;
    case "Alexa.Speaker":
      switch (name) {
        case "AdjustVolume":
          adjustSpeakerVolume(directive, context);
          break;
        case "SetVolume":
          setSpeakerVolume(directive, context);
          break;
        case "SetMute":
          setSpeakerMute(directive, context);
          break;
      }
      break;
    case "Alexa.StepSpeaker":
      switch (name) {
        case "AdjustVolume":
          adjustStepSpeakerVolume(directive, context);
          break;
        case "SetMute":
          setStepSpeakerMute(directive, context);
          break;
      }
      break;
      break;
    case "Alexa.CameraStreamController":
      break;
    default:
  }

};

/**
 * Answers a "ReportState" request.  Returns the state(s) of an endpoint
 * @param {*} directive 
 * @param {*} context 
 */
function reportState(directive, context) {
  rest.getItemStates(directive.endpoint.scope.token,
    function (items) {
      var properties = controllerProperties.propertiesResponseForItems(items, directive.endpoint._propertyMap);
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
 * @param {*} directive 
 * @param {*} context 
 */
function  setPowerState(directive, context) {
  var state = directive.header.name === 'TurnOn' ? 'ON' : 'OFF';
  var itemName = directive.endpoint._propertyMap.PowerController.powerState.itemName;
  postItemAndReturn(directive, context, itemName, state);
}

/**
 * Adjust a percentage value on a item
 * @param {*} directive 
 * @param {*} context 
 */
function adjustPercentage(directive, context) {

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
  var itemName = directive.endpoint._propertyMap[namespace][propertyName].itemName;
  log.debug('Turning ' + itemName + ' to ' + payloadValue);

  //if this is a set command then just post it, otherwise we need to first retrieve the value of the item
  // so we can adjust it and then post it.
  if (isSetCommand) {
    postItemAndReturn(directive, context, itemName, payloadValue);
  } else {
    rest.getItem(directive.endpoint.scope.token,
      itemName, function (item) {
        log.debug('itemGetSuccess: item state ' +
          item.state + ' delta ' + payloadValue);

        //skip this if we don't have a number to start with
        if (isNaN(item.state)) {
          failure({
            message: 'Could not get numberic item state'
          });
          context.done(null, generateGenericErrorResponse(directive));
        }
        var oldState = parseInt(item.state);
        var newState = oldState + parseInt(payloadValue);
        newState = Math.min(100, newState);
        newState = Math.max(0, newState);
        postItemAndReturn(directive, context, itemName, newState);
      }, function (error) {
        context.done(null, generateGenericErrorResponse(directive));
      }
    );
  }
}

/**
 * Set the color of a color item
 * @param {*} directive 
 * @param {*} context 
 */
function setColor(directive, context) {
  var h = directive.payload.color.hue;
  var s = Math.round(directive.payload.color.saturation * 100);
  var b = Math.round(directive.payload.color.brightness * 100);
  var state = h + ',' + s + ',' + b;
  postItemAndReturn(directive, context, itemName, state);
}

function setTargetTemperature(directive, context) {

  var properties = directive.endpoint._propertyMap.ThermostatController;
  var promises = [];
  var items = [];
  Object.keys(properties).forEach(function (propertyName) {
    if (directive.payload[propertyName]) {
      var state = directive.payload[propertyName].value;
      var itemName = properties[propertyName.itemName];
      console.log("Setting " + itemName + " to " + state);
      promises.push(new Promise(function(resolve, reject) {
        console.log("PROMISE Setting " + itemName + " to " + state);
        rest.postItemCommand(directive.endpoint.scope.token,
          itemName, state, function (response) {
            console.log("setTargetTemperature POST response to " + itemName + " : " + response);
            items.push({name:itemName,state:state});
            resolve(response);
          }, function (error){
            console.log("setTargetTemperature POST ERROR to " + itemName + " : " + error);
            reject(error);
          });
      }));
    }
  });
  Promise.all(promises).then(function(values) {
  console.log("Promise ALL done");
  console.log("Promise items " + JSON.stringify(items));
    var result = {
      context: {
        properties: controllerProperties.propertiesResponseForItems(items, directive.endpoint._propertyMap)
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
    context.done(null,
      generateGenericErrorResponse(directive));
  });

}

function adjustTargetTemperature(directive, endpoint) {
  var properties = directive.endpoint._propertyMap.ThermostatController;
  if (properties.targetSetpoint) {
    var itemName = properties.targetSetpoint.itemName;
    rest.getItem(directive.endpoint.scope.token,
      itemName, function (item) {
        var state = item.state + directive.payload.targetSetpointDelta.value;
        postItemAndReturn(directive, context, itemName, state);
      }, function (error) {
        context.done(null,
          generateGenericErrorResponse(directive));
      }
    );
  }
}


function setThermostatMode(directive, context) {
  var state = directive.payload.thermostatMode.value;
  var modeProps = directive.endpoint._propertyMap.ThermostatController.thermostatMode;
  if(modeProps.parameters[state]){
    state = modeProps.parameters[state];
  }
  if(modeProps.parameters[state]){
    state = modeProps.parameters[state];
  }
  var itemName = directive.endpoint._propertyMap.ThermostatController.thermostatMode.itemName;
  postItemAndReturn(directive, context, itemName, state);
}

function setLockState(directive, context) {
  //LOCK / UNLOCK
  var state = directive.header.name == 'LOCKED' ? 'ON' : 'OFF';
  var itemName = directive.endpoint._propertyMap.LockController.lockState.itemName;
  postItemAndReturn(directive, context, itemName, state);
}

function setInput(directive, context) {
  var itemName = directive.endpoint._propertyMap.InputController.input.itemName;
  var state = directive.payload.input;
  postItemAndReturn(directive, context, itemName, state);
}

function setPlayback(directive, context) {
  var itemName = directive.endpoint._propertyMap.PlaybackController.playback.itemName;
  //PLAY, PAUSE, etc....
  var state = directive.header.name.toUpperCase();
  postItemAndReturn(directive, context, itemName, state);
}

function setScene(directive, context) {
  var itemName = directive.endpoint._propertyMap.SceneController.scene.itemName;
  var state = directive.header.name == 'Activate' ? "ON" : "OFF";
  postItemAndReturn(directive, context, itemName, state);
}

function adjustSpeakerVolume(directive, context) {
  var itemName = directive.endpoint._propertyMap.Speaker.volume.itemName;
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state = parseInt(item.state); 
      if(isNaN(state)){
        state = 0;
      }
      state += directive.payload.volume;
      postItemAndReturn(directive, context, itemName, state);
    }, function (error) {
      context.done(null,
        generateGenericErrorResponse(directive));
    }
  );
}

function setSpeakerVolume(directive,context) {
  var itemName = directive.endpoint._propertyMap.Speaker.volume.itemName;
  var state = directive.payload.volume;
  postItemAndReturn(directive, context, itemName, state);
}

function setSpeakerMute(directive, context) {
  var itemName = directive.endpoint._propertyMap.Speaker.mute.itemName;
  var state = directive.payload.mute ? "ON" : "OFF"
  postItemAndReturn(directive, context, itemName, state);
}

function adjustStepSpeakerVolume(directive, context) {
  var itemName = directive.endpoint._propertyMap.StepSpeaker.volume.itemName;
  var state = directive.payload.volume;
  postItemAndReturn(directive, context, itemName, state);
}

function setStepSpeakerMute(directive, context) {
  var itemName = directive.endpoint._propertyMap.StepSpeaker.mute.itemName;
  var state = directive.payload.mute ? "ON" : "OFF"
  postItemAndReturn(directive, context, itemName, state);
}

/**
 * 
 * Generic method to post an item to OH and then return a formatted result to the Alexa request
 * @param {*} directive 
 * @param {*} context 
 * @param {*} itemName 
 * @param {*} state 
 */
function postItemAndReturn(directive, context, itemName, state) {
  log.debug('postItemAndReturn Setting ' + itemName + ' to ' + state);
  rest.postItemCommand(directive.endpoint.scope.token,
    itemName, state, function (response) {
      var result = {
        context: {
          properties: controllerProperties.propertiesResponseForItems([{ name: itemName, state: state }], directive.endpoint._propertyMap)
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
      context.done(null,
        generateGenericErrorResponse(directive));
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
 * V3 Generic Error Response
 * @param {*} directive 
 */
function generateGenericErrorResponse(directive) {
  var result = {
    event: {
      header: {
        messageId: directive.header.messageId,
        name: "ErrorResponse",
        namespace: "Alexa",
        payloadVersion: directive.header.payloadVersion,
        correlationToken: directive.header.correlationToken
      },
      endpoint: {
        scope : directive.endpoint.scope,
        endpointId : directive.endpoint.endpointId
      },
      payload: {
        type: "ENDPOINT_UNREACHABLE",
        message: "Unable to reach device"
      }
    }
  };
}

/**
 * Device discovery
 * @param {*} directive 
 * @param {*} context 
 */
function discoverDevices(directive, context) {
  //request all items with groups 
  rest.getItemsRecursively(directive.payload.scope.token, function (items) {

    var discoverdDevices = [];
    //items here are part of a group and should not be added individually
    var groupItems = [];

    log.debug("GET ITEMS: " + JSON.stringify(items));

    //convert v2 style tags to v3
    convertV2Items(items);

    items.forEach(function (item) {
      //this item is already part of a group
      if (groupItems.includes(item.name)) {
        return;  //just returns forEach function
      }
      //array of device capabilities
      var capabilities = [];
      var displayCategories = [];

      var propertyMap;

      //OH Goups can act as a single Endpoint using its children for capabilities
      if (item.type == 'Group' && item.tags.includes('Alexa.Endpoint')) {
        item.members.forEach(function (member) {
          log.debug("adding " + member.name + " to group " + item.name);
          groupItems.push(member.name);
          propertyMap = utils.tagsToPropertyMap(member, propertyMap);
          //log.debug("propertyMap with " + member.name + " : " + JSON.stringify(propertyMap));
        });
      } else {
        propertyMap = utils.tagsToPropertyMap(item);
      }

      if (propertyMap && Object.keys(propertyMap).length) {
        log.debug("Property Map: " + JSON.stringify(propertyMap));
      } else {
        //no tags found
        return;  //just returns forEach function
      }

      capabilities.push(alexaCapabilities.alexa());

      Object.keys(propertyMap).forEach(function (groupName) {
        var properties = propertyMap[groupName];
        var controller;
        switch (groupName) {
          case "PowerController":
            controller = alexaCapabilities.powerController();
            break;
          case "BrightnessController":
            controller = alexaCapabilities.brightnessController();
            break;
          case "PowerLevelController":
            controller = alexaCapabilities.powerLevelController();
            break;
          case "PercentageController":
            controller = alexaCapabilities.percentageController();
            break;
          case "ColorController":
            controller = alexaCapabilities.colorController();
            break;
          case "ColorTemperatureController":
            controller = alexaCapabilities.colorTemperatureController();
            break;
          case "TemperatureSensor":
            controller = alexaCapabilities.temperatureSensor();
            break;
          case "ThermostatController":
            controller = alexaCapabilities.thermostatController(properties.targetSetpoint, properties.upperSetpoint, properties.lowerSetpoint, properties.thermostatMode);
            break;
          case "Speaker":
            controller = alexaCapabilities.speaker();
            break;
          case "LockController":
            controller = alexaCapabilities.lockController();
            break;
          case "CameraStreamController":
            controller = alexaCapabilities.lockController(properties.cameraStreamConfigurations);
            break;
          case "SceneController":
            controller = alexaCapabilities.sceneController();
            break;
          case "InputController":
            controller = alexaCapabilities.inputController();
            break;
          case "PlaybackController":
            controller = alexaCapabilities.playbackController();
            break;
          default:
            break;
        }

        if (controller) {
          log.debug("groupName: " + groupName + " controller: " + JSON.stringify(controller));
          //we should check for user supplied catagories here as well in the propertyMap
          capabilities.push(controller.capabilities);
          displayCategories = [controller.catagory];
          // if (!displayCategories.includes(controller.catagory)) {
          //   displayCategories.push(controller.catagory);
          // }
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
    context.done(null, utils.generateControlError(directive.header.messageId, directive.header.name, 'DependentServiceUnavailableError', error.message));
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
 */
function convertV2Item(item) {
  item.tags.forEach(function (tag) {
    switch (tag) {
      case 'Lighting':
      case 'Switchable':
        item.tags = item.tags.concat(getV2SwitchableCapabilities(item));
        break;
      case 'Thermostat':
        if (item.type == 'Group') {
          item.tags.push('Alexa.Endpoint');
          item.members.forEach(convertV2Item);
        }
        break;
      case 'Lock':
        item.tags.push('Alexa.LockController.lockState');
        break;
      case 'CurrentTemperature':
        item.tags.push('Alexa.ThermostatController.targetSetpoint');
        break;
      case 'TargetTemperature':
        item.tags.push('Alexa.TemperatureSensor.temperature');
        break;
      case 'homekit:HeatingCoolingMode':
        item.tags.push('Alexa.ThermostatController.thermostatMode');
        break;
    }
  });
}

/**
 * V2 style tags, given an item, returns an array of action that are supported.
 * @param {*} item 
 */
function getV2SwitchableCapabilities(item) {
  if (item.type === 'Switch' ||
    (item.type === 'Group' && item.groupType && item.groupType === 'Switch')) {
    return ["Alexa.PowerController.powerState"];
  } else if (item.type === 'Dimmer' ||
    (item.type === 'Group' && item.groupType && item.groupType === 'Dimmer')) {
    return ["Alexa.PowerController.powerState", "Alexa.BrightnessController.brightness"]
  } else if (item.type === 'Color' ||
    (item.type === 'Group' && item.groupType && item.groupType === 'Color')) {
    return ["Alexa.PowerController.powerState", "Alexa.BrightnessController.brightness", "Alexa.ColorController.color"]
  } else if (item.type === 'Rollershutter' ||
    (item.type === 'Group' && item.groupType && item.groupType === 'Rollershutter')) {
    return ["Alexa.PowerController.powerState", "Alexa.PercentageController.percentage"]
  } else {
    return null;
  }
}
