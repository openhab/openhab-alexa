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
    description: "turn on toggle state",
    directive: {
      "header": {
        "namespace": "Alexa.ToggleController",
        "name": "TurnOn",
        "instance": "TowerFan"
      },
      "endpoint": {
        "endpointId": "TowerFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ToggleController:TowerFan": {
              "toggleState": {
                "parameters": {"friendlyNames": ["Setting.Oscillate", "Rotate"]},
                "item": {"name": "TowerFan", "type": "Switch"}, "schema": {"name": "toggleState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "TowerFan", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ToggleController",
            "name": "toggleState",
            "instance": "TowerFan",
            "value": "ON"
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
        {"name": "TowerFan", "value": "ON"}
      ]
    }
  }
];
