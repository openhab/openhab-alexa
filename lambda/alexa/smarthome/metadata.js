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

import { ParameterType } from './constants.js';

/**
 * Defines alexa metadata class
 */
export default class AlexaMetadata {
  /**
   * Defines alexa capability namespace format pattern
   * @type {RegExp}
   */
  static #CAPABILITY_PATTERN =
    /^(?:Alexa\.)?(?<name>\w+)(?::(?<instance>\w+))?\.(?<property>\w+)(?::(?<component>\w+))?(?:#(?<tag>\w+))?$/;

  /**
   * Defines alexa group endpoint namespace format pattern
   * @type {RegExp}
   */
  static #GROUP_ENDPOINT_PATTERN = /^(?:Alexa\.)?Endpoint\.(?<name>\w+)$/;

  /**
   * Constructor
   * @param {Object} item
   * @param {Object} settings
   * @param {Object} groupConfig
   */
  constructor(item, settings, groupConfig) {
    this._metadata = {
      // Use item alexa metadata value if defined, fallback to item tags for OH 2.x only
      values: item.metadata?.alexa
        ? AlexaMetadata.convertValue(item.metadata.alexa.value, ParameterType.LIST)
        : item.tags && settings.runtime.version === '2'
        ? item.tags
        : [],
      // Use item alexa metadata config if defined
      config: item.metadata?.alexa?.config || {},
      // Add group config if defined
      groupConfig
    };
  }

  /**
   * Returns metadata values
   * @return {Array}
   */
  get values() {
    return this._metadata.values;
  }

  /**
   * Returns metadata config
   * @return {Object}
   */
  get config() {
    return { ...this._metadata.groupConfig, ...this._metadata.config };
  }

  /**
   * Returns if part of group endpoint
   * @return {Boolean}
   */
  get isPartOfGroupEndpoint() {
    return !!this._metadata.groupConfig;
  }

  /**
   * Returns a config parameter
   * @param  {String} parameter
   * @param  {String} type
   * @return {*}
   */
  getConfigParameter(parameter, type) {
    return AlexaMetadata.convertValue(this.config[parameter], type);
  }

  /**
   * Sets a config parameter
   * @param  {String} parameter
   * @param  {*}      value
   */
  setConfigParameter(parameter, value) {
    this._metadata.config[parameter] = value;
  }

  /**
   * Returns converted value for a given parameter type
   * @param  {*}      value
   * @param  {String} type
   * @return {*}
   */
  static convertValue(value, type) {
    const current = Array.isArray(value) ? 'array' : typeof value;
    const conversion = current + '->' + type;

    switch (conversion) {
      case `number->${ParameterType.BOOLEAN}`:
      case `string->${ParameterType.BOOLEAN}`:
        return ['0', 'false', 'no'].includes(value.toString().toLowerCase()) === false;
      case `number->${ParameterType.FLOAT}`:
      case `string->${ParameterType.FLOAT}`:
        return parseFloat(value);
      case `number->${ParameterType.INTEGER}`:
      case `string->${ParameterType.INTEGER}`:
        return parseInt(value);
      case `array->${ParameterType.LIST}`: // ['foo', 'bar', 'baz', 'foo', ''] => ['foo', 'bar', 'baz']
      case `string->${ParameterType.LIST}`: // 'foo,bar,baz,foo,' => ['foo', 'bar', 'baz']
        return (current === 'string' ? value.split(',') : value)
          .map((value) => value.trim())
          .filter((value, index, array) => value && array.indexOf(value) === index);
      case `array->${ParameterType.MAP}`: // ['foo=1', 'bar=2', 'baz', 'foo=3', ''] => { foo: '1', bar: '2', baz: undefined }
      case `string->${ParameterType.MAP}`: // 'foo=1,bar=2,baz,foo=3,' => { foo: '1', bar: '2', baz: undefined }
        return (current === 'string' ? value.split(',') : value)
          .map((value) => value.split('=', 2).map((value) => value.trim()))
          .filter(([key], index, array) => key && array.map(([key]) => key).indexOf(key) === index)
          .reduce((map, [key, value]) => ({ ...map, [key]: value }), {});
      case `object->${ParameterType.RANGE}`: // { minimum: minRange, maximum: maxRange } => [minRange, maxRange]
      case `string->${ParameterType.RANGE}`: // 'minRange:maxRange:precision' => [minRange, maxRange, precision]
        return (current === 'string' ? value.split(':', 3) : Object.values(value)).map((value) => parseFloat(value));
      case `number->${ParameterType.STRING}`:
        return value.toString();
      case `boolean->${ParameterType.BOOLEAN}`:
      case `object->${ParameterType.MAP}`:
      case `array->${ParameterType.RANGE}`:
      case `string->${ParameterType.STRING}`:
      case 'number->undefined':
      case 'string->undefined':
        return value;
    }
  }

  /**
   * Returns parsed capability object
   * @param  {String} value
   * @return {Object}
   */
  static parseCapability(value) {
    const match = value.match(this.#CAPABILITY_PATTERN);
    return match?.groups;
  }

  /**
   * Returns parsed group endpoint object
   * @param  {String} value
   * @return {Object}
   */
  static parseGroupEndpoint(value) {
    const match = value.match(this.#GROUP_ENDPOINT_PATTERN);
    return match?.groups;
  }
}
