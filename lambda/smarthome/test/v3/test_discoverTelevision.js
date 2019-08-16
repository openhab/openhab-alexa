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
  description: "television enabled group",
  mocked: [
    {
      "type": "Number",
      "name": "televisionChannel",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ChannelController.channel"
        }
      },
      "groupNames": ["gTelevision"]
    },
    {
      "type": "String",
      "name": "televisionSource",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "InputController.input",
          "config": {
            "supportedInputs": "HDMI1,TV,FOOBAR"
          }
        }
      },
      "groupNames": ["gTelevision"]
    },
    {
      "type": "String",
      "name": "televisionLabel",
      "tags": [],
      "groupNames": ["gTelevision"]
    },
    {
      "type": "Group",
      "name": "gTelevision",
      "label": "Television",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.TV"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gTelevision": {
      "capabilities": [
        "Alexa",
        "Alexa.ChannelController.channel",
        "Alexa.InputController",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["TV"],
      "parameters": {
        "Alexa.InputController.inputs": [
          {"name": "HDMI 1"},
          {"name": "TV"}
        ]
      },
      "friendlyName": "Television"
    }
  }
};
