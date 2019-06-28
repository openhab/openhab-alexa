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

var config = require('@root/config.js');
var certAuth = {
  key: fs.readFileSync(config.openhab.key),
  cert: fs.readFileSync(config.openhab.cert),
  passphrase: config.openhab.passphrase
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
 * Returns all items recursively with alexa, channel and synonyms metadata
 * @param  {String}   token
 * @return {Promise}
 */
function getItemsRecursively(token) {
  return getItemOrItems(token, null, {'metadata': 'alexa,channel,synonyms', 'recursive': true});
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
      'Content-Type': 'text/plain'
    },
    json: true,
    agentOptions: certAuth
  };
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
      'Content-Type': 'text/plain'
    },
    json: true,
    agentOptions: certAuth
  };
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
      'Content-Type': 'text/plain'
    },
    body: value.toString(),
    agentOptions: certAuth
  };
  return request(options);
}

module.exports = {
  getItem: getItem,
  getItemsRecursively: getItemsRecursively,
  getRegionalSettings: getRegionalSettings,
  postItemCommand: postItemCommand
};
