/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
    description: "set range value",
    directive: {
      "header": {
        "namespace": "Alexa.RangeController",
        "name": "SetRangeValue",
        "instance": "BasementFan"
      },
      "endpoint": {
        "endpointId": "BasementFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "RangeController:BasementFan": {
              "rangeValue": {
                "parameters": {
                  "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
                  "friendlyNames": ["Setting.FanSpeed"]},
                "item": {"name": "BasementFan", "type": "Number"},
                "schema": {"name": "rangeValue"}
              }
            }
          })
        }
      },
      "payload": {
        "rangeValue": 7
      }
    },
    mocked: {
      openhab: {"name": "BasementFan", "state": "7", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.RangeController",
            "name": "rangeValue",
            "instance": "BasementFan",
            "value": 7
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
        {"name": "BasementFan", "value": 7}
      ]
    }
  },
  {
    description: "adjust range value",
    directive: {
      "header": {
        "namespace": "Alexa.RangeController",
        "name": "AdjustRangeValue",
        "instance": "BasementFan"
      },
      "endpoint": {
        "endpointId": "BasementFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "RangeController:BasementFan": {
              "rangeValue": {
                "parameters": {
                  "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
                  "friendlyNames": ["Setting.FanSpeed"]},
                "item": {"name": "BasementFan", "type": "Number"},
                "schema": {"name": "rangeValue"}
              }
            }
          })
        }
      },
      "payload": {
        "rangeValueDelta": -3,
        "rangeValueDeltaDefault": false
      }
    },
    mocked: {
      openhab: [
        {"name": "BasementFan", "state": "7", "type": "Number"},
        {"name": "BasementFan", "state": "4", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.RangeController",
            "name": "rangeValue",
            "instance": "BasementFan",
            "value": 4
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
        {"name": "BasementFan", "value": 4}
      ]
    }
  }
];
