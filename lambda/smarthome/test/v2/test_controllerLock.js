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
    description: "get lock state",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Query",
        "name": "GetLockStateRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "doorLock"
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLock", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Query",
          "name": "GetLockStateResponse"
        },
        "payload": {
          "lockState": "LOCKED"
        }
      },
      openhab: []
    }
  },
  {
    description: "set lock state",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetLockStateRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "doorLock"
        },
        "lockState": "LOCKED"
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetLockStateConfirmation"
        },
        "payload": {
          "lockState": "LOCKED"
        }
      },
      openhab: [
        {"name": "doorLock", "value": "ON"}
      ]
    }
  }
];
