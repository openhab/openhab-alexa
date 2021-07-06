/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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

const { ItemType } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines keystroke property class
 * @extends AlexaProperty
 */
class Keystroke extends AlexaProperty {
  /**
   * Defines up keystroke
   * @type {String}
   */
  static UP = 'UP';

  /**
   * Defines down keystroke
   * @type {String}
   */
  static DOWN = 'DOWN';

  /**
   * Defines left keystroke
   * @type {String}
   */
  static LEFT = 'LEFT';

  /**
   * Defines right keystroke
   * @type {String}
   */
  static RIGHT = 'RIGHT';

  /**
   * Defines select keystroke
   * @type {String}
   */
  static SELECT = 'SELECT';

  /**
   * Defines page up keystroke
   * @type {String}
   */
  static PAGE_UP = 'PAGE_UP';

  /**
   * Defines page down keystroke
   * @type {String}
   */
  static PAGE_DOWN = 'PAGE_DOWN';

  /**
   * Defines page left keystroke
   * @type {String}
   */
  static PAGE_LEFT = 'PAGE_LEFT';

  /**
   * Defines page right keystroke
   * @type {String}
   */
  static PAGE_RIGHT = 'PAGE_RIGHT';

  /**
   * Defines info keystroke
   * @type {String}
   */
  static INFO = 'INFO';

  /**
   * Defines more keystroke
   * @type {String}
   */
  static MORE = 'MORE';

  /**
   * Defines back keystroke
   * @type {String}
   */
  static BACK = 'BACK';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SUPPORTED_KEYS]: ParameterType.LIST
    };
  }

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-keypadcontroller.html#keystroke-property
   * @return {Array}
   */
  get supportedValues() {
    return [
      Keystroke.UP,
      Keystroke.DOWN,
      Keystroke.LEFT,
      Keystroke.RIGHT,
      Keystroke.SELECT,
      Keystroke.PAGE_UP,
      Keystroke.PAGE_DOWN,
      Keystroke.PAGE_LEFT,
      Keystroke.PAGE_RIGHT,
      Keystroke.INFO,
      Keystroke.MORE,
      Keystroke.BACK
    ];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedKeys.length > 0;
  }

  /**
   * Returns default value map
   * @return {Object}
   */
  get defaultValueMap() {
    return {
      [Keystroke.UP]: 'up',
      [Keystroke.DOWN]: 'down',
      [Keystroke.LEFT]: 'left',
      [Keystroke.RIGHT]: 'right',
      [Keystroke.SELECT]: 'select',
      [Keystroke.PAGE_UP]: 'pageup',
      [Keystroke.PAGE_DOWN]: 'pagedown',
      [Keystroke.PAGE_LEFT]: 'pageleft',
      [Keystroke.PAGE_RIGHT]: 'pageright',
      [Keystroke.INFO]: 'info',
      [Keystroke.MORE]: 'more',
      [Keystroke.BACK]: 'back'
    };
  }

  /**
   * Returns default keys based on value map
   * @return {Array}
   */
  get defaultKeys() {
    return Object.keys(this.valueMap);
  }

  /**
   * Returns supported keys based on parameter
   * @return {Array}
   */
  get supportedKeys() {
    return this.parameters[Parameter.SUPPORTED_KEYS] || this.defaultKeys;
  }

  /**
   * Updates parameters
   * @param {Object} item
   * @param {Object} metadata
   * @param {Object} settings
   */
  updateParameters(item, metadata, settings) {
    const parameters = this.parameters;
    // Update parameters from parent method
    super.updateParameters(item, metadata, settings);

    const keys = parameters[Parameter.SUPPORTED_KEYS];
    // Update supported keys parameter removing unsupported values if defined
    parameters[Parameter.SUPPORTED_KEYS] = keys && keys.filter((value) => this.supportedValues.includes(value));
  }
}

module.exports = Keystroke;
