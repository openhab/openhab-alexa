/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

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
      baseURL: process.env.OPENHAB_BASE_URL || 'https://localhost:8443/rest',
      user: process.env.OPENHAB_USERNAME || null,
      pass: process.env.OPENHAB_PASSWORD || null
    }
  };
  // Merge config file settings with default ones
  Object.assign(config, getConfigFileSettings());
  // Merge username & password if specified
  if (config.openhab.user && config.openhab.pass) {
    config.openhab.userpass = `${config.openhab.user}:${config.openhab.pass}`;
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
 * Returns openHAB authorization header value
 * @param  {String}   token
 * @return {String}
 */
function ohAuthorizationHeader(token) {
  if (config.openhab.userpass) {
    // Basic Authentication
    return 'Basic ' + new Buffer(config.openhab.userpass).toString('base64');
  } else {
    // OAuth2 Authentication
    return 'Bearer ' + token;
  }
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
 * Returns all items recursively with alexa metadata
 * @param  {String}   token
 * @return {Promise}
 */
function getItemsRecursively(token) {
  return getItemOrItems(token, null, {'metadata': 'alexa', 'recursive': true});
}

/**
 * Returns get item(s) result
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {Object}   parameters
 * @return {Promise}
 */
function getItemOrItems(token, itemName, parameters) {
  const options = {
    method: 'GET',
    uri: `${config.openhab.baseURL}/items${itemName ? '/' + itemName : ''}${parameters ? '?' + qs.stringify(parameters) : ''}`,
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain'
    },
    json: true
  }
  return request(options);
}

/**
 * Returns openHAB regional settings
 * @param  {String}   token
 * @return {Promise}
 */
function getRegionalSettings(token) {
  const options = {
    method: "GET",
    uri: `${config.openhab.baseURL}/services/org.eclipse.smarthome.core.i18nprovider/config`,
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain'
    },
    json: true
  }
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
  const options = {
    method: 'POST',
    uri: `${config.openhab.baseURL}/items/${itemName}`,
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain'
    },
    body: value.toString()
  }
  return request(options);
}

module.exports.getItem = getItem;
module.exports.getItemsRecursively = getItemsRecursively;
module.exports.getRegionalSettings = getRegionalSettings;
module.exports.postItemCommand = postItemCommand;
