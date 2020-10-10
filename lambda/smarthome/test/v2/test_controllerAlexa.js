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
    description: "health check request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.System",
        "name": "HealthCheckRequest",
        "payloadVersion": "2"
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.System",
          "name": "HealthCheckResponse"
        },
        "payload": {
          "description": "The system is currently healthy",
          "isHealthy": true
        }
      },
      openhab: []
    }
  }
];
