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
    const channelIndex = Object.keys(properties.channel.parameters).findIndex(
      name => name.toUpperCase() === channelName.toUpperCase())
    const channelNumber = channelIndex !== -1 ?
      Object.values(properties.channel.parameters)[channelIndex] : this.directive.payload.channel.number;
    const postItem = Object.assign(properties.channel.item, {
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
    const channelCount = this.directive.payload.channelCount;
    const postItem = this.propertyMap.ChannelController.channel.item;
    this.getItemState(postItem).then((item) => {
      postItem.state = isNaN(item.state) ? Math.abs(channelCount) : parseInt(item.state) + channelCount;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustChannel failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }
}

module.exports = AlexaChannelController;
