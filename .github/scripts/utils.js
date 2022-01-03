/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Defines utility functions
 * @type {Object}
 */
module.exports = {
  /**
   * Returns command output
   * @param  {String}  command
   * @param  {Boolean} json
   * @return {String}
   */
  getCommandOuput: (command, { json = false } = {}) => {
    try {
      const output = execSync(command, { stdio: 'pipe' }).toString().trim();
      return json ? JSON.parse(output) : output;
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      throw new Error(`Failed to parse command output: ${command}`);
    }
  },

  /**
   * Loads schema from file
   * @param  {String}  file
   * @param  {Boolean} required
   * @return {Object}
   */
  loadSchema: (file, { required = true } = {}) => {
    try {
      return required || fs.existsSync(file) ? require(file) : {};
    } catch {
      throw new Error(`Failed to load schema: ${file}`);
    }
  },

  /**
   * Saves schema to file
   * @param  {Object} schema
   * @param  {String} file
   */
  saveSchema: (schema, file) => {
    try {
      // Create the file's directory recursively in case it doesn't exist
      fs.mkdirSync(path.dirname(file), { recursive: true });
      // Write json formatted schema to file
      fs.writeFileSync(file, JSON.stringify(schema, null, 2));
    } catch {
      throw new Error(`Failed to save schema: ${file}`);
    }
  },

  /**
   * Sleeps for a given number of milliseconds
   * @param  {Number} msec
   * @return {Promise}
   */
  sleep: (msec) => new Promise((resolve) => setTimeout(resolve, msec))
};
