/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const log = require('@lib/log.js');
const AlexaDirective = require('../directive.js');
const { normalize } = require('../propertyState.js');

/**
 * Defines Alexa.ModeController interface directive class
 * @extends AlexaDirective
 */
class AlexaModeController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ModeController';
    this.map = {
      setMode: 'setMode',
      adjustMode: 'adjustMode'
    };
  }

  /**
   * Set mode
   */
  setMode() {
    // Append instance name to interface property
    this.interface += ':' + this.directive.header.instance;
    const properties = this.propertyMap[this.interface];
    const postItem = Object.assign(properties.mode.item, {
      state: normalize(properties.mode, this.directive.payload.mode)
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust mode
   */
  adjustMode() {
    // Append instance name to interface property
    this.interface += ':' + this.directive.header.instance;
    const properties = this.propertyMap[this.interface];
    const postItem = properties.mode.item;
    
    this.getItemState(postItem).then((item) => {
      // Convert current item state to alexa state
      const currentMode = normalize(properties.mode, item.state);
      // Define supported modes list stripping alternate modes
      const supportedModes = properties.mode.parameters.supportedModes.map(mode => mode.split(':').shift());
      // Find current mode index
      const index = supportedModes.findIndex(mode => mode === currentMode);
      // Convert back adjusted mode to OH state, if current mode found
      postItem.state = index > -1 ?
        normalize(properties.mode, supportedModes[index + this.directive.payload.modeDelta]) : undefined;

      if (typeof postItem.state !== 'undefined') {
        this.postItemsAndReturn([postItem]);
      } else {
        // Return out of range error if current mode found, otherwise not provisioned error
        this.returnAlexaErrorResponse({
          payload: index > -1 ? {
            type: 'VALUE_OUT_OF_RANGE',
            message: 'Adjusted mode value is out of range'
          } : {
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'Adjusted mode value cannot be set',
            currentDeviceMode: 'NOT_PROVISIONED'
          }
        });
      }
    }).catch((error) => {
      log.error('adjustMode failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }
}

module.exports = AlexaModeController;
