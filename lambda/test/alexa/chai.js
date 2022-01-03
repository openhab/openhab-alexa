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

const Ajv = require('ajv');

// Initialize the alexa smart home message json schema draft v4 validator
const validate = new Ajv({ schemaId: 'auto', unknownFormats: ['double', 'int32'] })
  .addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
  .compile(require('./schemas/alexa_smart_home_message_schema.json'));

/**
 * Returns capability interface formatted name
 * @param  {Object} capability
 * @return {String}
 */
function getCapabilityInterfaceName(capability) {
  const instance = capability.instance ? capability.instance.split(':').pop() : '';
  return capability.interface + (instance ? `:${instance}` : '');
}

/**
 * Returns list of capabilities configuration
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesConfiguration(capabilities) {
  const result = {};

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);
    const resourcesParams = {
      presets: { key: 'presetResources', value: 'rangeValue' },
      supportedModes: { key: 'modeResources', value: 'value' }
    };
    const config = {};

    for (const [parameter, resources] of Object.entries(capability.configuration || {})) {
      const { key, value } = resourcesParams[parameter] || {};
      // Streamline resources parameters, otherwise copy all resources directly
      if (typeof key !== 'undefined' && typeof resources[0] === 'object') {
        config[parameter] = Object.fromEntries(
          resources
            .filter((resource) => resource[key])
            .map((resource) => [
              resource[value],
              {
                friendlyNames: resource[key].friendlyNames.map((label) =>
                  [label['@type'], ...Object.values(label.value)].join(':')
                )
              }
            ])
        );
      } else {
        config[parameter] = resources;
      }
    }
    result[interfaceName] = config;
  }

  return result;
}

/**
 * Returns list of capabilities namespaces
 * @param  {Array} capabilities
 * @return {Array}
 */
function getCapabilitiesNamespaces(capabilities) {
  const result = [];

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);

    if (capability.properties && capability.properties.supported) {
      for (const property of capability.properties.supported) {
        result.push(interfaceName + '.' + property.name);
      }
    } else {
      result.push(interfaceName);
    }
  }

  return result;
}

/**
 * Returns list of capabilities parameters
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesParameters(capabilities) {
  const result = {};

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);
    const standardParams = ['capabilityResources', 'configuration', 'properties'];

    for (const [parameter, value] of Object.entries(capability)) {
      if (!standardParams.includes(parameter)) {
        result[interfaceName + '.' + parameter] = value;
      }
    }
  }

  return result;
}

/**
 * Returns list of capabilities property flags
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesPropertyFlags(capabilities) {
  const result = {};

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);

    if (capability.properties) {
      result[interfaceName] = Object.fromEntries(
        Object.entries(capability.properties).filter(([, value]) => typeof value === 'boolean')
      );
    }
  }

  return result;
}

/**
 * Returns list of capabilities resources
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesResources(capabilities) {
  const result = {};

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);

    if (capability.capabilityResources) {
      result[interfaceName] = {
        friendlyNames: capability.capabilityResources.friendlyNames.map((label) =>
          [label['@type'], ...Object.values(label.value)].join(':')
        )
      };
    }
  }

  return result;
}

/**
 * Returns list of capabilities semantics
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesSemantics(capabilities) {
  const result = {};

  for (const capability of capabilities) {
    const interfaceName = getCapabilityInterfaceName(capability);
    const semantics = {};

    for (const mapping of Object.values(capability.semantics || {}).flat()) {
      const { '@type': type, ...semantic } = mapping;
      semantics[type] = [...(semantics[type] || []), semantic];
    }
    result[interfaceName] = semantics;
  }

  return result;
}

/**
 * Adds smarthome related chai assertions
 * @param  {Object} chai
 */
module.exports = function (chai) {
  const { Assertion } = chai;

  /**
   * Asserts discovery endpoints
   * @param  {Object} expected
   */
  Assertion.addMethod('endpoints', function (expected) {
    new Assertion(this._obj).is.an('array').and.has.lengthOf(Object.keys(expected).length);

    for (const endpoint of this._obj) {
      new Assertion(expected[endpoint.endpointId]).is.not.undefined;

      for (const [key, value] of Object.entries(expected[endpoint.endpointId])) {
        switch (key) {
          case 'capabilities':
            new Assertion(getCapabilitiesNamespaces(endpoint.capabilities)).has.same.members(value);
            break;
          case 'configuration':
            new Assertion(getCapabilitiesConfiguration(endpoint.capabilities)).deep.includes(value);
            break;
          case 'displayCategories':
            new Assertion(endpoint.displayCategories).has.same.members(value);
            break;
          case 'parameters':
            new Assertion(getCapabilitiesParameters(endpoint.capabilities)).deep.includes(value);
            break;
          case 'propertyFlags':
            new Assertion(getCapabilitiesPropertyFlags(endpoint.capabilities)).deep.includes(value);
            break;
          case 'resources':
            new Assertion(getCapabilitiesResources(endpoint.capabilities)).deep.includes(value);
            break;
          case 'semantics':
            new Assertion(getCapabilitiesSemantics(endpoint.capabilities)).deep.includes(value);
            break;
          case 'cookie':
            new Assertion(JSON.parse(endpoint.cookie.capabilities)).include.deep.members(value);
            break;
          default:
            if (typeof endpoint[key] === 'object') {
              new Assertion(endpoint[key]).deep.includes(value);
            } else {
              new Assertion(endpoint[key]).equals(value);
            }
        }
      }
    }
  });

  /**
   * Asserts json schema validator
   */
  Assertion.addProperty('validSchema', function () {
    new Assertion(this._obj).is.an('object');

    // Validate schema using official reference
    //  https://github.com/alexa/alexa-smarthome/wiki/Validation-Schemas
    this.assert(
      validate(this._obj),
      `Schema Validation Failed\nData: ${JSON.stringify(this._obj)}\n\nErrors: ${JSON.stringify(validate.errors)}`
    );
  });
};
