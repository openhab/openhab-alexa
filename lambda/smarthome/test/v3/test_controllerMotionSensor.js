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
    description: "report state motion sensor",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "motion1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "MotionSensor": {
              "detectionState": {
                "parameters": {}, "item": {"name": "motion1", "type": "Switch"},
                "schema": {"name": "detectionState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "motion1", "state": "OFF", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.MotionSensor",
              "name": "detectionState",
              "value": "NOT_DETECTED"
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
