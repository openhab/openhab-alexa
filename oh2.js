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
var log = require('./log.js');
var utils = require('./utils.js');
var rest = require('./rest.js');

/**
 * This method is invoked when we receive a 'Discovery' message from Alexa Smart Home Skill.
 * We are expected to respond back with a list of appliances that we have discovered for a given
 * customer.
 */
exports.handleDiscovery = function (event, context) {
    /**
     * Crafting the response header
     */
    var header = {
        messageId: event.header.messageId,
        name: event.header.name.replace('Request', 'Response'),
        namespace: event.header.namespace,
        payloadVersion: event.header.payloadVersion
    };

    /**
     * Craft the final response back to Alexa Smart Home Skill. This will include all the
     * discoverd appliances.
     */

    discoverDevices(event.payload.accessToken, function (devices) {
        /**
         * Response body will be an array of discovered devices.
         */
        var payload = {
            discoveredAppliances: devices
        };
        var result = {
            header: header,
            payload: payload
        };

        log.debug('Discovery: ' + JSON.stringify(result));
        context.succeed(result);
        },
        function (error) {
            log.error("discoverDevices failed: " + error.message);
            context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
        });
};

/**
 * Control events are processed here.
 * This is called when Alexa requests an action (IE turn off appliance).
 */
exports.handleControl = function (event, context) {
    /**
     * Make a remote call to execute the action based on accessToken and the applianceId and the switchControlAction
     * Some other examples of checks:
     *	validate the appliance is actually reachable else return TARGET_OFFLINE error
     *	validate the authentication has not expired else return EXPIRED_ACCESS_TOKEN error
     * Please see the technical documentation for detailed list of errors
     */
    switch (event.header.name) {
    case 'TurnOnRequest':
    case 'TurnOffRequest':
        turnOnOff(context, event);
        break;
    case 'GetTemperatureReadingRequest':
        getCurrentTemperature(context, event);
        break;
    case 'GetTargetTemperatureRequest':
        getTargetTemperature(context, event);
        break;
    case 'SetTargetTemperatureRequest':
    case 'IncrementTargetTemperatureRequest':
    case 'DecrementTargetTemperatureRequest':
        adjustTemperature(context, event);
        break;
    case 'SetPercentageRequest':
    case 'IncrementPercentageRequest':
    case 'DecrementPercentageRequest':
        adjustPercentage(context, event);
        break;
    case 'SetColorRequest':
        adjustColor(context, event);
        break;
    case 'GetLockStateRequest':
        getLockState(context, event);
        break;
    case 'SetLockStateRequest':
        setLockState(context, event);
        break;
    }
};

/**
 * Turns a Switch Item on or off
 */
function turnOnOff(context, event) {
    var success = function (response) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Confirmation'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {};

        var result = {
            header: header,
            payload: payload
        };

        log.debug('turnOnOff done with result' + JSON.stringify(result));

        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    var state = event.header.name === 'TurnOnRequest' ? 'ON' : 'OFF';

    rest.postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, state, success, failure);
}

/**
 * Adjust a percentage value on a item
 **/
function adjustPercentage(context, event) {

    //is this a set command, or Inc/Dec command
    var isSetCommand = event.header.name === 'SetPercentageRequest';

    /**
     * Success functon for sending a percentage change command to OH
     */
    var itemPostSuccess = function (response) {

        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Confirmation'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {};

        var result = {
            header: header,
            payload: payload
        };

        log.debug('adjustPercentage done with result ' + JSON.stringify(result));
        context.succeed(result);
    };

    /**
     * Success Function for retrieveing an items state to use for INC/DEC logic
     */
    var itemGetSuccess = function (item) {

      log.debug('itemGetSuccess: item state ' +
      item.state + ' delta ' + event.payload.deltaPercentage.value);

        //inc/dec command
        //skip this if we don't have a number to start with
        if (isNaN(item.state)) {
            failure({
                message: 'Could not get numberic item state'
            });
            return;
        }

        var state = parseInt(item.state);

        var value;
        if (event.header.name === 'IncrementPercentageRequest') {
            value = state + parseInt(event.payload.deltaPercentage.value);
            if (value > 100) {
                value = 100;
            }
        } else {
            value = state - parseInt(event.payload.deltaPercentage.value);
            if (value < 0) {
                value = 0;
            }
        }

        rest.postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, value.toString(), itemPostSuccess, failure);
    };

    /**
     * Failure Function used for both retieveing items and posting item commands.
     */
    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    if (isSetCommand) {
        rest.postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, event.payload.percentageState.value.toString(), itemPostSuccess, failure);
    } else if (event.payload.percentageState) {
        rest.getItem(event.payload.accessToken, event.payload.appliance.applianceId, itemGetSuccess, failure);
    } else {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Invalid target percentage.'));
    }
}

