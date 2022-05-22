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

const log = require('@root/log');
const { ItemType } = require('@openhab/constants');
const { Interface } = require('../constants');
const AlexaEndpoint = require('../endpoint');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.Discovery interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-discovery.html#directives
 * @extends AlexaHandler
 */
class Discovery extends AlexaHandler {
  /**
   * Defines alexa discovery endpoints limit
   *  https://developer.amazon.com/docs/device-apis/alexa-discovery.html#limits
   * @type {Number}
   */
  static #ENDPOINTS_LIMIT = 300;

  /**
   * Defines discover directive
   * @type {String}
   */
  static DISCOVER = 'Discover';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_DISCOVERY;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [Discovery.DISCOVER]: this.discover
    };
  }

  /**
   * Discovers alexa endpoints
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async discover(directive, openhab) {
    // Request following data from openHAB:
    //  - all items
    //  - server settings
    const [items, settings] = await Promise.all([openhab.getAllItems(), openhab.getServerSettings()]);
    const groups = items.filter((item) => item.type === ItemType.GROUP && !item.groupType);
    const endpoints = [];
    const groupItems = [];

    log.debug('Data:', { items, settings });

    // Iterate over items retrieved
    for (const item of items) {
      // Create new endpoint from item
      const endpoint = AlexaEndpoint.fromItem(item, settings, groups);
      // Skip item if endpoint friendly name not defined or if already part of a group
      if (!endpoint.friendlyName || groupItems.includes(item.name)) {
        continue;
      }

      // Add group member capabilities if endpoint group
      if (endpoint.isGroup) {
        items
          .filter(
            (member) => member.groupNames?.includes(item.name) && (member.groupType || member.type) !== ItemType.GROUP
          )
          .forEach((member) => {
            log.debug(`adding ${member.name} to group endpoint ${endpoint.id}`);
            endpoint.addItemCapabilities(member, settings);
            groupItems.push(member.name);
          });
      }

      // Add endpoint health capability
      endpoint.addEndpointHealthCapability();
      // Add alexa capability
      endpoint.addAlexaCapability();

      // Add endpoint to list if is valid
      if (endpoint.isValid) {
        endpoints.push(endpoint);
      }
    }

    // Return directive response excluding endpoints part of a group
    return directive.response({
      namespace: directive.namespace,
      name: `${directive.name}.Response`,
      payload: {
        endpoints: endpoints
          .filter((endpoint) => !groupItems.includes(endpoint.id))
          .slice(0, Discovery.#ENDPOINTS_LIMIT)
          .map((endpoint) => endpoint.toJSON())
      }
    });
  }
}

module.exports = Discovery;
