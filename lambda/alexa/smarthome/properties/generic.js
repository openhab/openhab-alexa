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

const { stripPunctuation } = require('@root/utils');
const AlexaAssetCatalog = require('../catalog');
const { Property } = require('../constants');
const { Parameter, ParameterType } = require('../metadata');
const { AlexaCapabilityResources } = require('../resources');
const { AlexaActionSemantic, AlexaStateSemantic } = require('../semantics');
const DecoupleState = require('./decoupleState');

/**
 * Defines generic property class
 * @extends DecoupleState
 */
class Generic extends DecoupleState {
  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.CAPABILITY_NAMES]: ParameterType.LIST,
      [Parameter.LANGUAGE]: ParameterType.STRING,
      [Parameter.NON_CONTROLLABLE]: ParameterType.BOOLEAN,
      [Parameter.ACTION_MAPPINGS]: ParameterType.MAP,
      [Parameter.STATE_MAPPINGS]: ParameterType.MAP
    };
  }

  /**
   * Returns alias parameters for backward compatibility
   * @return {Object}
   */
  get aliasParameters() {
    return {
      friendlyNames: Parameter.CAPABILITY_NAMES
    };
  }

  /**
   * Returns if is non-controllable
   * @return {Boolean}
   */
  get isNonControllable() {
    return this.parameters[Parameter.NON_CONTROLLABLE] === true;
  }

  /**
   * Returns default capability names based on property name
   * @return {Array}
   */
  get defaultCapabilityNames() {
    switch (this.name) {
      case Property.MODE:
        return [AlexaAssetCatalog.SETTING_MODE];
      case Property.RANGE_VALUE:
        return [AlexaAssetCatalog.SETTING_RANGE_VALUE];
      case Property.TOGGLE_STATE:
        return [AlexaAssetCatalog.SETTING_TOGGLE_STATE];
      default:
        return [];
    }
  }

  /**
   * Returns supported action semantics
   * @return {Array}
   */
  get supportedActionSemantics() {
    return Object.values(AlexaActionSemantic);
  }

  /**
   * Returns supported state semantics
   * @return {Array}
   */
  get supportedStateSemantics() {
    return Object.values(AlexaStateSemantic);
  }

  /**
   * Returns friendly names based on parameter
   * @return {Array}
   */
  get friendlyNames() {
    return this.parameters[Parameter.CAPABILITY_NAMES];
  }

  /**
   * Returns language based on parameter
   * @return {String}
   */
  get language() {
    return this.parameters[Parameter.LANGUAGE] || AlexaCapabilityResources.DEFAULT_LANGUAGE;
  }

  /**
   * Returns action mappings based on parameter
   * @return {Object}
   */
  get actionMappings() {
    return this.parameters[Parameter.ACTION_MAPPINGS] || {};
  }

  /**
   * Returns state mappings based on parameter
   * @return {Object}
   */
  get stateMappings() {
    return this.parameters[Parameter.STATE_MAPPINGS] || {};
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.friendlyNames.length > 0 && (this.isRetrievable || !this.isNonControllable);
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

    // Define capability names as follow:
    //  1) using parameter values if defined
    //  2) using item label & metadata synonyms if part of group endpoint
    //  3) using default capability names based on property name (e.g. mode => @Setting.Mode)
    const capabilityNames = parameters[Parameter.CAPABILITY_NAMES]
      ? parameters[Parameter.CAPABILITY_NAMES]
      : metadata.isPartOfGroupEndpoint
      ? [].concat(item.label, item.metadata && item.metadata.synonyms && item.metadata.synonyms.value.split(','))
      : this.defaultCapabilityNames;
    // Update capability names parameter removing duplicate and invalid labels
    parameters[Parameter.CAPABILITY_NAMES] = capabilityNames
      .filter((label) => typeof label === 'string')
      .map((label) => (label.startsWith(AlexaCapabilityResources.ASSET_LABEL_PREFIX) ? label : stripPunctuation(label)))
      .filter((label, index, array) => AlexaCapabilityResources.isValidLabel(label) && array.indexOf(label) === index);

    const language = parameters[Parameter.LANGUAGE] || '';
    // Update language parameter using regional settings if no supported locales match
    parameters[Parameter.LANGUAGE] =
      AlexaCapabilityResources.getSupportedLocales(language).length > 0
        ? language.toLowerCase()
        : settings.regional.language;

    const nonControllable = parameters[Parameter.NON_CONTROLLABLE];
    // Upate non-controllable parameter using item state description read only property if not defined
    parameters[Parameter.NON_CONTROLLABLE] =
      typeof nonControllable === 'boolean' ? nonControllable : item.stateDescription && item.stateDescription.readOnly;

    const actionMappings = parameters[Parameter.ACTION_MAPPINGS] || {};
    // Update action mappings parameter removing unsupported action semantics
    parameters[Parameter.ACTION_MAPPINGS] = Object.entries(actionMappings)
      .filter(([action]) => this.supportedActionSemantics.includes(action))
      .reduce((actions, [action, mapping]) => ({ ...actions, [action]: mapping }), undefined);

    const stateMappings = parameters[Parameter.STATE_MAPPINGS] || {};
    // Update state mappings parameter removing unsupported state semantics
    parameters[Parameter.STATE_MAPPINGS] = Object.entries(stateMappings)
      .filter(([state]) => this.supportedStateSemantics.includes(state))
      .reduce((states, [state, mapping]) => ({ ...states, [state]: mapping }), undefined);
  }
}

module.exports = Generic;
