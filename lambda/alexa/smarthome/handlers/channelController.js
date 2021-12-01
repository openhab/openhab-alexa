/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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

const { Interface, Property } = require('../constants');
const { EndpointUnreachableError, InvalidValueError, ValueOutOfRangeError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.ChannelController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-channelcontroller.html#directives
 * @extends AlexaHandler
 */
class ChannelController extends AlexaHandler {
  /**
   * Defines change channel directive
   * @type {String}
   */
  static CHANGE_CHANNEL = 'ChangeChannel';

  /**
   * Defines skip channels directive
   * @type {String}
   */
  static SKIP_CHANNELS = 'SkipChannels';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_CHANNEL_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ChannelController.CHANGE_CHANNEL]: this.changeChannel,
      [ChannelController.SKIP_CHANNELS]: this.adjustChannel
    };
  }

  /**
   * Changes channel
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async changeChannel(directive, openhab) {
    const { item, channelMappings, range } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.CHANNEL
    });
    // Determine channel number using channel name if provided, otherwise using provided channel number
    const channelName = directive.payload.channelMetadata.name;
    const channelNumber = channelName
      ? Object.keys(channelMappings).find((num) => channelMappings[num].toUpperCase() === channelName.toUpperCase())
      : directive.payload.channel.number;

    // Throw invalid value error if channel number not valid
    if (isNaN(channelNumber)) {
      throw new InvalidValueError(`The channel cannot be changed to ${channelNumber || channelName}.`);
    }

    // Throw value out of range error if channel number out of range
    if (channelNumber < range[0] || channelNumber > range[1]) {
      throw new ValueOutOfRangeError(`The channel cannot be changed to ${channelNumber}.`, { validRange: range });
    }

    await openhab.sendCommand(item.name, channelNumber);

    return directive.response();
  }

  /**
   * Adjusts channel
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustChannel(directive, openhab) {
    const { item, range, isRetrievable } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.CHANNEL
    });

    // Throw invalid value error if property not retrievable
    if (!isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
    }

    // Get item current state
    const state = await openhab.getItemState(item.name);

    // Throw endpoint unreachable error if state not a number
    if (isNaN(state)) {
      throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
    }

    // Determine adjusted channel number adding directive payload channel count value to current state
    const channelNumber = parseInt(state) + directive.payload.channelCount;

    // Throw value out of range error if adjusted channel number out of range
    if (channelNumber < range[0] || channelNumber > range[1]) {
      throw new ValueOutOfRangeError(`The channel cannot be adjusted to ${channelNumber}.`, { validRange: range });
    }

    await openhab.sendCommand(item.name, channelNumber);

    return directive.response();
  }
}

module.exports = ChannelController;
