/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * Amazon Echo Smart Home Skill API implementation for openHAB (v3)
 */
const camelcase = require('camelcase');
const Directives = require('./alexa/v3');

/**
 * Main entry point for all requests
 * @param {Object}   directive
 * @param {Object}   callback
 */
exports.handleRequest = function (directive, callback) {
  // Convert directive namespace to pascalcase format
  //  e.g. Alexa.BrightnessController => AlexaBrightnessController
  const namespace = camelcase(directive.header.namespace, {pascalCase: true});
  // Determine directive class name based on namespace if found, fallback to unsupported
  const classname = typeof Directives[namespace] === 'function' ? namespace : 'AlexaUnsupported';
  // Initialize request object
  const request = new Directives[classname](directive, callback);
  // Excecute request
  request.execute();
}
