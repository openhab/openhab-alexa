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

const { ItemType, ItemValue } = require('@openhab/constants');
const AlexaAssetCatalog = require('../catalog');
const { Parameter, ParameterType } = require('../metadata');
const { AlexaModeResources } = require('../resources');
const Generic = require('./generic');

/**
 * Defines mode property class
 * @extends Generic
 */
class Mode extends Generic {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [
      ItemType.CONTACT,
      ItemType.DIMMER,
      ItemType.NUMBER,
      ItemType.ROLLERSHUTTER,
      ItemType.STRING,
      ItemType.SWITCH
    ];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      ...super.supportedParameters,
      [Parameter.SUPPORTED_COMMANDS]: ParameterType.MAP,
      [Parameter.SUPPORTED_MODES]: ParameterType.MAP,
      [Parameter.ORDERED]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns supported commands based on item type
   * @return {Array}
   */
  get supportedCommands() {
    switch (this.item.type) {
      case ItemType.DIMMER:
        return [ItemValue.ON, ItemValue.OFF, ItemValue.INCREASE, ItemValue.DECREASE];
      case ItemType.ROLLERSHUTTER:
        return [ItemValue.UP, ItemValue.DOWN, ItemValue.MOVE, ItemValue.STOP];
      default:
        return [];
    }
  }

  /**
   * Returns supported values based on supported modes
   * @return {Array}
   */
  get supportedValues() {
    return Object.keys(this.supportedModes);
  }

  /**
   * Returns if is non-controllable
   * @return {Boolean}
   */
  get isNonControllable() {
    return super.isNonControllable && !this.supportsCommandsOnly && this.item.type !== ItemType.CONTACT;
  }

  /**
   * Returns if is retrievable
   * @return {Boolean}
   */
  get isRetrievable() {
    return super.isRetrievable && !this.supportsCommandsOnly;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return super.isValid && Object.keys(this.supportedModes).length >= 2;
  }

  /**
   * Returns if supports command only based on supported commands
   * @return {Boolean}
   */
  get supportsCommandsOnly() {
    return this.supportedCommands.length > 0;
  }

  /**
   * Returns default command label mappings
   * @return {Object}
   */
  get defautCommandLabels() {
    return {
      [ItemValue.ON]: AlexaAssetCatalog.VALUE_ON,
      [ItemValue.OFF]: AlexaAssetCatalog.VALUE_OFF,
      [ItemValue.INCREASE]: AlexaAssetCatalog.VALUE_INCREASE,
      [ItemValue.DECREASE]: AlexaAssetCatalog.VALUE_DECREASE,
      [ItemValue.UP]: AlexaAssetCatalog.VALUE_UP,
      [ItemValue.DOWN]: AlexaAssetCatalog.VALUE_DOWN,
      [ItemValue.MOVE]: AlexaAssetCatalog.VALUE_MOVE,
      [ItemValue.STOP]: AlexaAssetCatalog.VALUE_STOP
    };
  }

  /**
   * Returns default value map on supported states
   * @return {Object}
   */
  get defaultValueMap() {
    return Object.fromEntries(this.supportedValues.map((value) => [value, value]));
  }

  /**
   * Returns value map merging default with user value map
   * @return {Object}
   */
  get valueMap() {
    return { ...this.defaultValueMap, ...this.userValueMap };
  }

  /**
   * Returns supported modes based on parameter
   * @return {Object}
   */
  get supportedModes() {
    return this.parameters[Parameter.SUPPORTED_MODES] || {};
  }

  /**
   * Returns ordered based on parameter
   * @return {Boolean}
   */
  get ordered() {
    return this.parameters[Parameter.ORDERED] === true;
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

    // Define supported modes as follow:
    //  1) using supported commands parameter if property supports commands only,
    //    removing invalid values and setting default command labels if not defined
    //  2) using supported modes parameter values if defined
    //  3) using item state description options if available
    //  4) empty object
    const modes = this.supportsCommandsOnly
      ? Object.entries(parameters[Parameter.SUPPORTED_COMMANDS] || {})
          .filter(([command]) => this.supportedCommands.includes(command))
          .map(([command, labels]) => [command, labels || this.defautCommandLabels[command]])
          .reduce((modes, [command, labels]) => ({ ...modes, [command]: labels }), {})
      : parameters[Parameter.SUPPORTED_MODES]
      ? parameters[Parameter.SUPPORTED_MODES]
      : item.stateDescription && item.stateDescription.options
      ? Object.fromEntries(item.stateDescription.options.map((option) => [option.value, option.label]))
      : {};

    // Update supported modes parameter, removing duplicate labels and entries with no valid labels,
    //  and updating labels shortened format (e.g. Normal=:Cottons,Whites => Normal=Normal:Cottons,Whites=Whites)
    parameters[Parameter.SUPPORTED_MODES] = Object.entries(modes)
      .map(([mode, labels = '']) => [
        mode,
        Array.isArray(labels)
          ? labels
          : `${/^(:|$)/.test(labels) ? mode : ''}${labels}`.split(':').map((label) => label.trim())
      ])
      .map(([mode, labels], index, array) => [
        mode,
        labels.filter(
          (label) =>
            AlexaModeResources.isValidLabel(label) && array.findIndex(([, labels]) => labels.includes(label)) === index
        )
      ])
      .filter(([, labels]) => labels.length > 0)
      .reduce((modes, [mode, labels]) => ({ ...modes, [mode]: labels }), undefined);

    // Delete supported commands parameter
    delete parameters[Parameter.SUPPORTED_COMMANDS];
  }
}

module.exports = Mode;
