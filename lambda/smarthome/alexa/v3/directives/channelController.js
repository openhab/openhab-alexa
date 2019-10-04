/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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

/**
 * Defines Alexa.ChannelController interface directive class
 * @extends AlexaDirective
 */
class AlexaChannelController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ChannelController';
    this.map = {
      changeChannel: 'changeChannel',
      skipChannels: 'adjustChannel'
    };
  }

  /**
   * Change channel to number or name
   */
  changeChannel() {
    const properties = this.propertyMap.ChannelController;
    // Determine channel number using channel name if provided and defined in property parameters,
    //    otherwise use provided channel number
    const channelName = this.directive.payload.channelMetadata.name || '';
    const channelParam = Object.keys(properties.channel.parameters).find(
      name => name.toUpperCase() === channelName.toUpperCase())
    const channelNumber = properties.channel.parameters[channelParam] || this.directive.payload.channel.number;
    const postItem = Object.assign({}, properties.channel.item, {
      state: channelNumber
    });

    if (!isNaN(postItem.state)) {
      this.postItemsAndReturn([postItem]);
    } else {
      this.returnAlexaErrorResponse({
        payload: {
          type: 'INVALID_VALUE',
          message: `The channel cannot be changed to ${channelNumber || channelName}.`
        }
      });
    }
  }

  /**
   * Adjusts channel number
   */
  adjustChannel() {
    const postItem = Object.assign({}, this.propertyMap.ChannelController.channel.item);

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      postItem.state = parseInt(item.state) + this.directive.payload.channelCount;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaChannelController;
