/**
 * An Amazon Echo Smart Home Skill API implementation for openHAB (v1.x)
 */
var utils = require('./utils.js');
var rest = require('./rest.js');

/**
 * This method is invoked when we receive a "Discovery" message from Alexa Smart Home Skill.
 * We are expected to respond back with a list of appliances that we have discovered for a given
 * customer.
 */
exports.handleDiscovery = function (event, context) {
    /**
     * Crafting the response header
     */
    var header = {
        messageId: event.header.messageId,
        name: event.header.name.replace("Request", "Response"),
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

        // DEBUG
        //utils.log('Discovery', JSON.stringify(result));

        context.succeed(result);
        },
        function (error) {
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
    }
};

/**
 * Turns a Switch Item on or off
 */
function turnOnOff(context, event) {
    var success = function (response) { 
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace("Request", "Confirmation"),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };
        
        var payload = {};
        
        var result = {
            header: header,
            payload: payload
        };
        
        // DEBUG
        //utils.log('Done with result', result);
        
        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    var state = event.header.name === "TurnOnRequest" ? 'ON' : 'OFF';

    postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, state, success, failure);    
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
            name: event.header.name.replace("Request", "Confirmation"),
            namespace: event.header.namespace,
            payloadVersion: event.header.payloadVersion
        };

        var payload = {};

        var result = {
            header: header,
            payload: payload
        };

        // DEBUG
        //utils.log('Done with result', result);

        context.succeed(result);
    };

    /**
     * Success Function for retrieveing an items state to use for INC/DEC logic
     */
    var itemGetSuccess = function (item) {
        // DEBUG
        //utils.log("itemGetSuccess", "item state " + item.state + " delta " + event.payload.deltaPercentage.value);

        //inc/dec command
        //skip this if we don't have a number to start with
        if (isNaN(item.state)) {
            failure({
                message: "Could not get numberic item state"
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

        postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, value.toString(), itemPostSuccess, failure);
    };

    /**
     * Failure Function used for both retieveing items and posting item commands.
     */
    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    if (isSetCommand) {
        postItemCommand(event.payload.accessToken, event.payload.appliance.applianceId, event.payload.percentageState.value.toString(), itemPostSuccess, failure);
    } else if (event.payload.percentageState) {
        getItem(event.payload.accessToken, event.payload.appliance.applianceId, itemGetSuccess, failure);
    } else {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Invalid target percentage.'));
    }
}

/**
 * Adjust a thermostat's temperature by first reading its current values
 **/
function adjustTemperature(context, event) {
    var success = function (response) {  
        var targetTemperature;
        var currentTemperature;
        var heatingCoolingMode;

        for (var memberNum in response.members) {
            var member = response.members[memberNum];
            for (var tagNum in member.tags) {
                if (member.tags[tagNum] === 'CurrentTemperature') {
                    currentTemperature = member;
                }
                if (member.tags[tagNum] === 'TargetTemperature') {
                    targetTemperature = member;
                }
                if (member.tags[tagNum] === 'HeatingCoolingMode') {
                    heatingCoolingMode = member;
                }
            }
        }

        adjustTemperatureWithItems(context, event, currentTemperature, targetTemperature, heatingCoolingMode);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', error.message));
    };

    getItem(event.payload.accessToken, event.payload.appliance.applianceId, success, failure);
}

/**
 * Adjust a thermostat's temperature based on its current actual readings.
 **/
function adjustTemperatureWithItems(context, event, currentTemperature, targetTemperature, heatingCoolingMode) {
    if (!targetTemperature) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Missing target temperature!'));
        return;
    }

    var curValue = parseInt(targetTemperature.state);
    
    var isF = event.payload.appliance.additionalApplianceDetails.temperatureFormat && event.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit';

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
    
    // DEBUG
    //utils.log("adjustTemperatureWithItems", "setValue  " + setValue);
    
    var curMode = heatingCoolingMode ? heatingCoolingMode.state : "AUTO";
     
    //if state returns as a decimal type, convert to string, this is a very common thermo pattern
    switch (curMode) {
    case '0': //off, not supported! Weird.
    //case 'off':
        curMode = 'AUTO';
        break;
    case '1': //auto
    case 'heat-cool':
        curMode = 'AUTO';
        break;
    case '2': //heating
    //case 'heat':
        curMode = 'HEAT';
        break;
    case '3': //cooling
    //case 'cool':
        curMode = 'COOL';
        break;
    }
    
    curMode = curMode.toUpperCase();

    var success = function (response) {
        var header = {
            messageId: event.header.messageId,
            name: event.header.name.replace("Request", "Confirmation"),
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
        
        // DEBUG
        //utils.log('AdjustTemp Done with result', JSON.stringify(result));
        
        context.succeed(result);
    };

    var failure = function (error) {
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Unable to connect to server'));
    };

    postItemCommand(event.payload.accessToken, targetTemperature.name, setValue.toString(), success, failure);
}

/**
 * Add all devices that have been prepended with "ECHO_*"
 **/
function discoverDevices(token, success, failure) {
    var getSuccess = function (items) {
        //DEBUG
        //utils.log("discoverDevices", JSON.stringify(items));
        
        //Tags - Switchable/Dimmable/Thermostat
        var discoverdDevices = [];
        for (var itemNum in items) {
            var item = items[itemNum];
            for (var tagNum in item.tags) {
                var tag = item.tags[tagNum];
                var actions = null;
                var additionalApplianceDetails = {};
                switch (tag) {
                    case "Switchable":
                        if (item.type === "SwitchItem" || item.type === "GroupItem") {
                            actions = [
                                "turnOn",
                                "turnOff"
                            ];
                        }
                        break;
                    case "Dimmable":
                        if (item.type === "DimmerItem" || item.type === "GroupItem") {
                            actions = [
                                "incrementPercentage",
                                "decrementPercentage",
                                "setPercentage",
                                "turnOn",
                                "turnOff"
                            ];
                        }
                        break;
                    case "Thermostat":
                        //only group items are allowed to have a Temperature tag
                        var targetIndex = item.tags.indexOf("TargetTemperature");
                        if (item.type === 'NumberItem' && targetIndex > -1) {
                            utils.log("adding THERMO " + item.name + " with tags: " + item.tags);
                            actions = [
                                "incrementTargetTemperature",
                                "decrementTargetTemperature",
                                "setTargetTemperature"
                            ];
                            var formatIndex = item.tags.indexOf("temperatureFormat:fahrenheit");
                            if (formatIndex > -1) {
                                additionalApplianceDetails.temperatureFormat = "fahrenheit";
                            } else {
                                additionalApplianceDetails.temperatureFormat = "celsius";
                            }
                        }
                        break;
                    default:
                        break;
                }
                if (actions !== null) {
                    // DEBUG
                    utils.log("adding " + item.name + " with tag: " + tag);
                    
                    additionalApplianceDetails.itemType = item.type;
                    additionalApplianceDetails.itemTag = tag;
                    additionalApplianceDetails.openhabVersion = '1';
                    var discoverdDevice = {
                        actions: actions,
                        applianceId: item.name,
                        manufacturerName: 'openHAB',
                        modelName: tag,
                        version: '1',
                        friendlyName: item.label,
                        friendlyDescription: item.type + ' ' + item.name + ' ' + tag + ' via openHAB',
                        isReachable: true,
                        additionalApplianceDetails: additionalApplianceDetails
                    };
                    discoverdDevices.push(discoverdDevice);
                }
            }
        }
        success(discoverdDevices);
    };

    getItems(token, getSuccess, failure);
}

function getItem(token, itemName, success, failure) {
  return rest.getItem(1,token, itemName, success, failure);
}

function getItems(token, success, failure) {
  return rest.getItems(1,token, success, failure);
}

function postItemCommand(token, itemName, value, success, failure) {
  return rest.postItemCommand(1,token, itemName, value, success, failure);
}