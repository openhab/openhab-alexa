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

module.exports = [
  {
    description: "set power level",
    directive: {
      "header": {
        "namespace": "Alexa.PowerLevelController",
        "name": "SetPowerLevel"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerLevelController": {
              "powerLevel": {"parameters": {}, "item": {"name": "device1"}, "schema": {"name": "powerLevel"}}}
          })
        }
      },
      "payload": {
        "powerLevel": 42
      }
    },
    mocked: {
      openhab: {"name": "device1", "state": "42", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerLevelController",
            "name": "powerLevel",
            "value": 42
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "device1", "value": 42}
      ]
    }
  },
  {
    description: "adjust power level",
    directive: {
      "header": {
        "namespace": "Alexa.PowerLevelController",
        "name": "AdjustPowerLevel"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerLevelController": {
              "powerLevel": {"parameters": {}, "item": {"name": "device1"}, "schema": {"name": "powerLevel"}}}
          })
        }
      },
      "payload": {
        "powerLevelDelta": 3
      }
    },
    mocked: {
      openhab: [
        {"name": "device1", "state": "42", "type": "Dimmer"},
        {"name": "device1", "state": "45", "type": "Dimmer"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerLevelController",
            "name": "powerLevel",
            "value": 45
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "device1", "value": 45}
      ],
    }
  }
];
