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

const { v5: uuidv5 } = require('uuid');
const { stripPunctuation } = require('@root/utils');
const { ItemType } = require('@openhab/constants');
const AlexaCapabilities = require('./capabilities');
const AlexaDisplayCategory = require('./category');
const { Capability, Property } = require('./constants');
const AlexaDevice = require('./device');
const AlexaMetadata = require('./metadata');
const { EndpointUnreachableError } = require('./errors');

/**
 * Defines alexa endpoint class
 */
class AlexaEndpoint {
  /**
   * Defines alexa discovery capabilities limit per endpoint
   *  https://developer.amazon.com/docs/device-apis/alexa-discovery.html#limits
   * @type {Number}
   */
  static #CAPABILITIES_LIMIT = 100;

  /**
   * Constructor
   * @param {String} id
   */
  constructor(id) {
    this.id = id;
    this._capabilities = [];
    this._categories = [];
  }

  /**
   * Returns capabilities
   * @return {Array}
   */
  get capabilities() {
    return this._capabilities
      .filter((capability) => capability.isValid)
      .filter((capability, _, array) => capability.hasRequiredLinkedCapabilities(array));
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  get displayCategories() {
    return this._categories.length > 0 ? this._categories : this.defaultDisplayCategories;
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return this.capabilities
      .map((capability) => capability.defaultDisplayCategories)
      .flat()
      .filter(
        (category, index, array) => AlexaDisplayCategory.isSupported(category) && array.indexOf(category) === index
      );
  }

  /**
   * Returns discoverable capabilities
   * @return {Array}
   */
  get discoverableCapabilities() {
    return this.capabilities
      .filter((capability) => capability.isDiscoverable)
      .slice(0, AlexaEndpoint.#CAPABILITIES_LIMIT);
  }

  /**
   * Returns if is group endpoint
   * @return {Boolean}
   */
  get isGroup() {
    return !!this.group;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.discoverableCapabilities.length > 0;
  }

  /**
   * Returns if supports endpoint health
   * @return {Boolean}
   */
  get supportsEndpointHealth() {
    return this.capabilities.some((capability) => capability.supportsEndpointHealth);
  }

  /**
   * Returns capability for a given query object
   * @param  {String} interface
   * @param  {String} instance
   * @return {Object}
   */
  getCapability({ interface: intf, instance }) {
    return this.capabilities.find((capability) => capability.interface === intf && capability.instance === instance);
  }

  /**
   * Returns capability property for a given query object
   * @param  {String} interface
   * @param  {String} instance
   * @param  {String} property
   * @param  {String} component
   * @param  {String} tag
   * @return {Object}
   */
  getCapabilityProperty({ interface: intf, instance, property: name, component, tag }) {
    for (const capability of this.capabilities) {
      if (capability.interface === intf && capability.instance === instance) {
        return capability.getProperty({ name, component, tag });
      }
    }
  }

  /**
   * Returns capability property map for a given query object
   * @param  {String} interface
   * @param  {String} instance
   * @return {Object}
   */
  getCapabilityPropertyMap({ interface: intf, instance }) {
    for (const capability of this.capabilities) {
      if (capability.interface === intf && capability.instance === instance) {
        return capability.getPropertyMap();
      }
    }
  }

  /**
   * Returns capability component properties for a given query object
   * @param  {String} interface
   * @param  {String} instance
   * @param  {String} property
   * @param  {String} tag
   * @return {Object}
   */
  getCapabilityComponentProperties({ interface: intf, instance, property: name, tag }) {
    for (const capability of this.capabilities) {
      if (capability.interface === intf && capability.instance === instance) {
        return capability.properties.filter(
          (property) => property.name === name && property.tag === tag && property.component
        );
      }
    }
  }

  /**
   * Returns capabilities property map
   * @return {Object}
   */
  getCapabilitiesPropertyMap() {
    return Object.fromEntries(
      this.capabilities.map((capability) => Object.entries(capability.getPropertyMap())).flat()
    );
  }

  /**
   * Returns capabilities retrievable item names
   * @return {Array}
   */
  getCapabilitiesRetrievableItemNames() {
    return this.capabilities
      .map((capability) => capability.getContextProperties())
      .flat()
      .filter((property) => property.item && property.isReportable && property.isRetrievable)
      .map((property) => property.item.name)
      .filter((name, index, array) => array.indexOf(name) === index);
  }

  /**
   * Returns context properties
   * @param  {Object} openhab
   * @return {Promise}
   */
  async getContextProperties(openhab) {
    const contextProperties = [];
    // Get capabilities property map
    const properties = this.getCapabilitiesPropertyMap();
    // Get latest retrievable item states from server
    const items = await Promise.all(
      this.getCapabilitiesRetrievableItemNames().map((name) =>
        openhab.getItemState(name).then((state) => ({ name, state }))
      )
    );

    // Throw endpoint unreachable error if every retrievable item states not defined
    if (items.length > 0 && items.every((item) => typeof item.state === 'undefined')) {
      throw new EndpointUnreachableError('Unable to get context properties response.');
    }

    // Iterate over endpoint capabilities
    for (const capability of this.capabilities) {
      for (const property of capability.getReportableProperties(items, properties)) {
        // Define property item state using latest state if retrievable, otherwise last posted command if available
        const item = property.item && {
          ...(property.isRetrievable
            ? items.find((item) => item.name === property.item.name)
            : { state: openhab.getLastPostedCommand(property.item.name) })
        };
        // Define context property namespace and instance based on capability interface and instance
        const { interface: namespace, instance } = capability;
        // Define context property name based on property report name if defined, fallback to property name
        const name = property.reportName || property.name;
        // Define context property value based on property alexa state,
        //  providing item state if property item defined, otherwise list of retrievable items (e.g. EndpointHealth)
        let value = property.getState(item ? item.state : items);

        // Skip property if context property value not defined
        if (typeof value === 'undefined') {
          continue;
        }

        // Update context property value if property component defined
        if (property.component) {
          value = [{ name: property.component.toUpperCase(), value }];
          // Concatenate value to previously added context property, if found, and go to next property
          const contextProperty = contextProperties.find(
            (property) => property.namespace === namespace && property.instance === instance && property.name === name
          );
          if (contextProperty) {
            contextProperty.value = [...contextProperty.value, ...value];
            continue;
          }
        }

        // Add context property
        contextProperties.push({
          namespace,
          ...(instance && { instance }),
          name,
          value,
          timeOfSample: new Date().toISOString(),
          uncertaintyInMilliseconds: 0
        });
      }
    }

    return contextProperties;
  }

  /**
   * Returns capability alexa interfaces
   * @return {Array}
   */
  getCapabilityInterfaces() {
    return this.discoverableCapabilities.map((capability) => capability.getAlexaInterface());
  }

  /**
   * Returns cookie
   * @return {Object}
   */
  getCookie() {
    const capabilities = this.capabilities.map((capability) => capability.toJSON()).flat();
    return { ...(capabilities.length > 0 && { capabilities: JSON.stringify(capabilities) }) };
  }

  /**
   * Returns relationships
   * @return {Object}
   */
  getRelationships() {
    return this.discoverableCapabilities.reduce(
      (relationships, capability) => ({ ...relationships, ...capability.getRelationship() }),
      {}
    );
  }

  /**
   * Adds unique supported display categories
   * @param {Array} categories
   */
  addDisplayCategories(categories) {
    for (const category of categories) {
      if (AlexaDisplayCategory.isSupported(category) && !this._categories.includes(category)) {
        this._categories.push(category);
      }
    }
  }

  /**
   * Adds capability based on given config object
   * @param {String} name
   * @param {String} instance
   * @param {String} property
   * @param {String} component
   * @param {String} tag
   * @param {Object} parameters
   * @param {Object} item
   * @param {Object} metadata
   * @param {Object} settings
   * @param {Array}  groups
   */
  addCapability({ name, instance, property, component, tag, parameters, item, metadata, settings, groups }) {
    // Define instance name for multi-instance capability using capability/item names, if not defined already
    if (!instance && item) {
      instance = name.replace(/Controller$/, '') + ':' + item.name;
    }
    // Find existing capability index based on capability and instance names
    const index = this._capabilities.findIndex(
      (capability) => capability.name === name && (!capability.isMultiInstance || capability.instance === instance)
    );
    // Use existing capability if found, otherwise build a new one
    const capability = index !== -1 ? this._capabilities[index] : AlexaCapabilities.build(name, instance);

    // Add/update capability if defined
    if (typeof capability !== 'undefined') {
      // Add property to capability
      capability.addProperty({ name: property, component, tag, parameters, item, metadata, settings, groups });
      // Add capability to list if new instance
      if (index === -1) {
        this._capabilities.push(capability);
      }
    }
  }

  /**
   * Adds alexa capability if endpoint valid
   */
  addAlexaCapability() {
    if (this.isValid) {
      this.addCapability({ name: Capability.ALEXA });
    }
  }

  /**
   * Adds endpoint health capability if supported
   */
  addEndpointHealthCapability() {
    if (this.supportsEndpointHealth) {
      this.addCapability({ name: Capability.ENDPOINT_HEALTH, property: Property.CONNECTIVITY });
    }
  }

  /**
   * Adds capabilities to endpoint based on given item
   * @param {Object} item
   * @param {Object} settings
   */
  addItemCapabilities(item, settings) {
    const categories = [];
    const group = this.group || {};
    // Initialize alexa metadata object with group metadata config if defined
    const metadata = new AlexaMetadata(item, settings, group.config);

    // Iterate over metadata values
    for (const value of metadata.values) {
      // Determine device based on metadata value
      const device = AlexaDevice.getDevice(value, group.deviceType);

      // Add capabilities based on device if defined, otherwise fallback to capability pattern matching
      if (device) {
        // Skip metadata value if device not valid
        if (!device.isValid) continue;
        // Store device display categories
        categories.push(...device.displayCategories);
        // Add device capabilities
        for (const capability of device.getCapabilities(item, metadata, settings)) {
          this.addCapability({ ...capability, item, metadata, settings });
        }
      } else {
        const capability = AlexaMetadata.parseCapability(value);
        // Store metadata parameter-based display category
        categories.push(metadata.config.category);
        // Add parsed capability if defined
        if (capability) {
          this.addCapability({ ...capability, item, metadata, settings });
        }
      }
    }

    // Add stored display categories if not group endpoint
    if (!this.isGroup) {
      this.addDisplayCategories(categories);
    }
  }

  /**
   * Loads capabilities array
   * @param {Object} capabilities
   */
  loadCapabilities(capabilities) {
    for (const capability of capabilities) {
      this.addCapability(capability);
    }
  }

  /**
   * Loads property map object for backward compatibility
   * @param  {Object} propertyMap
   */
  loadPropertyMap(propertyMap) {
    // Iterate over property map
    for (const [interfaceName, properties] of Object.entries(propertyMap)) {
      for (const [propertyName, { parameters, item }] of Object.entries(properties)) {
        const capability = AlexaMetadata.parseCapability(`${interfaceName}.${propertyName}`);
        // Add parsed capability
        this.addCapability({ ...capability, parameters, item });
      }
    }
    // Add endpoint health capability
    this.addEndpointHealthCapability();
  }

  /**
   * Sets endpoint details
   * @param {Object} item
   * @param {Object} settings
   */
  setDetails(item, settings) {
    // Initialize alexa metadata object
    const metadata = new AlexaMetadata(item, settings);

    // Set endpoint type using item (group)type
    this.type = item.groupType || item.type;
    // Set endpoint model using endpoint type & id
    this.model = `${this.type} ${this.id}`;
    // Set endpoint description using metadata config description parameter, if defined, otherwise endpoint model
    this.description = metadata.config.description || this.model;
    // Set endpoint friendly name using metadata config name parameter, if defined, otherwise item label
    this.friendlyName = stripPunctuation(metadata.config.name || item.label || '');
    // Set endpoint software version using runtime version setting
    this.softwareVersion = settings.runtime.version;
    // Set endpoint custom identifier creating uuid using endpoint id and runtime uuid setting if defined
    this.customIdentifier = settings.runtime.uuid && uuidv5(this.id, settings.runtime.uuid);
  }

  /**
   * Sets group endpoint based on given item
   * @param {Object} item
   * @param {Object} settings
   * @param {Array}  groups
   */
  setGroup(item, settings, groups) {
    // Initialize alexa metadata object
    const metadata = new AlexaMetadata(item, settings);

    // Iterate over metadata values
    for (const value of metadata.values) {
      const group = AlexaMetadata.parseGroupEndpoint(value);
      // Determine device type based on parsed group endpoint name (e.g. Endpoint.Thermostat), or metadata value
      const deviceType = AlexaDevice.getDeviceType(group ? group.name : value);

      // Set endpoint group properties if device type defined
      if (deviceType) {
        this.group = { deviceType, config: deviceType.getConfig(metadata) };
        // Add device type group capabilities
        for (const capability of deviceType.groupCapabilities) {
          this.addCapability({ ...capability, item, metadata, settings, groups });
        }
        // Add device type display categories
        this.addDisplayCategories(deviceType.displayCategories);
        break;
      }
    }
  }

  /**
   * Returns serialized endpoint object
   * @return {Object}
   */
  toJSON() {
    const cookie = this.getCookie();
    const relationships = this.getRelationships();

    return {
      endpointId: this.id,
      manufacturerName: 'openHAB',
      description: `${this.description} via openHAB`,
      friendlyName: this.friendlyName,
      displayCategories: this.displayCategories,
      additionalAttributes: {
        manufacturer: 'openHAB',
        model: this.model,
        softwareVersion: this.softwareVersion,
        customIdentifier: this.customIdentifier
      },
      ...(Object.keys(cookie).length > 0 && { cookie }),
      ...(Object.keys(relationships).length > 0 && { relationships }),
      capabilities: this.getCapabilityInterfaces()
    };
  }

  /**
   * Returns new endpoint object based on directive endpoint object
   * @param  {String} endpointId
   * @param  {Object} cookie
   * @return {Object}
   */
  static fromDirective({ endpointId, cookie = {} }) {
    // Initialize alexa endpoint object using directive endpoint id
    const endpoint = new AlexaEndpoint(endpointId);

    // Load directive endpoint cookie capabilities if defined,
    //  otherwise load property map for backward compatibility if present
    if (cookie.capabilities) {
      endpoint.loadCapabilities(JSON.parse(cookie.capabilities));
    } else if (cookie.propertyMap) {
      endpoint.loadPropertyMap(JSON.parse(cookie.propertyMap));
    }

    return endpoint;
  }

  /**
   * Returns new endpoint object based on item object
   * @param  {Object} item
   * @param  {Object} settings
   * @param  {Array}  groups
   * @return {Object}
   */
  static fromItem(item, settings, groups) {
    // Initialize alexa endpoint object using item name as id
    const endpoint = new AlexaEndpoint(item.name);
    // Set endpoint details
    endpoint.setDetails(item, settings);

    // Set group endpoint if is group type, otherwise add item capabilities to endpoint
    if (endpoint.type === ItemType.GROUP) {
      endpoint.setGroup(item, settings, groups);
    } else {
      endpoint.addItemCapabilities(item, settings);
    }

    return endpoint;
  }
}

module.exports = AlexaEndpoint;
