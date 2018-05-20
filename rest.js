/**
 * Copyright (c) 2014-2018 by the respective copyright holders.
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
var EventSource = require('eventsource');

var log = require('./log.js');
var utils = require('./utils.js');
var config = getConfig();

/**
 * Get config
 */
function getConfig() {
  // Default configuration
  var defaults = {
    alexa : {
      api: {
        host: process.env.ALEXA_API_HOST || 'api.amazon.com',
        port: process.env.ALEXA_API_PORT || 443,
        path: {
          auth: process.env.ALEXA_API_PATH_AUTH || '/auth/o2/token',
          user: process.env.ALEXA_API_PATH_USER || '/user/profile'
        }
      },
      gateway: {
        host: process.env.ALEXA_GATEWAY_HOST || 'api.amazonalexa.com',
        port: process.env.ALEXA_GATEWAY_PORT || 443,
        path: process.env.ALEXA_GATEWAY_PATH || '/v3/events'
      },
      skill: {
        clientId: process.env.ALEXA_SKILL_CLIENT_ID || null,
        clientSecret: process.env.ALEXA_SKILL_CLIENT_SECRET || null
      },
    },
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
 * Get authorization oauth2 tokens from Amazon API
 *    requests:
 *      {grant_type: 'authorization_code', code: <code>}
 *      {grant_type: 'refresh_token', refresh_token: <token>}
 *
 * @param  {Object}   request
 * @param  {Function} success
 * @param  {Function} failure
 */
function getAuthTokens(request, success, failure) {
  var parameters = Object.assign(request, {
    client_id: config.alexa.skill.clientId,
    client_secret: config.alexa.skill.clientSecret
  });
  var data = qs.stringify(parameters);
  var options = {
    hostname: config.alexa.api.host,
    port: config.alexa.api.port,
    path: config.alexa.api.path.auth,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  // Parameters object should have 4 keys with valid value
  if (Object.keys(parameters).reduce((count, key) => count = parameters[key] ? count + 1 : count, 0) == 4) {
    httpRequest(options, data, 'https', success, failure);
  } else {
    failure({
      message: 'Missing authorization parameters: ' + JSON.stringify(parameters)
    });
  }
}

/**
 * Get user profile information from Amazon API
 * @param  {String}   token
 * @param  {Function} success
 * @param  {Function} failure
 */
function getUserProfile(token, success, failure) {
  var options = {
    hostname: config.alexa.api.host,
    port: config.alexa.api.port,
    path: config.alexa.api.path.user + '?access_token=' + token,
    method: 'GET'
  };

  httpRequest(options, null, 'https', success, failure);
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
  * Poll item state events from openHAB rest server,
  *   looking for specific updates and return new states if found wihtin timeout period
  *
  * @param  {String}   token
  * @param  {Array}    itemNames
  * @param  {Integer}  timeout
  * @param  {Function} success
  * @param  {Function} failure
 **/
function pollItemStateEvents(token, itemNames, timeout, success, failure) {
  var url = `${config.openhab.proto}://${config.openhab.host}${config.openhab.path}/events`;
  var options = {headers: {'Authorization': ohAuthorizationHeader(token)}};
  var es = new EventSource(url, options);
  var result = {};
  var timer;

  function terminateConnection() {
    // Stop Timer
    clearTimeout(timer);
    // CLose event source connection
    es.close();
  };

  es.addEventListener('message', function(e) {
    var data = JSON.parse(e.data);

    if (data.type === 'ItemStateEvent') {
      var name = data.topic.match(/^smarthome\/items\/(\w+)\/state$/)[1];
      var index = itemNames.indexOf(name);

      // Remove matching item from list
      if (index > -1) {
        log.debug('pollItemStateEvents matching item state event message: ' + JSON.stringify(data));
        itemNames.splice(index, 1);
        result[name] = JSON.parse(data.payload).value;
      }
      // Return result when item names list becomes empty
      if (itemNames.length == 0) {
        log.debug('pollItemStateEvents done with result: ' + JSON.stringify(result));
        terminateConnection();
        success(result);
      }
    }
  }, false);

  es.addEventListener('open', function(e) {
    // Close event source connection when reaching timeout
    timer = setTimeout(function() {
      terminateConnection();
      failure({
        message: 'timed out'
      });
    }, timeout * 1000);
  }, false);

  es.addEventListener('error', function(e) {
    terminateConnection();
    failure(e);
  }, false);
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
 * POST a message to ALexa event gateway
 * @param  {String}   token
 * @param  {String}   message
 * @param  {Function} success
 * @param  {Function} failure
 **/
function postMessageEventGateway(token, message, success, failure) {
  var data = JSON.stringify(message);
  var options = {
    hostname: config.alexa.gateway.host,
    port: config.alexa.gateway.port,
    path: config.alexa.gateway.path,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    httpRequest(options, data, 'https', success, failure);
  } else {
    failure({
      message: 'No token provided'
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

module.exports.getAuthTokens = getAuthTokens;
module.exports.getUserProfile = getUserProfile;
module.exports.getItem = getItem;
module.exports.getItems = getItems;
module.exports.getItemsRecursively = getItemsRecursively;
module.exports.pollItemStateEvents = pollItemStateEvents;
module.exports.postItemCommand = postItemCommand;
module.exports.postMessageEventGateway = postMessageEventGateway;
