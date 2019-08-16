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
  description: "single roller shutter switch",
  mocked: [
    {
      "type": "Rollershutter",
      "name": "switch1",
      "label": "Roller Shutter 1",
      "tags": ["Switchable"]
    },
    {
      "type": "Rollershutter",
      "name": "switch2",
      "label": "Roller Shutter 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Switchable",
          "config": {
            "category": "other"
          }
        }
      }
    }
  ],
  expected: {
    "switch1": {
      "capabilities": [
        "Alexa",
        "Alexa.PercentageController.percentage",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SWITCH"],
      "friendlyName": "Roller Shutter 1"
    },
    "switch2": {
      "capabilities": [
        "Alexa",
        "Alexa.PercentageController.percentage",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["OTHER"],
      "friendlyName": "Roller Shutter 2"
    }
  }
};
