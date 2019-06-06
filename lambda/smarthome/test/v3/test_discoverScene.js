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
  description: "multiple scene/activity items",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/scene1",
      "type": "Switch",
      "name": "scene1",
      "label": "Scene 1",
      "tags": ["Scene"]
    },
    {
      "link": "https://localhost:8443/rest/items/scene2",
      "type": "Switch",
      "name": "scene2",
      "label": "Scene 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "SceneController.scene",
          "config": {
            "supportsDeactivation": false
          }
        }
      }
    },
    {
      "link": "https://localhost:8443/rest/items/activity1",
      "type": "Switch",
      "name": "activity1",
      "label": "Activity 1",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Activity"
        }
      }
    }
  ],
  expected: {
    "scene1": {
      "capabilities": [
        "Alexa",
        "Alexa.SceneController",
        "Alexa.EndpointHealth.connectivity"
      ],
      "parameters": {
        "Alexa.SceneController.supportsDeactivation": true
      },
      "displayCategories": ["SCENE_TRIGGER"],
      "friendlyName": "Scene 1"
    },
    "scene2": {
      "capabilities": [
        "Alexa",
        "Alexa.SceneController",
        "Alexa.EndpointHealth.connectivity"
      ],
      "parameters": {
        "Alexa.SceneController.supportsDeactivation": false
      },
      "displayCategories": ["SCENE_TRIGGER"],
      "friendlyName": "Scene 2"
    },
    "activity1": {
      "capabilities": [
        "Alexa",
        "Alexa.SceneController",
        "Alexa.EndpointHealth.connectivity"
      ],
      "parameters": {
        "Alexa.SceneController.supportsDeactivation": true
      },
      "displayCategories": ["ACTIVITY_TRIGGER"],
      "friendlyName": "Activity 1"
    }
  }
};
