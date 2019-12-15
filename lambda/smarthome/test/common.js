/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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

const { assert } = require('chai');
const ajv = require('ajv')();
const validate = initializeSchemaValidator();

/**
 * Generates directive request based of default template
 * @param  {Object} request
 * @return {Object}
 */
function generateDirectiveRequest (request) {
  const template = {
    'header': {
      'namespace': null,
      'name': null,
      'payloadVersion': '3',
      'messageId': 'message-id'
    },
    'endpoint': {
      'endpointId': null,
      'cookie': {},
      'scope': {
        'type': 'BearerToken',
        'token': 'access-token-from-skill'
      }
    },
    'payload': {}
  };
  const directive = {
    'header': Object.assign(template.header, request.header),
    'endpoint': Object.assign(template.endpoint, request.endpoint),
    'payload': Object.assign(template.payload, request.payload)
  };
  // add header correlation token for request other than discovery
  if (directive.header.namespace !== 'Alexa.Discovery') {
    directive.header.correlationToken = 'correlation-token';
  }
  // update directive if payloadVersion set to 2
  if (directive.header.payloadVersion === '2') {
    directive.payload.accessToken = directive.endpoint.scope.token;
    delete directive.header.correlationToken;
    delete directive.endpoint.scope;
  }
  // remove endpoint if no id defined
  if (directive.endpoint.endpointId === null) {
    // move endpoint scope to payload if defined
    if (directive.endpoint.scope) {
      directive.payload.scope = directive.endpoint.scope;
    }
    delete directive.endpoint;
  }
  return directive;
}

/**
 * Returns list of capabilities configuration
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesConfiguration(capabilities) {
  return capabilities.reduce((result, capability) => {
    const interfaceName = [capability.interface].concat(capability.instance || []).join('.');
    const resourcesParams = {
      'presets': {key: 'presetResources', value: 'rangeValue'},
      'supportedModes': {key: 'modeResources', value: 'value'}
    };

    if (capability.configuration) {
      result[interfaceName] = Object.keys(capability.configuration).reduce((config, parameter) => {
        // Streamline resources parameters, otherwise copy parameter directly
        if (resourcesParams[parameter] && typeof capability.configuration[parameter][0] === 'object') {
          config[parameter] = capability.configuration[parameter].reduce((map, resource) =>
            Object.assign(map, resource[resourcesParams[parameter]['key']] && {
              [resource[resourcesParams[parameter]['value']]]: {
                friendlyNames: resource[resourcesParams[parameter]['key']].friendlyNames.reduce((names, label) =>
                  names.concat([label['@type']].concat(Object.values(label.value)).join(':')), [])
                }
            }), {});
        } else {
          config[parameter] = capability.configuration[parameter];
        }
        return config;
      }, {});
    }
    return result;
  }, {});
}

/**
 * Returns list of capabilities namespaces
 * @param  {Array} capabilities
 * @return {Array}
 */
function getCapabilitiesNamespaces (capabilities) {
  return capabilities.reduce((result, capability) => {
    const interfaceName = [capability.interface].concat(capability.instance || []).join('.');

    if (capability.properties && capability.properties.supported) {
      capability.properties.supported.forEach((property) => {
        result.push(interfaceName + '.' + property.name);
      });
    } else {
      result.push(interfaceName);
    }
    return result;
  }, []);
}

/**
 * Returns list of capabilities parameters
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesParameters(capabilities) {
  return capabilities.reduce((result, capability) => {
    const interfaceName = [capability.interface].concat(capability.instance || []).join('.');
    const standardParams = ['capabilityResources', 'configuration', 'properties'];

    Object.keys(capability).forEach((parameter) => {
      if (!standardParams.includes(parameter)) {
        result[interfaceName + '.' + parameter] = capability[parameter];
      }
    });
    return result;
  }, {});
}

/**
 * Returns list of capabilities resources
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesResources(capabilities) {
  return capabilities.reduce((result, capability) => {
    const interfaceName = [capability.interface].concat(capability.instance || []).join('.');

    if (capability.capabilityResources) {
      result[interfaceName] = {
        friendlyNames: capability.capabilityResources.friendlyNames.reduce((names, label) =>
          names.concat([label['@type']].concat(Object.values(label.value)).join(':')), [])
      }
    }
    return result;
  }, {});
}

/**
 * Returns list of capabilities semantics
 * @param  {Array}  capabilities
 * @return {Object}
 */
