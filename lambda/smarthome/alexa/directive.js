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

/**
 * Amazon Smart Home Skill Directive for API V3
 */
const camelcase = require('camelcase');
const { sprintf } = require('sprintf-js');
const log = require('@lib/log.js');
const rest = require('@lib/rest.js');
const AlexaPropertyMap = require('./propertyMap.js');
const AlexaResponse = require('./response.js');

/**
 * Defines Alexa directive class
 * @extends AlexaResponse
 */
class AlexaDirective extends AlexaResponse {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.directive = directive;
    this.propertyMap = new AlexaPropertyMap();

    // if we have a JSON cookie, parse it and set on endpoint
    if (directive.endpoint && directive.endpoint.cookie && directive.endpoint.cookie.propertyMap) {
      this.propertyMap.load(directive.endpoint.cookie.propertyMap);
    }
  }

  /**
   * Executes directive based on its header camelcase name and map property
   */
  execute() {
    // Convert directive name to camelcase format
    //  e.g. AdjustBrightness => adjustBrightness
    const name = camelcase(this.directive.header.name);
    // Determine directive method name using map property if defined, fallback to directive camelcase name
    const method = this.map && this.map[name] || name;

    // Execute directive method and return error on exception
    try {
      this[method]();
    } catch (error) {
      log.error(`Failed to execute directive:\r${error.stack.replace(/\n/g, '\r')}`);
      this.returnAlexaErrorResponse({
        payload: error.name === 'TypeError' ? {
          type: 'INVALID_DIRECTIVE',
          message: 'Invalid directive'
        } : {
          type: 'INTERNAL_ERROR',
          message: 'Internal error'
        }
      });
    }
  }

  /**
   * Generic method to post list of items to OH
   *  and then return a formatted response to the Alexa request
   *
   * @param {Array}  items
   * @param {Object} parameters     Additional parameters [header, payload, properties] (optional)
   */
  postItemsAndReturn(items, parameters = {}) {
    const promises = items.map(item =>
      rest.postItemCommand(this.directive.endpoint.scope.token, item.name, item.state));
    Promise.all(promises).then(() => {
      this.getPropertiesResponseAndReturn(parameters);
    }).catch((error) => {
      log.error('postItemsAndReturn failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Generic method to generate properties response
   *  based of interface-specific properties latest item state from OH
   *  and then return a formatted response to the Alexa request
   *
   * @param {Object} parameters     Additional parameters [header, payload, properties] (optional)
   */
  getPropertiesResponseAndReturn(parameters = {}) {
    // Use the property map defined interface names if this.interface not defined (e.g. reportState)
    const interfaceNames = this.interface ? [this.interface] : Object.keys(this.propertyMap);
    // Get list of all unique reportable properties item objects part of interfaces
    const items = this.propertyMap.getReportablePropertiesItems(interfaceNames, parameters.properties);
    // Define get item state promises array, excluding items with defined state already
    const promises = items.reduce((promises, item) => promises.concat(
      typeof item.state !== 'undefined' ? [] : this.getItemState(item).then((result) => {
        // Update item information in propertyMap object for each item capabilities
        item.capabilities.forEach((capability) => {
          this.propertyMap[capability.interface][capability.property].item = result;
        });
        return result;
      })
    ), []);
    Promise.all(promises).then((items) => {
      // Get context properties response
      const properties = this.propertyMap.getContextPropertiesResponse(interfaceNames, items);
      // Throw error if no context properties found
      if (properties.length === 0) {
        throw {cause: 'Unable to get context properties response', properties: this.propertyMap};
      }
      // Get error response based on context property name/value if method defined
      const error = properties.reduce((error, property) => {
        const method = property.name + 'ErrorResponse';
        return this[method] && this[method](property.value) || error;
      }, undefined);
      // Generate/return properties response if error not defined, otherwise return error response
      if (typeof error === 'undefined') {
        const response = this.generateResponse(Object.assign(parameters, {
          context: {
            properties: properties
          }
        }));
        log.info('getPropertiesResponseAndReturn done with response:', response);
        this.returnAlexaResponse(response);
      } else {
        this.returnAlexaErrorResponse(error);
      }
    }).catch((error) => {
      log.error('getPropertiesResponseAndReturn failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Returns item state from OH using item sensor name, if defined, over standard one
   * @param  {Object}  item
   * @return {Promise}
   */
  getItemState(item) {
    const itemName = item.sensor || item.name;
    return rest.getItem(this.directive.endpoint.scope.token, itemName).then((result) =>
      // Set state to undefined if uninitialized or undefined in oh, otherwise get formatted item state
      Object.assign(result, {state: ['NULL', 'UNDEF'].includes(result.state) ? undefined : formatItemState(result)}));
  }
}

/**
 * Defines OH state description formatter pattern
 * @type {RegExp}
 */
const ITEM_STATE_FORMATTER_PATTERN = /%(?:[.0]\d+)?[dfs]/;

/**
 * Returns OH item state formatted based on its state description pattern
 * @param  {Object} item
 * @return {String}
 */
function formatItemState(item) {
  const format = item.stateDescription && item.stateDescription.pattern &&
    item.stateDescription.pattern.match(ITEM_STATE_FORMATTER_PATTERN);
  const state = item.state;
  const type = item.type.split(':').shift();

  if (format) {
    switch (type) {
      case 'Dimmer':
      case 'Number':
      case 'Rollershutter':
        return sprintf(format[0], parseFloat(state));
      case 'String':
        return sprintf(format[0], state);
    }
  }
  return state;
}

module.exports = AlexaDirective;
