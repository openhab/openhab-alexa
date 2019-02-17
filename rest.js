/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var fs = require('fs');
var http = require('http');
var https = require('https');
var qs = require('querystring');

var log = require('./log.js');
var utils = require('./utils.js');
var config = getConfig();

/**
 * Get config
 */
function getConfig() {
  // Default configuration
  var defaults = {
    openhab: {
      host: process.env.OPENHAB_HOST || 'localhost',
      port: process.env.OPENHAB_PORT || 8443,
      path: process.env.OPENHAB_PATH || '/rest',
      user: process.env.OPENHAB_USERNAME || null,
      pass: process.env.OPENHAB_PASSWORD || null,
      proto: process.env.OPENHAB_PROTOCOL || 'https'
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
function getItem(token, itemName, success, failure) {
  getItemOrItems(token, itemName, null, success, failure);
}

/**
 * Returns all items (v2)
 * @param  {String}   token
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItems(token, success, failure) {
  getItemOrItems(token, null, null, success, failure);
}

/**
 * Returns all items recursively with alexa metadata (v3)
 * @param  {String}   token
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItemsRecursively(token, success, failure) {
  getItemOrItems(token, null, {'metadata': 'alexa', 'recursive': true}, success, failure);
}

/**
 * Returns get item(s) result
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {Object}   parameters
 * @param  {Function} success
 * @param  {Function} failure
 */
function getItemOrItems(token, itemName, parameters, success, failure) {
  var options = {
    hostname: config.openhab.host,
    port: config.openhab.port,
    path: config.openhab.path + '/items' + (itemName ? '/' + itemName : '') +
      (parameters ? '?' + qs.stringify(parameters) : ''),
    method: 'GET',
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain'
    }
  };

  httpRequest(options, null, config.openhab.proto, success, failure);
}

/**
 * POST a command to a item
 * @param  {String}   token
 * @param  {String}   itemName
 * @param  {String}   value
 * @param  {Function} success
 * @param  {Function} failure
 **/
function postItemCommand(token, itemName, value, success, failure) {
  var data = value.toString();
  var options = {
    hostname: config.openhab.host,
    port: config.openhab.port,
    path: config.openhab.path + '/items/' + itemName,
    method: 'POST',
    headers: {
      'Authorization': ohAuthorizationHeader(token),
      'Content-Type': 'text/plain',
      'Content-Length': data.length
    }
  };

  if (itemName) {
    httpRequest(options, data, config.openhab.proto, success, failure);
  } else {
    failure({
      message: 'No item name provided'
    });
  }
}

/**
 * Handles HTTP request
 * @param  {Object}   options
 * @param  {String}   data
 * @param  {String}   protocol
 * @param  {Function} success
 * @param  {Function} failure
 */
function httpRequest(options, data, protocol, success, failure) {
  // log.debug('http request: ' + JSON.stringify({options: options, data: data, protocol: protocol}));
  var proto = protocol === 'http' ? http : https;
  var req = proto.request(options, function(response) {
    var body = '';

    response.on('data', function(chunk) {
      body += chunk.toString('utf-8');
    });

    response.on('end', function() {
      var successStatusCodes = [200, 201, 202];
      var result = utils.parseJSON(body);
      if (successStatusCodes.includes(response.statusCode)) {
        success(result);
      } else {
        failure({
          message: 'Failed http request: ' + response.statusMessage + ' (' + response.statusCode + ')',
          result: result
        });
      }
    });

    response.on('error', function(error) {
      failure(error);
    });
  });

  req.write(data || '');
  req.end();
}

module.exports.getItem = getItem;
module.exports.getItems = getItems;
module.exports.getItemsRecursively = getItemsRecursively;
module.exports.postItemCommand = postItemCommand;
