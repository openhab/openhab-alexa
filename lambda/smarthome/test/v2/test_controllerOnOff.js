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
    description: "turn on request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "TurnOnRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "switch1"
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "TurnOnConfirmation"
        }
      },
      openhab: [
        {"name": "switch1", "value": "ON"}
      ]
    }
  },
  {
    description: "turn off request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "TurnOffRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "switch1"
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "TurnOffConfirmation"
        }
      },
      openhab: [
        {"name": "switch1", "value": "OFF"}
      ]
    }
  }
];
