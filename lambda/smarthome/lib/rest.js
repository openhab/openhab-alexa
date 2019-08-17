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

const fs = require('fs');
const request = require('request-promise-native');
const qs = require('querystring');

const config = getConfig();

/**
 * Returns config settings
 * @return {Object}
 */
function getConfig() {
  // Default configuration
  const config = {
    openhab: {
      baseURL: process.env.OPENHAB_BASE_URL || 'https://myopenhab.org/rest',
      user: process.env.OPENHAB_USERNAME || null,
      pass: process.env.OPENHAB_PASSWORD || null,
      certFile: process.env.OPENHAB_CERT_FILE || 'ssl/client.pfx',
      certPass: process.env.OPENHAB_CERT_PASSPHRASE || null
    }
  };
  // Merge config file settings with default ones
  Object.assign(config, getConfigFileSettings());
  // Merge username & password if specified
  if (config.openhab.user && config.openhab.pass) {
    config.openhab.userpass = `${config.openhab.user}:${config.openhab.pass}`;
  }
  // Load ssl client certificate if available
  if (fs.existsSync(config.openhab.certFile)) {
    config.openhab.cert = fs.readFileSync(config.openhab.certFile);
  }
  return config;
}

/**
 * Returns config file settings
 * @return {Object}
 */
function getConfigFileSettings() {
  try {
    return require('@root/config.js');
  } catch (e) {
    return {};
  }
}

/**
 * Returns request options object with openHAB authentication settings
 * @param  {String}   token
 * @param  {Object}   options
 * @return {Object}
 */
function getAuthenticationSettings(token, options) {
  if (config.openhab.cert) {
    // SSL Certificate Authentication
    options.agentOptions = Object.assign({}, options.agentOptions, {
      'pfx': config.openhab.cert
    }, config.openhab.certPass && {
      'passphrase': config.openhab.certPass
    });
  } else if (config.openhab.userpass || token) {
    options.headers = Object.assign({}, options.headers, {
      'Authorization': config.openhab.userpass ?
        // Basic Authentication
        'Basic ' + Buffer.from(config.openhab.userpass).toString('base64') :
        // OAuth2 Authentication
        'Bearer ' + token
    });
  }
  return options;
}

/**
 * Returns a single item
 * @param  {String}   token
 * @param  {String}   itemName
 * @return {Promise}
 */
function getItem(token, itemName) {
  return getItemOrItems(token, itemName);
}

/**
 * Returns all items with alexa, channel and synonyms metadata
 * @param  {String}   token
 * @return {Promise}
 */
function getItems(token) {
  const parameters = {
    fields: 'editable,groupNames,groupType,name,label,metadata,state,stateDescription,tags,type',
    metadata: 'alexa,channel,synonyms'
  };
  return getItemOrItems(token, null, parameters);
}

/**
 * Returns get item(s) result
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {Object}   parameters
 * @return {Promise}
 */
function getItemOrItems(token, itemName, parameters) {
  const options = getAuthenticationSettings(token, {
    method: 'GET',
    uri: `${config.openhab.baseURL}/items${itemName ? '/' + itemName : ''}${parameters ? '?' + qs.stringify(parameters) : ''}`,
    headers: {
      'Content-Type': 'text/plain'
    },
    json: true
  });
  return request(options);
}

/**
 * Returns openHAB regional settings
 * @param  {String}   token
 * @return {Promise}
 */
function getRegionalSettings(token) {
  const options = getAuthenticationSettings(token, {
    method: "GET",
    uri: `${config.openhab.baseURL}/services/org.eclipse.smarthome.core.i18nprovider/config`,
    headers: {
      'Content-Type': 'text/plain'
    },
    json: true
  });
  return request(options);
}

/**
 * POST a command to a item
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {String}   value
 * @return {Promise}
 **/
function postItemCommand(token, itemName, value) {
  const options = getAuthenticationSettings(token, {
    method: 'POST',
    uri: `${config.openhab.baseURL}/items/${itemName}`,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: value.toString()
  });
  return request(options);
}

module.exports = {
  getItem: getItem,
  getItems: getItems,
  getRegionalSettings: getRegionalSettings,
  postItemCommand: postItemCommand
};
