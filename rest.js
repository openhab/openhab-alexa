/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var https = require('https');
var http = require('http');
var config = require('./config');
var logger = require('./log');

var http = config.proto && config.proto == 'http' ? http : https;

/**
 * Returns all items
 */
function getItems(token, success, failure) {
    return getItemOrItems(token, null, null, success, failure);
}

/**
 * Returns all items as just Name and State
 */
function getItemStates(token, success, failure) {
    return getItemOrItems(token, null, 'fields=name,state', success, failure);
}

/**
 * Returns all items
 */
function getItemsRecursively(token, success, failure) {
    return getItemOrItems(token, null, 'recursive=true', success, failure);
}

/**
 * Returns a single item
 */
function getItem(token, itemName, success, failure) {
    return getItemOrItems(token, itemName, null, success, failure);
}

/**
 * Returns a single item
 */
function getItemOrItems(token, itemName, paramters, success, failure) {
    var options = httpItemOptions(token, itemName,'GET', paramters);
    http.get(options, function (response) {
            var body = '';

            response.on('data', function (data) {
                body += data.toString('utf-8');
            });

            response.on('end', function () {
                if (response.statusCode != 200) {
                    failure({
                        message: 'Error response ' + response.statusCode
                    });
                    logger.info('getItem failed for path: ' + options.path +
                    ' code: ' + response.statusCode + ' body: ' + body);
                    return;
                }
                var resp = JSON.parse(body);
                success(resp);
            });

            response.on('error', function (e) {
                failure(e);
            });
        })
        .end();
}

/**
 * POST a command to a item
 **/
function postItemCommand(token, itemName, value, success, failure) {
    var data = value.toString();
    var options = httpItemOptions(token, itemName, 'POST', null, data.length);
    var req = http.request(options, function (response) {
        var body = '';
        if (response.statusCode == 200 || response.statusCode == 201) {
            success(response);
        } else {
            failure({
                message: 'Error response ' + response.statusCode
            });
        }
        response.on('error', function (e) {
            failure(e);
        });
    });

    req.write(data);
    req.end();
}

/**
 * Returns a http option object sutiable for item commands
 */
function httpItemOptions(token, itemname, method, paramters, length) {
    var options = {
        hostname: config.host,
        port: config.port,
        path: config.path + (itemname || '') + (paramters ? '?' + paramters : ''),
        method: method || 'GET',
        headers: {}
    };

    if (config.userpass) {
        options.auth = config.userpass;
    } else {
        options.headers['Authorization'] = 'Bearer ' + token;
    }

    if (method === 'POST' || method === 'PUT') {
        options.headers['Content-Type'] = 'text/plain';
        options.headers['Content-Length'] = length;
    }
    return options;
}

module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.getItemsRecursively = getItemsRecursively;
module.exports.getItemStates = getItemStates;
module.exports.postItemCommand = postItemCommand;
