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

/**
 * Amazon Echo Smart Home Skill API implementation for openHAB (v3)
 */
const camelcase = require('camelcase');
const Directives = require('./directives');

/**
 * Main entry point for all requests
 * @param {Object}   directive
 * @param {Function} callback
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
