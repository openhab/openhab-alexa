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

const { deflateSync, inflateSync } = require('zlib');

/**
 * Defines utility functions
 * @type {Object}
 */
module.exports = {
  /**
   * Returns clamp value
   * @param  {Number} value
   * @param  {Number} minValue
   * @param  {Number} maxValue
   * @return {Number}
   */
  clamp: (value, minValue, maxValue) => {
    return Math.min(Math.max(value, minValue), maxValue);
  },

  /**
   * Returns compressed json string
   * @param  {Object} object
   * @return {String}
   */
  compressJSON: (object) => {
    return deflateSync(Buffer.from(JSON.stringify(object))).toString('base64');
  },

  /**
   * Returns decompressed json object
   * @param  {String} string
   * @return {Object}
   */
  decompressJSON: (string) => {
    try {
      return JSON.parse(inflateSync(Buffer.from(string, 'base64')).toString());
    } catch {
      return JSON.parse(string);
    }
  },

  /**
   * Returns decamelize formatted string
   * @param  {String} string
   * @param  {String} separator
   * @return {String}
   */
  decamelize: (string, separator = '_') => {
    return string
      .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
      .toLowerCase();
  },

  /**
   * Returns if given string is a mac address
   * @param  {String}  string
   * @return {Boolean}
   */
  isMACAddress: (string) => {
    return /^([0-9a-fA-F]{2}(-|:)){7}[0-9a-fA-F]{2}$|^([0-9a-fA-F]{2}(-|:)){5}[0-9a-fA-F]{2}$/.test(string);
  },

  /**
   * Returns parsed url object
   * @param  {String} url
   * @param  {String} base
   * @return {Object}
   */
  parseUrl: (url, base) => {
    try {
      const parsedUrl = new URL(url);
      return base ? new URL(parsedUrl.pathname, base) : parsedUrl;
    } catch {
      return undefined;
    }
  },

  /**
   * Returns formatted string without punctuation characters
   * @param  {String} string
   * @return {String}
   */
  stripPunctuation: (string) => {
    return string
      .replace(/[!"#$%&()*+,-./:;<=>?@[\\\]^_`{|}~°]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
};
