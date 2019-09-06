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
    description: "set color request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetColorRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "light1"
        },
        "color": {
          "hue": 350.5,
          "saturation": 0.7138,
          "brightness": 0.6524
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetColorConfirmation"
        },
        "payload": {
          "achievedState": {
            "color": {
              "hue": 350.5,
              "saturation": 0.7138,
              "brightness": 0.6524
            }
          }
        }
      },
      openhab: [
        {"name": "light1", "value": "350.5,71.38,65.24"}
      ]
    }
  }
];
