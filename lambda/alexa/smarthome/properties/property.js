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

const { convertValue, Parameter, ParameterType } = require('../metadata');

/**
 * Defines alexa property base class
 */
class AlexaProperty {
  /**
   * Defines default alias parameters for backward compatibility
   * @type {Object}
   */
  static #DEFAULT_ALIAS_PARAMETERS = {
    itemStateRetrievable: Parameter.RETRIEVABLE
  };

  /**
   * Defines default supported parameters and their type
   * @type {Object}
   */
  static #DEFAULT_SUPPORTED_PARAMETERS = {
    [Parameter.RETRIEVABLE]: ParameterType.BOOLEAN
  };

  /**
   * Constructor
   * @param {String} name
   * @param {String} component
   * @param {String} tag
   * @param {Object} parameters
   * @param {Object} item
   */
  constructor(name, component, tag, parameters, item) {
    this.name = name;
    if (this.requiredComponents.length > 0) this.component = component;
    if (this.supportedTags.includes(tag)) this.tag = tag;
    this.parameters = parameters || {};
    this.item = item && { name: item.name, type: item.groupType || item.type };
  }

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {};
  }

  /**
   * Returns alias parameters for backward compatibility
   * @return {Object}
   */
  get aliasParameters() {
    return {};
  }

  /**
   * Returns supported alexa values
   * @return {Array}
   */
  get supportedValues() {
    return [];
  }

  /**
   * Returns supported tags
   * @return {Array}
   */
  get supportedTags() {
    return [];
  }

  /**
   * Returns required sub-property components
   * @return {Array}
   */
  get requiredComponents() {
    return [];
  }

  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return this.isProactivelyReported || this.isRetrievable;
  }

  /**
   * Returns if is proactively reported
   * @return {Boolean}
   */
  get isProactivelyReported() {
    return false;
  }

  /**
   * Returns if is retrievable
   * @return {Boolean}
   */
  get isRetrievable() {
    return this.parameters[Parameter.RETRIEVABLE] !== false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return true;
  }

  /**
   * Returns if has required component
   * @return {Boolean}
   */
  get hasRequiredComponent() {
    return !this.requiredComponents.length || this.requiredComponents.includes(this.component);
  }

  /**
   * Returns if has supported item type
   * @return {Boolean}
   */
  get hasSupportedItemType() {
    return !this.item || this.supportedItemTypes.includes(this.item.type);
  }

  /**
   * Returns if has supported values mapped
   * @return {Boolean}
   */
  get hasSupportedValuesMapped() {
    return this.supportedValues.every((value) => typeof this.valueMap[value] !== 'undefined');
  }

  /**
   * Returns default value map
   * @return {Object}
   */
  get defaultValueMap() {
    return {};
  }

  /**
   * Returns user value map based on supported values defined in property parameters
   * @return {Object}
   */
  get userValueMap() {
    return Object.fromEntries(
      this.supportedValues
        .filter((value) => typeof this.parameters[value] !== 'undefined')
        .map((value) => [value, this.parameters[value]])
    );
  }

  /**
   * Returns value map from one of the maps in the order below:
   *    1) user map (provided in property parameters)
   *      e.g. [LOCKED="1:3",UNLOCKED="2:4",JAMMED=11] (lockState)
   *    2) default map (based on item type or a custom property parameter)
   *      e.g. [binding="nest"] (thermostatMode)
   *
   * @return {Object}
   */
  get valueMap() {
    const userValueMap = this.userValueMap;
    return Object.keys(userValueMap).length > 0 ? userValueMap : this.defaultValueMap;
  }

  /**
   * Returns if has required linked properties
   * @param  {Array}  properties
   * @return {Boolean}
   */
  hasRequiredLinkedProperties(properties) {
    return this.requiredLinkedProperties.every(({ name, component, tag }) =>
      properties.find((property) => property.name === name && property.component === component && property.tag === tag)
    );
  }

  /**
   * Returns openhab command using value map
   *  { <alexaValue>: '<ohValue1>:<ohValue2>:...', ... }
   *
   * @param  {String} value
   * @return {String}
   */
  getCommand(value) {
    const valueMap = this.valueMap;
    return typeof valueMap[value] === 'string' ? valueMap[value].split(':')[0] : valueMap[value];
  }

  /**
   * Returns alexa state using value map
   *  { <alexaValue>: '<ohValue1>:<ohValue2>:...', ... }
   *
   * @param  {String} value
   * @return {String}
   */
  getState(value) {
    const valueMap = this.valueMap;
    return Object.keys(valueMap).find((key) => valueMap[key].toString().split(':').includes(String(value)));
  }

  /**
   * Returns parameter alias for a given parameter
   * @param  {String} parameter
   * @return {String}
   */
  getParameterAlias(parameter) {
    return this.aliasParameters[parameter] || AlexaProperty.#DEFAULT_ALIAS_PARAMETERS[parameter];
  }

  /**
   * Returns parameter type for a given parameter
   * @param  {String} parameter
   * @return {String}
   */
  getParameterType(parameter) {
    return this.supportedParameters[parameter] || AlexaProperty.#DEFAULT_SUPPORTED_PARAMETERS[parameter];
  }

  /**
   * Normalizes parameters value types
   */
  normalizeParameters() {
    const parameters = this.parameters;

    // Iterate over property parameters
    for (const [parameter, value] of Object.entries(parameters)) {
      // Determine parameter name using alias if defined, fallback to given parameter name
      const name = this.getParameterAlias(parameter) || parameter;
      // Determine property parameter value type
      const type = this.getParameterType(name);
      // Update property parameter with converted value
      parameters[name] = convertValue(value, type);
    }
  }

  /**
   * Updates parameters
   * @param {Object} item
   * @param {Object} metadata
   */
  updateParameters(item, metadata) {
    const parameters = this.parameters;

    // Iterate over metadata config parameters
    for (const parameter of Object.keys(metadata.config)) {
      // Determine parameter name using alias if defined, fallback to given parameter name
      const name = this.getParameterAlias(parameter) || parameter;
      // Determine parameter type
      const type = this.getParameterType(name);
      // Add converted metadata parameter value if has supported type or is supported value name
      if (typeof type !== 'undefined' || this.supportedValues.includes(name)) {
        parameters[name] = metadata.getConfigParameter(parameter, type);
      }
    }

    // Use autoupdate metadata value if available, to determine retrievable parameter if not already defined
    if (typeof parameters[Parameter.RETRIEVABLE] !== 'boolean' && item.metadata && item.metadata.autoupdate) {
      parameters[Parameter.RETRIEVABLE] = convertValue(item.metadata.autoupdate.value, ParameterType.BOOLEAN);
    }
  }

  /**
   * Returns serialized property object
   * @return {Object}
   */
  toJSON() {
    return {
      property: this.name,
      ...(this.component && { component: this.component }),
      ...(this.tag && { tag: this.tag }),
      parameters: this.parameters,
      ...(this.item && { item: this.item })
    };
  }

  /**
   * Returns new property object for a given config object
   * @param  {String} name
   * @param  {String} component
   * @param  {String} tag
   * @param  {Object} parameters
   * @param  {Object} item
   * @param  {Object} metadata
   * @param  {Object} settings
   * @param  {Array}  groups
   * @return {Object}
   */
  static build({ name, component, tag, parameters, item, metadata, settings, groups }) {
    const property = new this(name, component, tag, parameters, item);

    // Return if property has not required component or supported item type
    if (!property.hasRequiredComponent || !property.hasSupportedItemType) {
      return;
    }

    // Update property parameters based on metadata if provided, otherwise normalize existing parameters
    if (metadata) {
      property.updateParameters(item, metadata, settings, groups);
    } else {
      property.normalizeParameters();
    }

    return property;
  }
}

module.exports = AlexaProperty;
