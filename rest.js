/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const fs = require('fs');
const request = require('request-promise-native');
const qs = require('querystring');

const log = require('./log.js');
const utils = require('./utils.js');
var config = getConfig();

/**
 * Get config
 */
function getConfig() {
  // Default configuration
  var defaults = {
    openhab: {
      baseURL: process.env.OPENHAB_BASE_URL|| 'https://localhost:8443/rest',
      user: process.env.OPENHAB_USERNAME || null,
      pass: process.env.OPENHAB_PASSWORD || null
    }
  };
  // Merge file config settings, if exists, with default ones
  var config = Object.assign(defaults,
    fs.existsSync('./config.js') ? require('./config.js') : {}
  );
  // Merge username & password if specified
  if (config.openhab.user && config.openhab.pass) {
    config.openhab.userpass = config.openhab.user + ":" + config.openhab.pass;
  }
  return config;
}

/**
 * Returns openHAB authorization header value
 * @param  {String} token
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
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItem(token, itemName) {
  return getItemOrItems(token, itemName, null);
}

/**
 * Returns all items (v2)
 * @param  {String}   token
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItems(token) {
  return getItemOrItems(token, null, null);
}

/**
 * Returns all items recursively with alexa metadata (v3)
 * @param  {String}   token
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItemsRecursively(token) {
  return getItemOrItems(token, null, {'metadata': 'alexa', 'recursive': true});
}

/**
 * Returns get item(s) result
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {Object}   parameters
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItemOrItems(token, itemName, parameters) {
  var options = {
    method: "GET",
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
 * POST a command to a item
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {String}   value
 * @param  {Function} success
 * @param  {Function} failure
 **/
function postItemCommand(token, itemName, value) {
  var data = value.toString();
  var options = {
    method: "POST",
    uri: `${config.openhab.baseURL}/items/${itemName}`,
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain'
    },
    body: data
  }
  if (itemName) {
    return request(options);
  } else {
    return Promise.reject("No item name provided");
  }
}
module.exports.getItem = getItem;
module.exports.getItems = getItems;
module.exports.getItemsRecursively = getItemsRecursively;
module.exports.postItemCommand = postItemCommand;
