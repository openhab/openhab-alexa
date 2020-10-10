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
    description: "report state contact sensor",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "contact1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ContactSensor": {
              "detectionState": {
                "parameters": {}, "item": {"name": "contact1", "type": "Contact"},
                "schema": {"name": "detectionState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "contact1", "state": "OPEN", "type": "Contact"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ContactSensor",
              "name": "detectionState",
              "value": "DETECTED"
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "StateReport"
          },
        }
      },
      openhab: []
    }
  }
];
