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
    description: "set percentage",
    directive: {
      "header": {
        "namespace": "Alexa.PercentageController",
        "name": "SetPercentage"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PercentageController": {
              "percentage": {"parameters": {}, "item": {"name": "device1"}, "schema": {"name": "percentage"}}}
          })
        }
      },
      "payload": {
        "percentage": 42
      }
    },
    mocked: {
      openhab: {"name": "device1", "state": "42", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PercentageController",
            "name": "percentage",
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
    description: "adjust percentage",
    directive: {
      "header": {
        "namespace": "Alexa.PercentageController",
        "name": "AdjustPercentage"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PercentageController": {
              "percentage": {"parameters": {}, "item": {"name": "device1"}, "schema": {"name": "percentage"}}}
          })
        }
      },
      "payload": {
        "percentageDelta": 3
      }
    },
    mocked: {
      openhab: [
        {"name": "device1", "state": "42", "type": "Dimmer"},
        {"name": "device1", "state": "45", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PercentageController",
            "name": "percentage",
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
      ]
    }
  }
];
