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
      log.error('Invalid channel:', {name: channelName, number: channelNumber});
      this.returnAlexaErrorResponse({
        payload: {
          type: 'INVALID_VALUE',
          message: 'Invalid channel'
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
      log.error('adjustChannel failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaChannelController;
