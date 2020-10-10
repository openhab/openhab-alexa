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

module.exports = {
  description: "window blinds",
  mocked: [
    {
      "type": "Rollershutter",
      "name": "windowBlind1",
      "label": "Window Blind 1",
      "tags": ["Blind"]
    },
    {
      "type": "String",
      "name": "windowBlind2",
      "label": "Window Blind 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ModeController.mode",
          "config": {
            "category": "EXTERIOR_BLIND",
            "friendlyNames": "@Setting.Opening",
            "supportedModes": "Up=@Value.Open,Down=@Value.Close",
            "actionMappings": "Close=Down,Open=Up,Lower=Down,Raise=Up",
            "stateMappings": "Closed=Down,Open=Up"
          }
        }
      }
    }
  ],
  expected: {
    "windowBlind1": {
      "capabilities": [
        "Alexa",
        "Alexa.RangeController.windowBlind1.rangeValue",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["INTERIOR_BLIND"],
      "friendlyName": "Window Blind 1",
      "resources": {
        "Alexa.RangeController.windowBlind1": {
          "friendlyNames": ["asset:Alexa.Setting.Opening"]
        }
      },
      "configuration": {
        "Alexa.RangeController.windowBlind1": {
          "supportedRange": {"minimumValue": 0, "maximumValue": 100, "precision": 10},
          "unitOfMeasure": "Alexa.Unit.Percent"
        }
      },
      "semantics": {
        "Alexa.RangeController.windowBlind1": {
          "ActionsToDirective": [
            {"actions": ["Alexa.Actions.Close"], "directive": {
              "name": "SetRangeValue", "payload": {"rangeValue": 0}}},
            {"actions": ["Alexa.Actions.Open"], "directive": {
              "name": "SetRangeValue", "payload": {"rangeValue": 100}}},
            {"actions": ["Alexa.Actions.Lower"], "directive": {
              "name": "AdjustRangeValue", "payload": {"rangeValueDelta": -10, "rangeValueDeltaDefault": false}}},
            {"actions": ["Alexa.Actions.Raise"], "directive": {
              "name": "AdjustRangeValue", "payload": {"rangeValueDelta": 10, "rangeValueDeltaDefault": false}}}
          ],
          "StatesToRange": [
            {"states": ["Alexa.States.Open"], "range": {"minimumValue": 1, "maximumValue": 100}}
          ],
          "StatesToValue": [
            {"states": ["Alexa.States.Closed"], "value": 0}
          ]
        }
      },
      "propertyMap": {
        "RangeController:windowBlind1": {
          "rangeValue": {
            "parameters": {
              "category": "INTERIOR_BLIND",
              "friendlyNames": ["@Setting.Opening"],
              "supportedRange": {"minimumValue": 0, "maximumValue": 100, "precision": 10},
              "unitOfMeasure": "Percent",
              "actionMappings": [
                {"name": "Close", "directive": {
                  "name": "SetRangeValue", "payload": {"rangeValue": 0}}},
                {"name": "Open", "directive": {
                  "name": "SetRangeValue", "payload": {"rangeValue": 100}}},
                {"name": "Lower", "directive": {
                  "name": "AdjustRangeValue", "payload": {"rangeValueDelta": -10, "rangeValueDeltaDefault": false}}},
                {"name": "Raise", "directive": {
                  "name": "AdjustRangeValue", "payload": {"rangeValueDelta": 10, "rangeValueDeltaDefault": false}}}],
              "stateMappings": [
                {"name": "Closed", "value": 0},
                {"name": "Open", "range": {"minimumValue": 1, "maximumValue": 100}}]
            },
            "item": {"name": "windowBlind1", "type": "Rollershutter"},
            "schema": {"name": "rangeValue"}
          }
        }
      }
    },
    "windowBlind2": {
      "capabilities": [
        "Alexa",
        "Alexa.ModeController.windowBlind2.mode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["EXTERIOR_BLIND"],
      "friendlyName": "Window Blind 2",
      "resources": {
        "Alexa.ModeController.windowBlind2": {
          "friendlyNames": ["asset:Alexa.Setting.Opening"]
        }
      },
      "configuration": {
        "Alexa.ModeController.windowBlind2": {
          "ordered": false,
          "supportedModes": {
            "Up": {
              'friendlyNames': ["asset:Alexa.Value.Open"]
            },
            "Down": {
              'friendlyNames': ["asset:Alexa.Value.Close"]
            }
          }
        }
      },
      "semantics": {
        "Alexa.ModeController.windowBlind2": {
          "ActionsToDirective": [
            {"actions": ["Alexa.Actions.Close", "Alexa.Actions.Lower"], "directive": {
              "name": "SetMode", "payload": {"mode": "Down"}}},
            {"actions": ["Alexa.Actions.Open", "Alexa.Actions.Raise"], "directive": {
              "name": "SetMode", "payload": {"mode": "Up"}}}
          ],
          "StatesToValue": [
            {"states": ["Alexa.States.Closed"], "value": "Down"},
            {"states": ["Alexa.States.Open"], "value": "Up"}
          ]
        }
      },
      "propertyMap": {
        "ModeController:windowBlind2": {
          "mode": {
            "parameters": {
              "category": "EXTERIOR_BLIND",
              "friendlyNames": ["@Setting.Opening"],
              "supportedModes": ["Up=@Value.Open", "Down=@Value.Close"],
              "actionMappings": [
                {"name": "Close", "directive": {
                  "name": "SetMode", "payload": {"mode": "Down"}}},
                {"name": "Open", "directive": {
                  "name": "SetMode", "payload": {"mode": "Up"}}},
                {"name": "Lower", "directive": {
                  "name": "SetMode", "payload": {"mode": "Down"}}},
                {"name": "Raise", "directive": {
                  "name": "SetMode", "payload": {"mode": "Up"}}}],
              "stateMappings": [
                {"name": "Closed", "value": "Down"},
                {"name": "Open", "value": "Up"}]
            },
            "item": {"name": "windowBlind2", "type": "String"},
            "schema": {"name": "mode"}
          }
        }
      }
    }
  }
};
