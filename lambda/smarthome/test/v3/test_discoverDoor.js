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

module.exports = {
  description: "garage door",
  mocked: [
    {
      "type": "Switch",
      "name": "garageDoor",
      "label": "Garage Door",
      "tags": ["Door"]
    }
  ],
  expected: {
    "garageDoor": {
      "capabilities": [
        "Alexa",
        "Alexa.ToggleController.garageDoor.toggleState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["DOOR"],
      "friendlyName": "Garage Door",
      "resources": {
        "Alexa.ToggleController.garageDoor": {
          "friendlyNames": ["asset:Alexa.Setting.Opening"]
        }
      },
      "semantics": {
        "Alexa.ToggleController.garageDoor": {
          "ActionsToDirective": [
            {"actions": ["Alexa.Actions.Close"], "directive": {"name": "TurnOff", "payload": {}}},
            {"actions": ["Alexa.Actions.Open"], "directive": {"name": "TurnOn", "payload": {}}}
          ],
          "StatesToValue": [
            {"states": ["Alexa.States.Closed"], "value": "OFF"},
            {"states": ["Alexa.States.Open"], "value": "ON"}
          ]
        }
      },
      "propertyMap": {
        "ToggleController:garageDoor": {
          "toggleState": {
            "parameters": {
              "category": "DOOR",
              "friendlyNames": ["@Setting.Opening"],
              "actionMappings": [
                {"name": "Close", "directive": {"name": "TurnOff", "payload": {}}},
                {"name": "Open", "directive": {"name": "TurnOn", "payload": {}}}],
              "stateMappings": [
                {"name": "Closed", "value": "OFF"},
                {"name": "Open", "value": "ON"}]
            },
            "item": {"name": "garageDoor", "type": "Switch"},
            "schema": {"name": "toggleState"}
          }
        }
      }
    }
  }
};
