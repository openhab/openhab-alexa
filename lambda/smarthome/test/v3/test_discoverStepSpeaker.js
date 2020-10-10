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

module.exports = {
  description: "step speaker enabled group",
  mocked: [
    {
      "type": "Switch",
      "name": "stepSpeakerMute",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "StepSpeaker.muted"
        }
      },
      "groupNames": ["gStepSpeaker"]
    },
    {
      "type": "Number",
      "name": "stepSpeakerVolume",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "StepSpeaker.volume"
        }
      },
      "groupNames": ["gStepSpeaker"]
    },
    {
      "type": "Group",
      "name": "gStepSpeaker",
      "label": "Speaker",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Speaker"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gStepSpeaker": {
      "capabilities": [
        "Alexa",
        "Alexa.StepSpeaker"
      ],
      "displayCategories": ["SPEAKER"],
      "friendlyName": "Speaker",
      "propertyMap": {
        "StepSpeaker": {
          "muted": {
            "parameters": {},
            "item": {"name": "stepSpeakerMute", "type": "Switch"},
            "schema": {"name": "muteState"}
          },
          "volume": {
            "parameters": {},
            "item": {"name": "stepSpeakerVolume", "type": "Number"},
            "schema": {"name": "volumeSteps"}
          }
        }
      }
    }
  }
};
