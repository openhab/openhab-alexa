/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import fs from 'node:fs';
import axios from 'axios';
import { HttpsAgent } from 'agentkeepalive';
import { validate as uuidValidate } from 'uuid';
import config from '#root/config.js';
import packageInfo from '#root/package.json' with { type: 'json' };
import { ItemType, ItemValue, UnitSymbol } from './constants.js';

/**
 * Defines openHAB class
 */
export default class OpenHAB {
  /**
   * Defines item state presentation format pattern
   * @type {RegExp}
   */
  static #STATE_PRESENTATION_PATTERN =
    /%\d*(?:\.(?<precision>\d+))?(?<specifier>[df])\s*(?:%unit%|[%]?(?<symbol>.+))?$/;

  /**
   * Constructor
   * @param {Object} debug
   * @param {String} requestId
   * @param {String} token
   * @param {Number} timeout
   */
  constructor(debug, requestId, token, timeout) {
    this._client = OpenHAB.createClient(config.openhab, debug, requestId, token, timeout);
  }

  /**
   * Returns formatted item state
   * @param  {String}  itemName
   * @return {Promise}
   */
  async getItemState(itemName) {
    const item = await this.getItem(itemName);
    // Return formatted item state if item defined and its state is not NULL or UNDEF, otherwise undefined
    return item && item.state !== ItemValue.NULL && item.state !== ItemValue.UNDEFINED
      ? OpenHAB.formatItemState(item)
      : undefined;
  }

  /**
   * Returns all items with metadata
   * @return {Promise}
   */
  async getAllItems() {
    let items;

    // Retrieve all items up to 3 tries if not an array
    for (let tries = 0; !Array.isArray(items); tries++) {
      if (tries >= 3) throw new TypeError('Failed to retrieve all items formatted array');
      items = await this.getItems();
    }

    return items;
  }

  /**
   * Returns server settings based on api version
   * @return {Promise}
   */
  async getServerSettings() {
    // Request following data from openHAB:
    //  - root resource
    //  - uuid
    const [properties, uuid] = await Promise.all([this.getRootResource(), this.getUUID().catch(() => undefined)]);
    const { locale, measurementSystem, runtimeInfo, version } = properties || {};
    const apiVersion = parseFloat(version);
    const settings = { regional: {}, runtime: { ...(uuidValidate(uuid) && { uuid }) } };

    if (apiVersion >= 4) {
      // Use root resource properties for OH 3.0 and later [API Version >= 4]
      const [language, region] = locale.split('_');
      // Set regional/runtime version settings
      settings.regional = { language, measurementSystem, region };
      settings.runtime.version = runtimeInfo.version;
    } else if (apiVersion > 0) {
      // Use i18n service config for OH 2.0 to 2.5:
      //  - org.eclipse.smarthome.i18n (OH 2.5) [API Version == 3]
      //  - org.eclipse.smarthome.core.i18nprovider (OH 2.0 -> 2.4) [API Version <= 2]
      const serviceId = apiVersion === 3 ? 'org.eclipse.smarthome.i18n' : 'org.eclipse.smarthome.core.i18nprovider';
      const { language, measurementSystem, region } = await this.getServiceConfig(serviceId);
      // Set regional/runtime version settings
      settings.regional = { language, measurementSystem, region };
      settings.runtime.version = '2';
    }

    return settings;
  }

  /**
   * Returns a single item
   * @param  {String}  itemName
   * @return {Promise}
   */
  getItem(itemName) {
    const options = {
      method: 'GET',
      url: `/rest/items/${itemName}`
    };
    return this._client(options);
  }

  /**
   * Returns all items
   * @return {Promise}
   */
  getItems() {
    const options = {
      method: 'GET',
      url: '/rest/items',
      params: {
        fields: 'editable,groupNames,groupType,name,label,metadata,stateDescription,tags,type,unitSymbol',
        metadata: 'alexa,autoupdate,channel,synonyms'
      }
    };
    return this._client(options);
  }

  /**
   * Returns root resource
   * @return {Promise}
   */
  getRootResource() {
    const options = {
      method: 'GET',
      url: '/rest/'
    };
    return this._client(options);
  }

