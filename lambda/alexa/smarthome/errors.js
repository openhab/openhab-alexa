/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { AxiosError } from 'axios';
import { Interface } from './constants.js';

/**
 * Defines alexa error class
 *  https://developer.amazon.com/docs/device-apis/alexa-errorresponse.html
 * @extends Error
 */
export class AlexaError extends Error {
  /**
   * Constructor
   * @param {String} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }

  /**
   * Returns error namespace
   * @return {String}
   */
  get namespace() {
    return Interface.ALEXA;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return undefined;
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return {};
  }

  /**
   * Returns new alexa error object based on error
   * @param  {Object} error
   * @return {Object}
   */
  static from(error) {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 400:
          return new InvalidValueError('Invalid item command value');
        case 401:
          return new InvalidAuthorizationCredentialError('Failed to authenticate');
        case 404:
          return new InvalidEndpointError('Endpoint not found');
        default:
          return new BridgeUnreachableError('Server not accessible');
      }
    } else {
      switch (error.name) {
        case 'SyntaxError':
        case 'TypeError':
          return new InternalError('Internal error');
        default:
          return new EndpointUnreachableError('Endpoint not reachable');
      }
    }
  }
}

/**
 * Defines bridge unreachable error class
 * @extends AlexaError
 */
export class BridgeUnreachableError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'BRIDGE_UNREACHABLE';
  }
}

/**
 * Defines endpoint unreachable error class
 * @extends AlexaError
 */
export class EndpointUnreachableError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'ENDPOINT_UNREACHABLE';
  }
}

/**
 * Defines internal error class
 * @extends AlexaError
 */
export class InternalError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'INTERNAL_ERROR';
  }
}

/**
 * Defines invalid authorization credential error class
 * @extends AlexaError
 */
export class InvalidAuthorizationCredentialError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'INVALID_AUTHORIZATION_CREDENTIAL';
  }
}

/**
 * Defines invalid directive error class
 * @extends AlexaError
 */
export class InvalidDirectiveError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'INVALID_DIRECTIVE';
  }
}

/**
 * Defines invalid value error class
 * @extends AlexaError
 */
export class InvalidValueError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'INVALID_VALUE';
  }
}

/**
 * Defines invalid endpoint error class
 * @extends AlexaError
 */
export class InvalidEndpointError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'NO_SUCH_ENDPOINT';
  }
}

/**
 * Defines current mode not supported error class
 * @extends AlexaError
 */
export class CurrentModeNotSupportedError extends AlexaError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'NOT_SUPPORTED_IN_CURRENT_MODE';
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return { currentDeviceMode: this.currentDeviceMode };
  }

  /**
   * Returns current device mode
   * @return {String}
   */
  get currentDeviceMode() {
    return 'OTHER';
  }
}

/**
 * Defines current mode color error class
 * @extends CurrentModeNotSupportedError
 */
export class CurrentModeColorError extends CurrentModeNotSupportedError {
  /**
   * Returns current device mode
   * @return {String}
   */
  get currentDeviceMode() {
    return 'COLOR';
  }
}

/**
 * Defines current mode not provisioned error class
 * @extends CurrentModeNotSupportedError
 */
export class CurrentModeNotProvisionedError extends CurrentModeNotSupportedError {
  /**
   * Returns current device mode
   * @return {String}
   */
  get currentDeviceMode() {
    return 'NOT_PROVISIONED';
  }
}

/**
 * Defines temperature out of range error class
 * @extends AlexaError
 */
export class TemperatureOutOfRangeError extends AlexaError {
  /**
   * Constructor
   * @param {String} message
   * @param {Object} parameters   [validRange, scale]
   */
  constructor(message, parameters = {}) {
    super(message);
    this._parameters = parameters;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'TEMPERATURE_VALUE_OUT_OF_RANGE';
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return !Array.isArray(this._parameters.validRange) || !this._parameters.scale
      ? {}
      : {
          validRange: {
            minimumValue: {
              value: this._parameters.validRange[0],
              scale: this._parameters.scale
            },
            maximumValue: {
              value: this._parameters.validRange[1],
              scale: this._parameters.scale
            }
          }
        };
  }
}

/**
 * Defines value out of range error class
 * @extends AlexaError
 */
export class ValueOutOfRangeError extends AlexaError {
  /**
   * Constructor
   * @param {String} message
   * @param {Object} parameters   [validRange]
   */
  constructor(message, parameters = {}) {
    super(message);
    this._parameters = parameters;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'VALUE_OUT_OF_RANGE';
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return !Array.isArray(this._parameters.validRange)
      ? {}
      : {
          validRange: {
            minimumValue: this._parameters.validRange[0],
            maximumValue: this._parameters.validRange[1]
          }
        };
  }
}

/**
 * Defines authorization accept grant error class
 *  https://developer.amazon.com/docs/device-apis/alexa-authorization.html#acceptgrant-error-handling
 * @extends AlexaError
 */
export class AuthorizationAcceptGrantError extends AlexaError {
  /**
   * Returns error namespace
   * @return {String}
   */
  get namespace() {
    return Interface.ALEXA_AUTHORIZATION;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'ACCEPT_GRANT_FAILED';
  }
}