/**
 * Color control
 */
function adjustColor(context, event) {
    var success = function (response) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Confirmation'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {
          achievedState : {
            color : event.payload.color
          }
        };

        var result = {
            header: header,
            payload: payload
        };

        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    var h = event.payload.color.hue;
    var s = Math.round(event.payload.color.saturation * 100);
    var b = Math.round(event.payload.color.brightness * 100);
    var state = h + ',' + s + ',' + b;
    rest.postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, state, success, failure);
}

/**
 * Retrives the current temperature of a Thermostat or standalone currentTemperature tagged item
 **/
function getCurrentTemperature(context, event) {

    var success = function (item) {
        //if this is a thermostat group, get the currentTemperature item
        if(item.type == 'Group'){
          var items = getThermostatItems(item.members);
          item = items.currentTemperature;
        }

        if(!item || isNaN(item.state)){
          context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'thermostat missing current temperature'));
          return;
        }

        var isF = utils.isEventFahrenheit(event);

        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Response'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var value = parseFloat(item.state);
        var payload = {
          temperatureReading: {
              value: isF ? utils.toC(value) : value
          },
          applianceResponseTimestamp: new Date().toISOString()
        };

        var result = {
            header: header,
            payload: payload
        };
        log.debug('getCurrentTemperature done with result: ' + JSON.stringify(result));
        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    rest.getItem(event.payload.accessToken, event.payload.appliance.applianceId, success, failure);
}

/**
 * Retrives the current target temperature of a Thermostat
 **/
function getTargetTemperature(context, event) {

    var success = function (thermostatGroup) {

        var items = getThermostatItems(thermostatGroup.members);

        if(!items.targetTemperature || isNaN(items.targetTemperature.state)){
          context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'thermostat missing current temperature'));
          return;
        }

        var isF = utils.isEventFahrenheit(event);

        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Response'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var value = parseFloat(items.targetTemperature.state);
        var mode = utils.normalizeThermostatMode(items.heatingCoolingMode ? items.heatingCoolingMode.state : 'Unknown Mode');

        var payload = {
          targetTemperature: {
              value: isF ? utils.toC(value) : value
          },
          applianceResponseTimestamp: new Date().toISOString(),
          temperatureMode: {
            value : mode
          }
        };

        var result = {
            header: header,
            payload: payload
        };

        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    rest.getItem(event.payload.accessToken, event.payload.appliance.applianceId, success, failure);
}

/**
 * Adjust a thermostat's temperature by first reading its current values
 **/
