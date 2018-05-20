/**
 * Copyright (c) 2014-2018 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var AWS = require('aws-sdk');
// Set region to lambda function one (default: us-east-1)
AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});
// Initialize DynamoDB document client connection
var docClient = new AWS.DynamoDB.DocumentClient();
// Define settings table name
var tableName = process.env.ALEXA_SKILL_SETTINGS_TABLE || 'AlexaOpenHABSkillSettings';

/**
 * Delete user settings from DynamoDB Table
 * @param  {String}   userId
 * @param  {Function} success
 * @param  {Function} failure
 */
function deleteUserSettings(userId, success, failure) {
  var parameters = {
    TableName: tableName,
    Key: {'userId': userId},
  };
  docClient.delete(parameters, function(error, result) {
    error ? failure(error) : success(result);
  });
}

/**
 * Get user settings from DynamoDB Table
 * @param  {String}   userId
 * @param  {String}   attributes
 * @param  {Function} success
 * @param  {Function} failure
 */
function getUserSettings(userId, attributes, success, failure) {
  var parameters = {
    TableName: tableName,
    Key: {'userId': userId},
    ProjectionExpression: attributes
  };
  docClient.get(parameters, function(error, result) {
    error ? failure(error) : success(result);
  });
}

/**
 * Save user settings to DynamoDB Table
 * @param  {String}   userId
 * @param  {Object}   settings
 * @param  {Function} success
 * @param  {Function} failure
 */
function saveUserSettings(userId, settings, success, failure) {
  var item = Object.assign({userId: userId}, settings);
  var parameters = {
    TableName: tableName,
    Item: item
  };
  docClient.put(parameters, function(error, result) {
    error ? failure(error) : success(result);
  });
}

/**
 * Update user settings in DynamoDB Table
 * @param  {String}   userId
 * @param  {Object}   settings
 * @param  {Function} success
 * @param  {Function} failure
 */
function updateUserSettings(userId, settings, success, failure) {
  var updateExpression = Object.keys(settings).reduce(function(expression, attribute, index) {
    return `${expression}${index == 0 ? 'set' : ','} ${attribute} = :${attribute}`;
  }, '');
  var expressionAttributeValues = Object.keys(settings).reduce(function(values, attribute) {
    return Object.assign(values, {[`:${attribute}`]: settings[attribute]});
  }, {});
  var parameters = {
    TableName: tableName,
    Key: {'userId': userId},
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  };
  docClient.update(parameters, function(error, result) {
    error ? failure(error) : success(result);
  });
}

module.exports.deleteUserSettings = deleteUserSettings;
module.exports.getUserSettings = getUserSettings;
module.exports.saveUserSettings = saveUserSettings;
module.exports.updateUserSettings = updateUserSettings;
