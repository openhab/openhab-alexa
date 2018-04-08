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
      break;
    case "Alexa.ChannelController":
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
          failure({
            message: 'Could not get numberic item state'
          });
          context.done(null, generateGenericErrorResponse(directive));
        }
        var oldState = parseInt(item.state);
        var newState = oldState + parseInt(payloadValue);
        newState = Math.min(100, newState);
        newState = Math.max(0, newState);
        postItemAndReturn(itemName, newState);
      }, function (error) {
        context.done(null, generateGenericErrorResponse(directive));
      }
    );
  }
}

/**
 * Set the color of a color item
 */
function setColor() {
  var h = directive.payload.color.hue;
  var s = Math.round(directive.payload.color.saturation * 100);
  var b = Math.round(directive.payload.color.brightness * 100);
  var state = h + ',' + s + ',' + b;
  var itemName = propertyMap.ColorController.color.itemName;
  postItemAndReturn(itemName, state);
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
    context.done(null,
      generateGenericErrorResponse(directive));
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
        var state = item.state + directive.payload.targetSetpointDelta.value;
        postItemAndReturn(itemName, state);
      }, function (error) {
        context.done(null,
          generateGenericErrorResponse(directive));
      }
    );
  }
}

/**
 * Sets the mode of the thermostat
 */
function setThermostatMode() {
  var state = directive.payload.thermostatMode.value;
  //user defined mappings (OFF, HEAT,COOL, AUTO)
  var modeProps = propertyMap.ThermostatController.thermostatMode;
  if(modeProps.parameters[state]){
    state = modeProps.parameters[state];
  }
  var itemName = propertyMap.ThermostatController.thermostatMode.itemName;
  postItemAndReturn(itemName, state);
}

/**
 * Locks (ON) or unlocks (OFF) a item
 */
function setLockState() {
  var state = directive.header.name.toUpperCase() == 'LOCK' ? 'ON' : 'OFF';
  var itemName = propertyMap.LockController.lockState.itemName;
  postItemAndReturn(itemName, state);
}

/**
 * Sends the input value (HDMI1, Music, etc..) to a string item
 */
function setInput() {
  var itemName = propertyMap.InputController.input.itemName;
  var state = directive.payload.input;
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
  var state = directive.header.name == 'Activate' ? "ON" : "OFF";
  postItemAndReturn(itemName, state);
}

/**
 * Adjusts a number + or - the volume payload
 */
function adjustSpeakerVolume() {
  var itemName = propertyMap.Speaker.volume.itemName;
  rest.getItem(directive.endpoint.scope.token,
    itemName, function (item) {
      var state = parseInt(item.state); 
      if(isNaN(state)){
        state = 0;
      }
      state += directive.payload.volume;
      postItemAndReturn(itemName, state);
    }, function (error) {
      context.done(null,
        generateGenericErrorResponse(directive));
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
  var itemName = propertyMap.Speaker.mute.itemName;
  var state = directive.payload.mute ? "ON" : "OFF"
  postItemAndReturn(itemName, state);
}

/**
 * Sends a volume step (+1, -1) to a item
 */
function adjustStepSpeakerVolume() {
  var itemName = propertyMap.StepSpeaker.volume.itemName;
  var state = directive.payload.volume;
  postItemAndReturn(itemName, state);
}

/**
 * Sets a switch item to muted (ON), or unmuted (OFF)
 */
function setStepSpeakerMute() {
  var itemName = propertyMap.StepSpeaker.mute.itemName;
  var state = directive.payload.mute ? "ON" : "OFF"
  postItemAndReturn(itemName, state);
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
      var result = {
        context: {
          properties: contextProperties.propertiesResponseForItems([{ name: itemName, state: state }], propertyMap)
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
function discoverDevices() {
  //request all items with groups 
  rest.getItemsRecursively(directive.payload.scope.token, function (items) {

    var discoverdDevices = [];
    //items here are part of a group and should not be added individually
    var groupItems = [];

    //log.debug("GET ITEMS: " + JSON.stringify(items));

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
      function addDisplayCatagory(catagory){
        if(!displayCategories.includes(catagory)){
          displayCategories.push(catagory);
        }
      }

      var propertyMap;
      var groupTag;
      //OH Goups can act as a single Endpoint using its children for capabilities
      if (item.type == 'Group') {
        item.tags.forEach(function(tag){
          //found matching Endpoint tag
        if(groupMatch = tag.match(GROUP_TAG_PATTERN)){ 
          log.debug("found group " + groupMatch[0] + " for item " + item.name);  
          item.members.forEach(function (member) {
            log.debug("adding  " + member.name + " to group " + item.name);  
            groupItems.push(member.name);
            propertyMap = utils.tagsToPropertyMap(member, propertyMap);
          });
          //set dispay category for group
          displayCategories.push(groupMatch[1].toUpperCase());
          return; //returns forEach
        }
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
            capability = alexaCapabilities.speaker();
            break;
          case "LockController":
            capability = alexaCapabilities.lockController();
            break;
          case "CameraStreamController":
            capability = alexaCapabilities.cameraStreamController(properties.cameraStreamConfigurations);
            break;
          case "SceneController":
            capability = alexaCapabilities.sceneController();
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
            if(properties.catagories && properties.catagories.length > 0 ){
              properties.catagories.forEach(function(catagory){
                addDisplayCatagory(catagory);
              });
            } else {
              addDisplayCatagory(capability.catagory);
            }
          
          // //we have not yet set any catgories for this endpoint yet
          // if(!displayCategories){
          //   //if the user has supplied categoires in the tag use that, otherwise use defaults.
          //   if(properties.catagories && properties.catagories.length > 0 ){
          //     displayCategories = properties.catagories;
          //   } else {
          //     displayCategories = [capability.catagory];
          //   }
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

  function v2Tempformat(item){
    if (item.tags.indexOf('Fahrenheit') > -1 || item.tags.indexOf('fahrenheit') > -1) {
        return 'Fahrenheit';
    } else {
        return 'Celsius';
    }
  };

  item.tags.forEach(function (tag) {
    switch (tag) {
      case 'Lighting':
      case 'Switchable':
        item.tags = item.tags.concat(getV2SwitchableCapabilities(item));
        break;
      case 'Thermostat':
        if (item.type == 'Group') {
          item.tags.push('Alexa.Endpoint.Thermostat');
          item.members.forEach(function(member){
            //if they tagged the group with a scale, add it to each member
            var scale = v2Tempformat(item);
            member.tags.push(scale);
            convertV2Item(member);
          });
        }
        break;
      case 'Lock':
        item.tags.push('Alexa.LockController.lockState');
        break;
      case 'CurrentTemperature':
        var scale = v2Tempformat(item);
        item.tags.push('Alexa.TemperatureSensor.temperature:scale=' + scale);
        break;
      case 'TargetTemperature':
        var scale = v2Tempformat(item);
        item.tags.push('Alexa.ThermostatController.targetSetpoint:scale=' + scale);
        break;
      case 'homekit:HeatingCoolingMode':
        item.tags.push('Alexa.ThermostatController.thermostatMode:OFF=0,HEAT=1,COOL=2,AUTO-3');
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
    return ["Alexa.PowerController.powerState", "Alexa.PercentageController.percentage:category=OTHER"]
  } else {
    return null;
  }
}