function adjustTemperature(context, event) {

    var success = function (response) {
        var items = getThermostatItems(response.members);
        adjustTemperatureWithItems(context, event, items.currentTemperature, items.targetTemperature, items.heatingCoolingMode);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    rest.getItem(event.payload.accessToken, event.payload.appliance.applianceId, success, failure);
}

/**
 * Adjust a thermostat's temperature based on its current actual readings.
 **/
function adjustTemperatureWithItems(context, event, currentTemperature, targetTemperature, heatingCoolingMode) {
    if (!targetTemperature) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Missing target temperature!'));
        return;
    }

    var curValue = parseFloat(targetTemperature.state);

    /**
     * Alexa needs everything in Celsius, we will need to respect what a user has set
     */
    var isF = utils.isEventFahrenheit(event);

    var setValue;
    switch (event.header.name) {
    case 'SetTargetTemperatureRequest':
        setValue = isF ? utils.toF(event.payload.targetTemperature.value) : event.payload.targetTemperature.value;
        break;
    case 'IncrementTargetTemperatureRequest':
        setValue = curValue + event.payload.deltaTemperature.value;
        break;
    case 'DecrementTargetTemperatureRequest':
        setValue = curValue - event.payload.deltaTemperature.value;
        break;
    }

    log.debug('adjustTemperatureWithItems setValue: ' + setValue);

    var curMode = utils.normalizeThermostatMode(heatingCoolingMode ? heatingCoolingMode.state : 'AUTO');

    var success = function (response) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Confirmation'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {
            targetTemperature: {
                value: isF ? utils.toC(setValue) : setValue
            },
            temperatureMode: {
                value: curMode
            },
            previousState: {
                targetTemperature: {
                    value: isF ? utils.toC(curValue) : curValue
                },
                mode: {
                    value: curMode
                }
            }
        };

        var result = {
            header: header,
            payload: payload
        };

        log.debug('Done with result: ' + JSON.stringify(result));
        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Unable to connect to server'));
    };

    rest.postItemCommand(event.payload.accessToken, targetTemperature.name, setValue.toString(), success, failure);
}

function getLockState(context, event) {
    var success = function (item) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Response'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };
        var payload = {
            lockState: item.state == 'ON' ? 'LOCKED' : 'UNLOCKED'
        };
        var result = {
            header: header,
            payload: payload
        };
        log.debug('getLockState done with result: ' + JSON.stringify(result));
        context.succeed(result);
    };
    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };
    rest.getItem(event.payload.accessToken, event.payload.appliance.applianceId, success, failure);
}

function setLockState(context, event) {
    var success = function (response) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace('Request', 'Confirmation'),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {
            lockState: event.payload.lockState //signal success
        };

        var result = {
            header: header,
            payload: payload
        };

        log.debug('setLockState done with result' + JSON.stringify(result));
        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    var state = event.payload.lockState === 'LOCKED' ? 'ON' : 'OFF';

    rest.postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, state, success, failure);
}

/**
 * Add all devices that have been tagged
 **/
