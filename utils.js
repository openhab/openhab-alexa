/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */


/**
 * Convert C to F
 */
function toF(value) {
    return Math.round(value * 9 / 5 + 32);
}
/**
 * Convert F to C
 */
function toC(value) {
    return ((value - 32) * 5 / 9).toFixed(2);
}

function generateControlError(messageId, name, code, description) {
    var header = {
        namespace: 'Alexa.ConnectedHome.Control',
        name: name,
        payloadVersion: '2',
        messageId: messageId
    };

    var payload = {
        exception: {
            code: code,
            description: description
        }
    };

    var result = {
        header: header,
        payload: payload
    };

    return result;
}

/**
* Normilizes numeric/string thermostat modes to Alexa friendly ones
**/
function normalizeThermostatMode(mode){
  //if state returns as a decimal type, convert to string, this is a very common thermo pattern
  var m = mode;
  switch (mode) {
  case '0': //off, not supported! Weird. But nothing else todo.
      m = 'OFF';
      break;
  case '1': //heating
      m = 'HEAT';
      break;
  case '2': //cooling
      m = 'COOL';
      break;
  case 'heat-cool': //nest auto
  case '3': //auto
      m = 'AUTO';
      break;
  }
  return m.toUpperCase();
}

function isEventFahrenheit(event){
  return event.payload.appliance.additionalApplianceDetails.temperatureFormat &&
  event.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit';
}

module.exports.toF = toF;
module.exports.toC = toC;
module.exports.generateControlError = generateControlError;
module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.isEventFahrenheit = isEventFahrenheit;
