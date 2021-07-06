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

const { clamp } = require('@root/utils');
const { Interface, Property } = require('../constants');
const { EndpointUnreachableError, InvalidValueError } = require('../errors');
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
   * Changes channel to number or name
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async changeChannel(directive, openhab) {
    const { item, channelMappings } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.CHANNEL
    });
    // Determine channel number using channel name if provided and defined in channelMappings parameter,
    //  otherwise use provided channel number
    const channelName = directive.payload.channelMetadata.name || '';
    const channelNumber = channelMappings[channelName.toUpperCase()] || directive.payload.channel.number;

    // Throw invalid value error if channel number not valid
    if (isNaN(channelNumber)) {
      throw new InvalidValueError(`The channel cannot be changed to ${channelNumber || channelName}.`);
    }

    await openhab.sendCommand(item.name, channelNumber);

    return directive.response();
  }

  /**
   * Adjusts channel number
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustChannel(directive, openhab) {
    const { item, channelMappings, isRetrievable } = directive.endpoint.getCapabilityProperty({
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

    const channelCount = directive.payload.channelCount;
    const channelNumbers = Object.values(channelMappings);
    const channelIndex = channelNumbers.indexOf(state);

    // Throw invalid value error if current channel not defined
    if (channelIndex === -1) {
      throw new InvalidValueError(`Current channel number ${state} is not defined in channel mappings.`);
    }

    const adjustedIndex = clamp(channelIndex + channelCount, 0, channelNumbers.length - 1);
    const channelNumber = channelNumbers[adjustedIndex];

    await openhab.sendCommand(item.name, channelNumber);

    return directive.response();
  }
}

module.exports = ChannelController;
