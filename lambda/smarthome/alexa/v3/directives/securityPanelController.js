/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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

const AlexaDirective = require('../directive.js');
const { normalize } = require('../propertyState.js');

/**
 * Defines Alexa.SecurityPanelController interface directive class
 * @extends AlexaDirective
 */
class AlexaSecurityPanelController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'SecurityPanelController';
    this.map = {
      arm: 'arm',
      disarm: 'disarm'
    };
  }

  /**
   * Arm security panel
   */
  arm() {
    const armState = this.directive.payload.armState;
    const properties = this.propertyMap.SecurityPanelController;
    const postItem = Object.assign({}, properties.armState.item, {
      state: normalize(properties.armState, armState)
    });
    const exitDelay = parseInt(properties.armState.parameters.exitDelay);

    // Return invalid value error response if requested arm state not supported
    if (!properties.armState.parameters.supportedArmStates.includes(armState)) {
      return this.returnAlexaErrorResponse({
        payload: {
          type: 'INVALID_VALUE',
          message: `${postItem.name} doesn't support arm state [${armState}]`
        }
      });
    }

    this.getItemState(postItem).then((item) => {
      // Convert current item state to alexa state
      const currentState = normalize(properties.armState, item.state);

      // Return authorization required error when currently in armed away state and request to arm stay or night
      if (currentState === 'ARMED_AWAY' && ['ARMED_STAY', 'ARMED_NIGHT'].includes(armState)) {
        this.returnAlexaErrorResponse(
          this.armStateErrorResponse('AUTHORIZATION_REQUIRED')
        );
      } else {
        this.postItemsAndReturn([postItem], {
          header: {
            'namespace': this.directive.header.namespace,
            'name': 'Arm.Response'
          },
          // Add exit delay to response payload if arm away request and is valid
          payload: armState !== 'ARMED_AWAY' || isNaN(exitDelay) ? {} : {
            'exitDelayInSeconds': exitDelay
          },
          properties: ['armState']
        });
      }
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Disarm security panel
   */
  disarm() {
    const properties = this.propertyMap.SecurityPanelController;
    const postItem = Object.assign({}, properties.armState.item, {
      state: normalize(properties.armState, 'DISARMED')
    });

    // Append pin code to post item state if authorization code provided and pin type
    if (this.directive.payload.authorization && this.directive.payload.authorization.type === 'FOUR_DIGIT_PIN') {
      postItem.state += ':' + this.directive.payload.authorization.value;
    }

    this.postItemsAndReturn([postItem], {properties: ['armState']});
  }

  /**
   * Returns arm state error response based on given state
   * @param  {String} state
   * @return {Object}
   */
  armStateErrorResponse(state) {
    const response = {
      namespace: this.directive.header.namespace
    };

    switch (state) {
      case 'AUTHORIZATION_REQUIRED':
        return Object.assign(response, {payload: {
          type: 'AUTHORIZATION_REQUIRED',
          message: 'Unable to arm the security panel because authorization is required'
        }});
      case 'BYPASS_NEEDED':
        return Object.assign(response, {payload: {
          type: 'BYPASS_NEEDED',
          message: 'Unable to arm the security panel because it has open zones that must be bypassed'
        }});
      case 'NOT_READY':
        return Object.assign(response, {payload: {
          type: 'NOT_READY',
          message: 'Unable to arm or disarm the security panel because it is not ready'
        }});
      case 'UNAUTHORIZED':
        return Object.assign(response, {payload: {
          type: 'UNAUTHORIZED',
          message: 'Unable to disarm the security panel because the PIN code is not correct'
        }});
      case 'UNCLEARED_ALARM':
        return Object.assign(response, {payload: {
          type: 'UNCLEARED_ALARM',
          message: 'Unable to arm the security panel because it is in alarm status'
        }});
      case 'UNCLEARED_TROUBLE':
        return Object.assign(response, {payload: {
          type: 'UNCLEARED_TROUBLE',
          message: 'Unable to arm the security panel because it is in trouble status'
        }});
    }
  }
}

module.exports = AlexaSecurityPanelController;
