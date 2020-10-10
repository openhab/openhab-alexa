/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
const Agent = require('agentkeepalive');

/**
 * Defines configuration settings object
 * @type {Object}
 */
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
      user: process.env.OPENHAB_USERNAME,
      pass: process.env.OPENHAB_PASSWORD,
      certFile: process.env.OPENHAB_CERT_FILE || 'ssl/client.pfx',
      certPass: process.env.OPENHAB_CERT_PASSPHRASE
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
    config.openhab.cert = fs.readFileSync(`${process.cwd()}/${config.openhab.certFile}`);
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
 * Returns request options with openHAB authentication settings
 * @param  {String}   token
 * @param  {Object}   options
 * @return {Object}
 */
function ohAuthenticationSettings(token, options = {}) {
  if (config.openhab.cert) {
    // SSL Certificate Authentication
    options.agentOptions = Object.assign({}, options.agentOptions, {
      pfx: config.openhab.cert,
      passphrase: config.openhab.certPass
    });
  } else {
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
 * @param  {Number}   timeout
 * @return {Promise}
 */
function getItem(token, itemName, timeout) {
  return getItemOrItems(token, itemName, timeout);
}

/**
 * Returns all items with alexa, channel and synonyms metadata
 * @param  {String}   token
 * @param  {Number}   timeout
 * @return {Promise}
 */
function getItems(token, timeout) {
  const parameters = {
    fields: 'editable,groupNames,groupType,name,label,metadata,stateDescription,tags,type',
    metadata: 'alexa,autoupdate,channel,synonyms'
  };
  return getItemOrItems(token, null, timeout, parameters);
}

/**
 * Returns get item(s) result
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {Number}   timeout
 * @param  {Object}   parameters
 * @return {Promise}
 */
function getItemOrItems(token, itemName, timeout, parameters) {
  const options = ohAuthenticationSettings(token, {
    method: 'GET',
    uri: `${config.openhab.baseURL}/items/${itemName || ''}`,
    qs: parameters,
    json: true
  });
  return handleRequest(options, timeout);
}

/**
 * Returns root resource
 * @param  {String} token
 * @param  {Number} timeout
 * @return {Object}
 */
function getRootResource(token, timeout) {
  const options = ohAuthenticationSettings(token, {
    method: 'GET',
    uri: `${config.openhab.baseURL}/`,
    json: true
  });
  return handleRequest(options, timeout);
}

/**
 * Returns openHAB service config
 * @param  {String}   token
 * @param  {String}   serviceId
 * @param  {Number}   timeout
 * @return {Promise}
 */
function getServiceConfig(token, serviceId, timeout) {
  const options = ohAuthenticationSettings(token, {
    method: 'GET',
    uri: `${config.openhab.baseURL}/services/${serviceId}/config`,
    json: true
  });
  return handleRequest(options, timeout);
}

/**
 * POST a command to a item
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {String}   value
 * @param  {Number}   timeout
 * @return {Promise}
 */
function postItemCommand(token, itemName, value, timeout) {
  const options = ohAuthenticationSettings(token, {
    method: 'POST',
    uri: `${config.openhab.baseURL}/items/${itemName}`,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: value.toString()
  });
  return handleRequest(options, timeout);
}

/**
 * Handles http request
 * @param  {Object}   options
 * @param  {Number}   timeout
 * @return {Promise}
 */
function handleRequest(options, timeout) {
  // Add default request options
  Object.assign(options, {
    agentClass: options.uri.startsWith('https') ? Agent.HttpsAgent : Agent,
    agentOptions: Object.assign({}, options.agentOptions, {
      // Set keep-alive free socket to timeout after 45s of inactivity
      freeSocketTimeout: 45000
    }),
    headers: Object.assign({}, options.headers, {
      'Cache-Control': 'no-cache'
    }),
    gzip: true,
    timeout: parseInt(timeout)
  });
  return request(options);
}

module.exports = {
  getItem: getItem,
  getItems: getItems,
  getRootResource: getRootResource,
  getServiceConfig: getServiceConfig,
  postItemCommand: postItemCommand
};
