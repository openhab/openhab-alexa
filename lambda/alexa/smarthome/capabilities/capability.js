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

const { DecoupleState } = require('../properties');

/**
 * Defines alexa base capability class
 */
class AlexaCapability {
  /**
   * Constructor
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
    this._properties = [];
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return undefined;
  }

  /**
   * Returns version
   * @return {String}
   */
  get version() {
    return '3';
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {};
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [];
  }

  /**
   * Returns required linked capabilities
   * @return {Array}
   */
  get requiredLinkedCapabilities() {
    return [];
  }

  /**
   * Returns if is discoverable
   * @return {Boolean}
   */
  get isDiscoverable() {
    return true;
  }

  /**
   * Returns properties
   * @return {Array}
   */
  get properties() {
    return this._properties
      .filter((property) => property.isValid)
      .filter((property, _, array) => property.hasRequiredLinkedProperties(array));
  }

  /**
   * Returns if has configured properties
   * @return {Boolean}
   */
  get hasConfiguredProperties() {
    return this.properties.length > 0;
  }

  /**
   * Returns if has supported properties
   * @return {Boolean}
   */
  get hasSupportedProperties() {
    return Object.keys(this.supportedProperties).length > 0;
  }

  /**
   * Returns if has proactively reported properties
   * @return {Boolean}
   */
  get hasProactivelyReportedProperties() {
    return this.properties.some((property) => property.isReportable && property.isProactivelyReported);
  }

  /**
   * Returns if has retrievable properties
   * @return {Boolean}
   */
  get hasRetrievableProperties() {
    return this.properties.some((property) => property.isReportable && property.isRetrievable);
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return !this.hasSupportedProperties || this.hasConfiguredProperties;
  }

  /**
   * Returns if supports endpoint health
   * @return {Boolean}
   */
  get supportsEndpointHealth() {
    return this.hasRetrievableProperties;
  }

  /**
   * Returns if has required linked capabilities
   * @param  {Array}  capabilities
   * @return {Boolean}
   */
  hasRequiredLinkedCapabilities(capabilities) {
    return this.requiredLinkedCapabilities.every(({ name, instance }) =>
      capabilities.find((capability) => capability.name === name && capability.instance === instance)
    );
  }

  /**
   * Returns capability interface
   *  https://developer.amazon.com/docs/device-apis/alexa-discovery-objects.html#capability-object
   * @return {Object}
   */
  getCapabilityInterface() {
    // Define capability properties
    const properties = this.getCapabilityProperties();
    // Define capability resources
    const capabilityResources = this.getCapabilityResources();
    // Define capability configuration
    const configuration = this.getCapabilityConfiguration();
    // Define capability semantics
    const semantics = this.getCapabilitySemantics();

    return {
      type: 'AlexaInterface',
      interface: this.interface,
      ...(this.instance && { instance: this.instance }),
      version: this.version,
      ...(properties.supported.length > 0 && { properties }),
      ...(Object.keys(capabilityResources).length > 0 && { capabilityResources }),
      ...(Object.keys(configuration).length > 0 && { configuration }),
      ...(Object.keys(semantics).length > 0 && { semantics })
    };
  }

  /**
   * Returns capability properties
   * @return {Object}
   */
  getCapabilityProperties() {
    // Determine capability supported properties based on reportable and unique named properties
    const supported = this.properties
      .filter(
        (property, index, array) =>
          property.isReportable && array.findIndex(({ name }) => name === property.name) === index
      )
      .map((property) => ({ name: property.name }));

    return {
      supported,
      proactivelyReported: this.hasProactivelyReportedProperties,
      retrievable: this.hasRetrievableProperties
    };
  }

  /**
   * Returns capability resources
   * @return {Object}
   */
  getCapabilityResources() {
    return {};
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    return {};
  }

  /**
   * Returns capability semantics
   * @return {Object}
   */
  getCapabilitySemantics() {
    return {};
  }

  /**
   * Returns relationship
   * @return {Object}
   */
  getRelationship() {
    return {};
  }

  /**
   * Returns context properties
   * @return {Array}
   */
  getContextProperties() {
    return this.properties.filter(
      // Filter decouple state tagged property if defined, otherwise fallback to standard property
      (property) => (this.getProperty({ ...property, tag: DecoupleState.TAG_NAME }) || property) === property
    );
  }

  /**
   * Returns reportable properties
   * @return {Array}
   */
  getReportableProperties() {
    return this.getContextProperties().filter((property) => property.isReportable);
  }

  /**
   * Adds property for a given config object
   * @param {Object}  config    [name, component, tag, parameters, item, metadata, settings, groups]
   */
  addProperty(config) {
    const { name } = config;
    // Add property if is supported
    if (typeof this.supportedProperties[name] === 'function') {
      const property = this.supportedProperties[name].build(config);
      // Add property to list if defined and not already added
      if (property && !this.hasProperty(property)) {
        this._properties.push(property);
      }
    }
  }

  /**
   * Returns property for a given config object
   * @param  {String}  name
   * @param  {String}  component
   * @param  {String}  tag
   * @return {Object}
   */
  getProperty({ name, component, tag }) {
    return this.properties.find(
      (property) => property.name === name && property.component === component && property.tag === tag
    );
  }

  /**
   * Returns property map
   * @return {Object}
   */
  getPropertyMap() {
    return Object.fromEntries(
      this.properties.map((property) => [
        property.name + (property.component ? `:${property.component}` : '') + (property.tag ? `#${property.tag}` : ''),
        property
      ])
    );
  }

  /**
   * Returns if property defined for a given config object
   * @param  {Object}  config   [name, component, tag]
   * @return {Boolean}
   */
  hasProperty(config) {
    return !!this.getProperty(config);
  }

  /**
   * Returns serialized capability object
   * @return {Array}
   */
  toJSON() {
    return this.properties.map((property) => ({
      name: this.name,
      ...(this.instance && { instance: this.instance }),
      ...property.toJSON()
    }));
  }
}

module.exports = AlexaCapability;