function discoverDevices(token, success, failure) {

    //return true if a value in the first group is contained in the second group
    var matchesGroup = function(groups1, groups2){
      for(var num in groups1 ){
        if(groups2.indexOf(groups1[num]) >= 0 )
          return true;
      }
      return false;
    };

    //checks for a Fahrenheit tag and sets the righ property on the
    //additionalApplianceDetails response object
    var setTempFormat = function(item, additionalApplianceDetails){
      if (item.tags.indexOf('Fahrenheit') > -1 || item.tags.indexOf('fahrenheit') > -1) {
          additionalApplianceDetails.temperatureFormat = 'fahrenheit';
      } else {
          additionalApplianceDetails.temperatureFormat = 'celsius';
      }
    };

    //callback for successfully getting items from rest call
    var getSuccess = function (items) {
        log.debug('discoverDevices getSuccess: ' + JSON.stringify(items));
        var discoverdDevices = [];
        var thermostatGroups = [];

        //first retrive any thermostat Groups
        (function () {
          for (var itemNum in items) {
            var item = items[itemNum];
            for (var tagNum in item.tags) {
              var tag = item.tags[tagNum];
              if(tag == 'Thermostat' && item.type === 'Group'){
                thermostatGroups.push(item.name);
              }
            }
          }
        })();

        //now retieve all other items
        (function () {
          for (var itemNum in items) {
              var item = items[itemNum];
              for (var tagNum in item.tags) {
                  var tag = item.tags[tagNum];

                  /**
                  * An array of actions that this device supports.
                  **/
                  var actions = null;

                  /**
                  * A list of string name-value pairs that provide additional information about a device for use by the skill adapter. The contents of this property cannot exceed 5000 bytes. Also, the Smart Home Skill API  does not understand or use this data.
                  **/
                  var additionalApplianceDetails = {};

                  /**
                  * Appliance and Scene Categories
                  * CAMERA	Indicates media devices with video or photo capabilities.
                  * LIGHT	Indicates light sources or fixtures.
                  * SMARTLOCK	Indicates door locks.
                  * SMARTPLUG	Indicates modules that are plugged into an existing electrical outlet.	Can control a variety of devices.
                  * SWITCH	Indicates in-wall switches wired to the electrical system.	Can control a variety of devices.
                  * THERMOSTAT	Indicates thermostats that control temperature, stand-alone air conditioners, or heaters with direct temperature control.
                  * ACTIVITY_TRIGGER	Describes a combination of devices set to a specific state, when the state change must occur in a specific order. For example, a "watch Neflix" scene might require the
                  *   1) TV to be powered on.
                  *   2) Input set to HDMI1.	Applies to Scenes
                  * SCENE_TRIGGER  Describes a combination of devices set to a specific state, when the order of the state change is not important. For example a bedtime scene might include turning off lights and lowering the thermostat, but the order is unimportant.	Applies to Scenes
                  **/
                  var applianceTypes = [];

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
                      applianceTypes = ['LIGHT'];
                      actions = getSwitchableActions(item);
                      break;
                  case 'Switchable':
                      applianceTypes = ['SWITCH'];
                      actions = getSwitchableActions(item);
                      break;
                  case 'CurrentTemperature':
                    //if this is not part of a thermostatGroup then add it
                    //standalone otherwise it will be available as a thermostat
                    if(!matchesGroup(thermostatGroups, item.groupNames)){
                      actions = [
                          'getTemperatureReading'
                      ];
                      setTempFormat(item,additionalApplianceDetails);
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
                          setTempFormat(item,additionalApplianceDetails);
                          applianceTypes = ['THERMOSTAT'];
                      }
                      break;
                  default:
                      break;
                  }
                  if (actions !== null) {
                      // DEBUG
                      log.trace(' Discovery adding ' + item.name + ' with tag: ' + tag);
                      additionalApplianceDetails.itemType = item.type;
                      additionalApplianceDetails.itemTag = tag;
                      additionalApplianceDetails.openhabVersion = '2';
                      var discoverdDevice = {
                          actions: actions,
                          applianceTypes: applianceTypes,
                          applianceId: item.name,
                          manufacturerName: 'openHAB',
                          modelName: tag,
                          version: '2',
                          friendlyName: item.label,
                          friendlyDescription: item.type + ' ' + item.name + ' ' + tag + ' via openHAB',
                          isReachable: true,
                          additionalApplianceDetails: additionalApplianceDetails
                      };
                      discoverdDevices.push(discoverdDevice);
                  }
              }
          }
        })();
        success(discoverdDevices);
    };
    rest.getItems(token, getSuccess, failure);
}

/**
* Given an item, returns an array of action that are supported.
**/
function getSwitchableActions(item) {
    var actions = null;
    if (item.type === 'Switch' ||
        (item.type === 'Group' && item.groupType && item.groupType === 'Switch')) {
        actions = [
            'turnOn',
            'turnOff'
        ];
    } else if (item.type === 'Dimmer' ||
        (item.type === 'Group' && item.groupType && item.groupType === 'Dimmer')) {
        actions = [
            'incrementPercentage',
            'decrementPercentage',
            'setPercentage',
            'turnOn',
            'turnOff'
        ];
    } else if (item.type === 'Color' ||
        (item.type === 'Group' && item.groupType && item.groupType === 'Color')) {
        actions = [
            'incrementPercentage',
            'decrementPercentage',
            'setPercentage',
            'turnOn',
            'turnOff',
            'setColor'
        ];
    } else if (item.type === 'Rollershutter' ||
        (item.type === 'Group' && item.groupType && item.groupType === 'Rollershutter')) {
        actions = [
            'setPercentage',
            'incrementPercentage',
            'decrementPercentage'
        ];
    }
    return actions;
}
/**
* Rerturns a thermostat object based on memebers of a thermostat tagged group
**/
function getThermostatItems(thermoGroup) {
    var values = {};
    thermoGroup.forEach(function(member){
        member.tags.forEach(function(tag){
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
