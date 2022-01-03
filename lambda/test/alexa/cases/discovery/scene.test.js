/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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
  description: 'scene',
  items: [
    {
      type: 'Switch',
      name: 'scene1',
      label: 'Scene 1',
      metadata: {
        alexa: {
          value: 'Scene'
        }
      }
    },
    {
      type: 'Switch',
      name: 'scene2',
      label: 'Scene 2',
      metadata: {
        alexa: {
          value: 'SceneController.scene'
        }
      }
    }
  ],
  expected: {
    scene1: {
      capabilities: ['Alexa.SceneController', 'Alexa'],
      parameters: {
        'Alexa.SceneController.supportsDeactivation': true
      },
      displayCategories: ['SCENE_TRIGGER'],
      friendlyName: 'Scene 1'
    },
    scene2: {
      capabilities: ['Alexa.SceneController', 'Alexa'],
      parameters: {
        'Alexa.SceneController.supportsDeactivation': true
      },
      displayCategories: ['SCENE_TRIGGER'],
      friendlyName: 'Scene 2'
    }
  }
};
