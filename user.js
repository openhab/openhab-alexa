/*
* Copyright (c) 2014-2018 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/

var log = require('./log.js');
var rest = require('./rest.js');
var storage = require('./storage.js');
var utils = require('./utils.js');

/**
 * Get user access token
 * @param  {String}   granteeToken
 * @param  {Function} success
 * @param  {Function} failure
 */
function getAccessToken(granteeToken, success, failure) {
  // Get userId from profile information
  requestUserProfile(granteeToken).then(function(profile) {
    var userId = profile.user_id;
    var attributes = "accessToken, expireTime, refreshToken";
    // Get user settings from database
    storage.getUserSettings(userId, attributes, function(result) {
      var settings = result.Item || {};

      if (settings.accessToken) {
        // Return stored access token if not expired
        if (settings.expireTime > utils.timeInSeconds()) {
          success(settings.accessToken);
          return;
        }
        // Refresh token if available and return new access token
        if (settings.refreshToken) {
          refreshAccessToken(userId, settings.refreshToken, success, failure);
          return;
        }
      }
      // Throw error if reaching this point
      throw 'No valid access token found for userId: ' + userId;
    }, function(error) {
      throw error;
    });
  }).catch(function(error) {
    log.debug('getAccessToken failed with error: ' + JSON.stringify(error));
    failure(error);
  });
}

/**
 * Grant authorization request
 * @param  {String}   grantCode
 * @param  {String}   granteeToken
 * @param  {Function} success
 * @param  {Function} failure
 */
function grantAuthorization(grantCode, granteeToken, success, failure) {
  // Request access token, using grant code, and user profile information simultaneously
  Promise.all([requestAccessAuthCode(grantCode), requestUserProfile(granteeToken)]).then(function(results) {
    var tokens = results[0];
    var profile = results[1];
    log.debug('grantAuthorization request results: ' + JSON.stringify({tokens: tokens, profile: profile}));
    var userId = profile.user_id;
    var settings = {
      'accessToken': tokens.access_token,
      'tokenType': tokens.token_type,
      'expireTime': utils.timeInSeconds() + parseInt(tokens.expires_in),
      'refreshToken': tokens.refresh_token
    };
    // Store user settings to database, and return userId if successful
    storage.saveUserSettings(userId, settings, function() {
      success(userId);
    }, function(error) {
      throw error;
    });
  }).catch(function(error) {
    log.debug('grantAuthorization failed with error: ' + JSON.stringify(error));
    failure(error);
  });
}

/**
 * Handle user access errors based on payload error code returned by Alexa event gateway
 * @param  {String} granteeToken
 * @param  {Object} error
 */
function handleAccessError(granteeToken, error) {
  if (error.result.payload) {
    // Get userId from profile information
    requestUserProfile(granteeToken).then(function(profile) {
      var userId = profile.user_id;
      // Take action depending on payload error code
      switch(error.result.payload.code) {
        // User authorization revoked
        case 'SKILL_DISABLED_EXCEPTION':
          storage.deleteUserSettings(userId, function() {
            log.debug('handleAccessError deleted revoked user access for ' + userId);
          }, function(error) {
            throw error;
          });
          break;
      }
    }).catch(function(error) {
      log.debug('handleAccessError failed with error: ' + JSON.stringify(error));
    });
  }
}

/**
 * Refresh access token
 * @param  {String}   userId
 * @param  {String}   refreshToken
 * @param  {Function} success
 * @param  {Function} failure
 */
function refreshAccessToken(userId, refreshToken, success, failure) {
  requestAccessRefreshToken(refreshToken).then(function(tokens) {
    log.debug('refreshAuthorization tokens result: ' + JSON.stringify(tokens));
    var settings = {
      'accessToken': tokens.access_token,
      'tokenType': tokens.token_type,
      'expireTime': utils.timeInSeconds() + parseInt(tokens.expires_in),
      'refreshToken': tokens.refresh_token
    };
    // Update user settings to database, and return new accessToken if successful
    storage.updateUserSettings(userId, settings, function() {
      success(settings.accessToken);
    }, function(error) {
      throw error;
    });
  }).catch(function(error) {
    log.debug('refreshAccessToken failed with error: ' + JSON.stringify(error));
    failure(error);
  });
}

/**
 * Request access token with authorization code
 * @param  {String}  code
 * @return {Promise}
 */
 function requestAccessAuthCode(code) {
  var request = {grant_type: 'authorization_code', code: code};
  return new Promise(function(resolve, reject) {
    rest.getAuthTokens(request, resolve, reject);
  });
}

/**
 * Request access token with refresh token
 * @param  {String}  refreshToken
 * @return {Promise}
 */
function requestAccessRefreshToken(refreshToken) {
  var request = {grant_type: 'refresh_token', refresh_token: refreshToken};
  return new Promise(function(resolve, reject) {
    rest.getAuthTokens(request, resolve, reject);
  });
}

/**
 * Request user profile information
 * @param  {String}  token
 * @return {Promise}
 */
 function requestUserProfile(token) {
  return new Promise(function(resolve, reject) {
    rest.getUserProfile(token, resolve, reject);
  });
}

module.exports.getAccessToken = getAccessToken;
module.exports.grantAuthorization = grantAuthorization;
module.exports.handleAccessError = handleAccessError;