  /**
   * Returns a service config
   * @param  {String}  serviceId
   * @return {Promise}
   */
  getServiceConfig(serviceId) {
    const options = {
      method: 'GET',
      url: `/rest/services/${serviceId}/config`
    };
    return this._client(options);
  }

  /**
   * Returns uuid
   * @return {Promise}
   */
  getUUID() {
    const options = {
      method: 'GET',
      url: '/rest/uuid'
    };
    return this._client(options);
  }

  /**
   * Sends a command to an item
   * @param  {String}  itemName
   * @param  {String}  command
   * @return {Promise}
   */
  sendCommand(itemName, command) {
    const options = {
      method: 'POST',
      url: `/rest/items/${itemName}`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: command.toString()
    };
    return this._client(options);
  }

  /**
   * Updates the state of an item
   * @param  {String}  itemName
   * @param  {String}  state
   * @return {Promise}
   */
  postUpdate(itemName, state) {
    const options = {
      method: 'PUT',
      url: `/rest/items/${itemName}/state`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: state.toString()
    };
    return this._client(options);
  }

  /**
   * Returns request client
   * @param  {Object} config
   * @param  {Object} debug
   * @param  {String} requestId
   * @param  {String} token
   * @param  {Number} timeout
   * @return {Object}
   */
  static createClient(config, debug, requestId, token, timeout) {
    const client = axios.create({
      baseURL: config.baseURL,
      headers: {
        common: {
          'Cache-Control': 'no-cache',
          'User-Agent': `${packageInfo.name}/${packageInfo.version}`,
          'X-Amzn-RequestId': requestId
        }
      },
      httpsAgent: new HttpsAgent({
        // Set keep-alive free socket to timeout after 45s of inactivity
        freeSocketTimeout: 45000
      }),
      timeout: parseInt(timeout)
    });

    // Add authentication options
    if (fs.existsSync(config.certFile)) {
      // SSL Certificate Authentication
      client.defaults.httpsAgent.options.pfx = fs.readFileSync(config.certFile);
      client.defaults.httpsAgent.options.passphrase = config.certPass;
    } else if (config.user && config.pass) {
      // Basic Authentication
      client.defaults.auth = { username: config.user, password: config.pass };
    } else if (token) {
      // OAuth2 Authentication
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    // Set request interceptor
    client.interceptors.request.use((config) => {
      debug.startTrace(`${config.method.toUpperCase()} ${config.url}`);
      return config;
    });
    // Set response interceptor
    client.interceptors.response.use(
      (response) => {
        debug.endTrace(`${response.config.method.toUpperCase()} ${response.config.url}`);
        return response.data;
      },
      (error) => {
        debug.endTrace(`${error.config.method.toUpperCase()} ${error.config.url}`, error.message);
        return Promise.reject(error);
      }
    );

    return client;
  }

  /**
   * Returns item state formatted based on its state description pattern and type
   * @param  {Object} item
   * @return {String}
   */
  static formatItemState(item) {
    const state = item.state;
    const type = (item.groupType || item.type).split(':')[0];

    if (type === ItemType.DIMMER || type === ItemType.NUMBER || type === ItemType.ROLLERSHUTTER) {
      const precision = this.getStatePresentationPrecision(item.stateDescription?.pattern);
      const value = parseFloat(state);

      return isNaN(precision) ? value.toString() : value.toFixed(precision);
    }

    return state;
  }

  /**
   * Returns state presentation precision for a given item state description pattern
   *
   * @param  {String} pattern
   * @return {Number}
   */
  static getStatePresentationPrecision(pattern) {
    const { precision, specifier } = pattern?.match(this.#STATE_PRESENTATION_PATTERN)?.groups || {};
    return specifier === 'd' ? 0 : precision <= 16 ? parseInt(precision) : NaN;
  }

  /**
   * Returns state presentation unit system for a given item state description pattern
   *
   * @param  {String} pattern
   * @return {String}
   */
  static getStatePresentationUnitSymbol(pattern) {
    const { symbol } = pattern?.match(this.#STATE_PRESENTATION_PATTERN)?.groups || {};
    return Object.values(UnitSymbol).includes(symbol) ? symbol : undefined;
  }
}
