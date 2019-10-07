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
    description: "adjust volume steps default increment",
    directive: {
      "header": {
        "namespace": "Alexa.StepSpeaker",
        "name": "AdjustVolume"
      },
      "endpoint": {
        "endpointId": "gStepSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "StepSpeaker": {
              "volume": {
                "parameters": {"increment": 5},
                "item": {"name": "stepSpeakerVolume"},
                "schema": {"name": "volumeSteps"}
              }
            }
          })
        }
      },
      "payload": {
        "volumeSteps": 10,
        "volumeStepsDefault": true
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "context": {
          "properties": []
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "stepSpeakerVolume", "value": 5}
      ]
    }
  },
  {
    description: "adjust volume steps missing property",
    directive: {
      "header": {
        "namespace": "Alexa.StepSpeaker",
        "name": "AdjustVolume"
      },
      "endpoint": {
        "endpointId": "gStepSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "StepSpeaker": {
              "muted": {"parameters": {}, "item": {"name": "stepSpeakerMute"}, "schema": {"name": "muteState"}}}
          })
        }
      },
      "payload": {
        "volumeSteps": 10,
        "volumeStepsDefault": true
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "INVALID_DIRECTIVE",
            "message": "Invalid directive"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "set mute volume",
    directive: {
      "header": {
        "namespace": "Alexa.StepSpeaker",
        "name": "SetMute"
      },
      "endpoint": {
        "endpointId": "gStepSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "StepSpeaker": {
              "muted": {"parameters": {}, "item": {"name": "stepSpeakerMute"}, "schema": {"name": "muteState"}}}
          })
        }
      },
      "payload": {
        "mute": true
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "context": {
          "properties": []
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "stepSpeakerMute", "value": "ON"}
      ]
    }
  }
];