/**
 * Defines safety namespace error class
 *  https://developer.amazon.com/docs/device-apis/alexa-safety-errorresponse.html
 * @extends AlexaError
 */
class SafetyError extends AlexaError {
  /**
   * Returns error namespace
   * @return {String}
   */
  get namespace() {
    return Interface.ALEXA_SAFETY;
  }
}

/**
 * Defines safety obstacle detected error class
 * @extends SafetyError
 */
export class SafetyObstacleDetectedError extends SafetyError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'OBSTACLE_DETECTED';
  }
}

/**
 * Defines security panel namespace error class
 *  https://developer.amazon.com/docs/device-apis/alexa-securitypanelcontroller-errorresponse.html
 * @extends AlexaError
 */
class SecurityPanelError extends AlexaError {
  /**
   * Returns error namespace
   * @return {String}
   */
  get namespace() {
    return Interface.ALEXA_SECURITY_PANEL_CONTROLLER;
  }
}

/**
 * Defines security panel authorization required error class
 * @extends SecurityPanelError
 */
export class SecurityPanelAuthorizationRequiredError extends SecurityPanelError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'AUTHORIZATION_REQUIRED';
  }
}

/**
 * Defines security panel bypass needed error class
 * @extends SecurityPanelError
 */
export class SecurityPanelBypassNeededError extends SecurityPanelError {
  /**
   * Constructor
   * @param {String} message
   * @param {Object} parameters   [endpointsNeedingBypass]
   */
  constructor(message, parameters = {}) {
    super(message);
    this._parameters = parameters;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'BYPASS_NEEDED';
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return !this._parameters.endpointsNeedingBypass
      ? {}
      : { endpointsNeedingBypass: this._parameters.endpointsNeedingBypass };
  }
}

/**
 * Defines security panel not ready needed error class
 * @extends SecurityPanelError
 */
export class SecurityPanelNotReadyError extends SecurityPanelError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'NOT_READY';
  }
}

/**
 * Defines security panel unauthorized error class
 * @extends SecurityPanelError
 */
export class SecurityPanelUnauthorizedError extends SecurityPanelError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'UNAUTHORIZED';
  }
}

/**
 * Defines security panel uncleared alarm error class
 * @extends SecurityPanelError
 */
export class SecurityPanelUnclearedAlarmError extends SecurityPanelError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'UNCLEARED_ALARM';
  }
}

/**
 * Defines security panel uncleared trouble error class
 * @extends SecurityPanelError
 */
export class SecurityPanelUnclearedTroubleError extends SecurityPanelError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'UNCLEARED_TROUBLE';
  }
}

/**
 * Defines thermostat namespace error class
 *  https://developer.amazon.com/docs/device-apis/alexa-thermostatcontroller-errorresponse.html
 * @extends AlexaError
 */
class ThermostatError extends AlexaError {
  /**
   * Returns error namespace
   * @return {String}
   */
  get namespace() {
    return Interface.ALEXA_THERMOSTAT_CONTROLLER;
  }
}

/**
 * Defines thermostat off error class
 * @extends ThermostatError
 */
export class ThermostatOffError extends ThermostatError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'THERMOSTAT_IS_OFF';
  }
}

/**
 * Defines thermostat mode unsupported error class
 * @extends ThermostatError
 */
export class ThermostatModeUnsupportedError extends ThermostatError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'UNSUPPORTED_THERMOSTAT_MODE';
  }
}

/**
 * Defines thermostat dual/triple setpoints unsupported error class
 * @extends ThermostatError
 */
export class ThermostatSetpointsUnsupportedError extends ThermostatError {
  /**
   * Constructor
   * @param {String} message
   * @param {Object} parameters   [isDualSetpoints]
   */
  constructor(message, parameters = {}) {
    super(message);
    this._parameters = parameters;
  }
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return this._parameters.isDualSetpoints ? 'DUAL_SETPOINTS_UNSUPPORTED' : 'TRIPLE_SETPOINTS_UNSUPPORTED';
  }
}

/**
 * Defines thermostat setpoints too close error class
 * @extends ThermostatError
 */
export class ThermostatSetpointsTooCloseError extends ThermostatError {
  /**
   * Constructor
   * @param {String} message
   * @param {Object} parameters   [minimumTemperatureDelta, scale]
   */
  constructor(message, parameters = {}) {
    super(message);
    this._parameters = parameters;
  }

  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'REQUESTED_SETPOINTS_TOO_CLOSE';
  }

  /**
   * Returns error payload
   * @return {Object}
   */
  get payload() {
    return !this._parameters.minimumTemperatureDelta || !this._parameters.scale
      ? {}
      : {
          minimumTemperatureDelta: {
            value: this._parameters.minimumTemperatureDelta,
            scale: this._parameters.scale
          }
        };
  }
}

/**
 * Defines thermostat schedule request error class
 * @extends ThermostatError
 */
export class ThermostatScheduleRequestError extends ThermostatError {
  /**
   * Returns error type
   * @return {String}
   */
  get type() {
    return 'UNWILLING_TO_SET_SCHEDULE';
  }
}