function getCapabilitiesSemantics(capabilities) {
  return capabilities.reduce((result, capability) => {
    const interfaceName = [capability.interface].concat(capability.instance || []).join('.');

    if (capability.semantics) {
      result[interfaceName] = Object.keys(capability.semantics).reduce((semantics, parameter) =>
        Object.assign(semantics, capability.semantics[parameter].reduce((map, semantic) =>
          Object.assign(map, {
            [semantic['@type']]: (map[semantic['@type']] || []).concat(
              Object.entries(semantic).reduce((mapping, [key, value]) =>
                Object.assign(mapping, key !== '@type' && {[key]: value}), {}))
          }), {}
        )), {});
    }
    return result;
  }, {});
}

/**
 * Returns initialized schema validator function
 * @return {Function}
 */
function initializeSchemaValidator() {
  try {
    const schema = require('./schemas/alexa_smart_home_message_schema.json');
    // Add metadata for json schema draft v6 support
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    // Return function with compiled schema
    return ajv.compile(schema);
  } catch (e) {
    return;
  }
}

/**
 * Asserts captured calls
 * @param  {Object}  calls
 * @param  {Object}  expected
 */
assert.capturedCalls = function (calls, expected) {
  if (expected) {
    assert.deepEqual(calls, expected);
  }
};

/**
 * Asserts captured result
 * @param  {Object}  result
 * @param  {Object}  expected
 */
assert.capturedResult = function (result, expected) {
  if (expected) {
    Object.keys(expected).forEach((key) => {
      if (typeof expected[key] === 'object' && expected[key] !== null) {
        assert.exists(result[key]);
        assert.capturedResult(result[key], expected[key]);
      } else {
        assert.equal(result[key], expected[key]);
      }
    });
  }
};

/**
 * Assert discovered appliances (v2)
 * @param {Array}  appliances
 * @param {Object} results
 */
assert.discoveredAppliances = function (appliances, results) {
  assert.equal(appliances.length, Object.keys(results).length);

  appliances.forEach((appliance) => {
    const expected = results[appliance.applianceId];
    assert.isDefined(expected);

    Object.keys(expected).forEach((key) => {
      switch (key) {
        case 'actions':
        case 'applianceTypes':
          assert.sameMembers(appliance[key], expected[key]);
          break;
        case 'additionalApplianceDetails':
          assert.include(appliance[key], expected[key]);
          break;
        default:
          assert.equal(appliance[key], expected[key]);
      }
    });
  });
};

/**
 * Asserts discovered endpoints (v3)
 * @param  {Array}   endpoints
 * @param  {Object}  results
 */
assert.discoveredEndpoints = function (endpoints, results) {
  assert.equal(endpoints.length, Object.keys(results).length);

  endpoints.forEach((endpoint) => {
    const expected = results[endpoint.endpointId];
    assert.isDefined(expected);

    Object.keys(expected).forEach((key) => {
      switch (key) {
        case 'capabilities':
          assert.sameMembers(getCapabilitiesNamespaces(endpoint.capabilities), expected.capabilities);
          break;
        case 'configuration':
          assert.deepInclude(getCapabilitiesConfiguration(endpoint.capabilities), expected.configuration);
          break;
        case 'displayCategories':
          assert.sameMembers(endpoint.displayCategories, expected.displayCategories);
          break;
        case 'parameters':
          assert.deepInclude(getCapabilitiesParameters(endpoint.capabilities), expected.parameters);
          break;
        case 'resources':
          assert.deepInclude(getCapabilitiesResources(endpoint.capabilities), expected.resources);
          break;
        case 'semantics':
          assert.deepInclude(getCapabilitiesSemantics(endpoint.capabilities), expected.semantics);
          break;
        case 'propertyMap':
          assert.deepInclude(JSON.parse(endpoint.cookie.propertyMap), expected.propertyMap);
          break;
        default:
          assert.equal(endpoint[key], expected[key]);
      }
    });
  });
};

/**
 * Asserts json schema validator
 * @param  {Object}  result
 * @param  {Boolean} canValidate
 */
assert.validSchema = function (result, canValidate) {
  // Validate schema using official reference if not excluded in test unit (test.validate = false)
  //  This is to account for the official alexa schema not supporting latest api changes yet
  //    https://github.com/alexa/alexa-smarthome/wiki/Validation-Schemas
  if (canValidate !== false && typeof validate === 'function') {
    [].concat(result).forEach(data => assert(validate(data),
      `Schema Validation Failed\nData: ${JSON.stringify(data)}\n\nErrors: ${ajv.errorsText(validate.errors)}`));
  }
};

module.exports = {
  assert: assert,
  utils: {
    generateDirectiveRequest: generateDirectiveRequest
  }
};
