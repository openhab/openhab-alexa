var assert = require('chai').assert;

/**
 * Generate directive request based of default template
 * @param  {*} request
 * @return {*}
 */
function generateDirectiveRequest(request) {
  var template = {
    "header": {
      "namespace": null,
      "name": null,
      "messageId": "message-id",
      "correlationToken": "correlation-token",
      "payloadVersion": "3"
    },
    "endpoint": {
      "endpointId": null,
      "cookie": {},
      "scope": {
        "type": "BearerToken",
        "token": "access-token-from-skill"
      }
    },
    "payload": {}
  };
  var directive = {
    "header": Object.assign(template.header, request.header),
    "endpoint": Object.assign(template.endpoint, request.endpoint),
    "payload": Object.assign(template.payload, request.payload)
  };
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
 * Get list of capabilities namespace
 * @param {*} capabilities
 */
function getCapabilitiesNamespaces(capabilities) {
  return capabilities.reduce(function(result, capability) {
    if (capability.properties && capability.properties.supported) {
      capability.properties.supported.forEach(function(property) {
        result.push(capability.interface + '.' + property.name);
      });
    } else {
      result.push(capability.interface);
    }
    return result;
  }, []);
};

/**
 * Get capability object or parameter value based on interface name
 * @param {*} capabilities
 * @param {*} interfaceName
 * @param {*} parameter (optional)
 */
function getCapabilityByInterface(capabilities, interfaceName, parameter) {
  var result = capabilities.find(capability => capability.interface === interfaceName);
  if (result) {
    return parameter ? result[parameter] : result;
  }
};

/**
 * Assert capture result
 * @param {*} result
 * @param {*} expected
 */
assert.captureResult = function(result, expected) {
  Object.keys(expected).forEach(function(key) {
     if (typeof expected[key] === 'object') {
       assert.exists(result[key]);
       assert.captureResult(result[key], expected[key]);
     } else {
       assert.equal(result[key], expected[key]);
     }
   });
};

/**
 * Assert discover endpoints
 * @param {*} endpoints
 * @param {*} results
 */
assert.discoverEndpoints = function(endpoints, results) {
  assert.equal(endpoints.length, Object.keys(results).length);

  endpoints.forEach(function(endpoint) {
    var expected = results[endpoint.endpointId];

    if (!expected) {
      return;
    }
    if (expected.capabilities) {
      assert.sameMembers(getCapabilitiesNamespaces(endpoint.capabilities), expected.capabilities);
    }
    if (expected.displayCategories) {
      assert.sameMembers(endpoint.displayCategories, expected.displayCategories);
    }
    if (expected.parameters) {
      Object.keys(expected.parameters).forEach(function(parameter) {
        var match;
        if (match = parameter.match(/^(\w+)\:(\w+)/)) {
          assert.deepEqual(getCapabilityByInterface(endpoint.capabilities, match[0], match[1]), expected.parameters[parameter]);
        }
      });
    }
  });
};

module.exports.assert = assert;
module.exports.utils = {
  generateDirectiveRequest: generateDirectiveRequest
};
