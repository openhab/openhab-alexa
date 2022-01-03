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
  description: 'activity',
  items: [
    {
      type: 'Switch',
      name: 'activity1',
      label: 'Activity 1',
      metadata: {
        alexa: {
          value: 'Activity',
          config: {
            supportsDeactivation: false
          }
        }
      }
    }
  ],
  expected: {
    activity1: {
      capabilities: ['Alexa.SceneController', 'Alexa'],
      parameters: {
        'Alexa.SceneController.supportsDeactivation': false
      },
      displayCategories: ['ACTIVITY_TRIGGER'],
      friendlyName: 'Activity 1'
    }
  }
};
