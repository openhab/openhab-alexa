/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
  description: 'step speaker',
  items: [
    {
      type: 'Group',
      name: 'gStepSpeaker1',
      label: 'Step Speaker 1',
      metadata: {
        alexa: {
          value: 'Speaker'
        }
      }
    },
    {
      type: 'Switch',
      name: 'mute1',
      groupNames: ['gStepSpeaker1'],
      metadata: {
        alexa: {
          value: 'MuteState',
          config: {
            stepSpeaker: true
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'volume1',
      groupNames: ['gStepSpeaker1'],
      metadata: {
        alexa: {
          value: 'VolumeLevel',
          config: {
            stepSpeaker: true
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'volume2',
      label: 'Step Speaker Volume 2',
      metadata: {
        alexa: {
          value: 'VolumeLevel',
          config: {
            stepSpeaker: true
          }
        }
      }
    }
  ],
  expected: {
    gStepSpeaker1: {
      capabilities: ['Alexa.StepSpeaker', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Step Speaker 1',
      cookie: [
        {
          name: 'StepSpeaker',
          property: 'muted',
          parameters: {},
          item: { name: 'mute1', type: 'Switch' }
        },
        {
          name: 'StepSpeaker',
          property: 'volume',
          parameters: {},
          item: { name: 'volume1', type: 'Number' }
        }
      ]
    },
    volume2: {
      capabilities: ['Alexa.StepSpeaker', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Step Speaker Volume 2',
      cookie: [
        {
          name: 'StepSpeaker',
          property: 'volume',
          parameters: {},
          item: { name: 'volume2', type: 'Number' }
        }
      ]
    }
  }
};
