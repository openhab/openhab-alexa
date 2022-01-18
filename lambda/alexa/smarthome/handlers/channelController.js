/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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
const { ItemType } = require('@openhab/constants');
const { Interface, Property } = require('../constants');
const { EndpointUnreachableError, InvalidValueError, ValueOutOfRangeError } = require('../errors');
const { ChannelStep } = require('../properties');
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
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.CHANNEL
    });

    // Throw invalid value error if no channel property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No channel property defined.');
    }

    const { item, channelMappings, range, supportsChannelNumber } = property;
    const channelName = directive.payload.channelMetadata.name;
    const channelNumber = directive.payload.channel.number;

    // Determine command as follow:
    //  1) using directive payload channel metadata name if defined
    //  2) using directive payload channel number if supported
    //  3) undefined
    const command = channelName
      ? Object.keys(channelMappings).find(
          (channel) => channelMappings[channel].toUpperCase() === channelName.toUpperCase()
        )
      : supportsChannelNumber
      ? channelNumber
      : undefined;

    // Throw invalid value error if command not defined
    if (typeof command === 'undefined') {
      throw new InvalidValueError(`The channel cannot be changed to ${channelName || channelNumber}.`);
    }

    if (item.type === ItemType.NUMBER) {
      // Throw invalid value error if command not a number
      if (isNaN(command)) {
        throw new InvalidValueError(`The channel cannot be changed to ${command}.`);
      }

      // Throw value out of range error if command out of range
      if (command < range[0] || command > range[1]) {
        throw new ValueOutOfRangeError(`The channel cannot be changed to ${command}.`, { validRange: range });
      }
    }

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }

  /**
   * Adjusts channel
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustChannel(directive, openhab) {
    const properties = directive.endpoint.getCapabilityPropertyMap({ interface: directive.namespace });
    const channel = properties[Property.CHANNEL];
    const channelStep = properties[Property.CHANNEL_STEP];
    const channelCount = directive.payload.channelCount;
    let item, command;

    if (channelStep) {
      // Define item to send command to
      item = channelStep.item;
      // Determine command using channel step up/down based on directive payload channel count value
      command = channelStep.getCommand(channelCount >= 0 ? ChannelStep.UP : ChannelStep.DOWN);
    } else {
      const { channelMappings, range, isRetrievable } = channel;
      // Define item to send command to
      item = channel.item;

      // Throw invalid value error if property not retrievable
      if (!isRetrievable) {
        throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
      }

      // Get item current state
      const state = await openhab.getItemState(item.name);

      if (item.type === ItemType.NUMBER) {
        // Throw endpoint unreachable error if state not a number
        if (isNaN(state)) {
          throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
        }

        // Determine command adding directive payload channel count value to current state
        command = clamp(parseInt(state) + channelCount, range[0], range[1]);
      } else {
        const channels = Object.keys(channelMappings);
        const index = channels.indexOf(state);

        // Throw invalid value error if current state not defined in channel mappings
        if (index === -1) {
          throw new InvalidValueError(`Current channel ${state} is not defined in channel mappings.`);
        }

        // Determine command adding directive payload channel count value to current channel mappings index
        command = channels[clamp(index + channelCount, 0, channels.length - 1)];
      }
    }

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = ChannelController;
