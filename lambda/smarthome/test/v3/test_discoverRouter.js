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
  description: "wireless router",
  mocked: [
    {
      "type": "Switch",
      "name": "guestNetwork",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ToggleController.toggleState",
          "config": {
            "friendlyNames": "@Setting.GuestWiFi"
          }
        }
      },
      "groupNames": ["gWirelessRouter"]
    },
    {
      "type": "Group",
      "name": "gWirelessRouter",
      "label": "Wireless Router",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.NetworkHardware"
        }
      },
      "groupNames": []
    },
  ],
  expected: {
    "gWirelessRouter": {
      "capabilities": [
        "Alexa",
        "Alexa.ToggleController.guestNetwork.toggleState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["NETWORK_HARDWARE"],
      "friendlyName": "Wireless Router",
      "resources": {
        "Alexa.ToggleController.guestNetwork": {
          "friendlyNames": ["asset:Alexa.Setting.GuestWiFi"]
        }
      }
    }
  }
};
