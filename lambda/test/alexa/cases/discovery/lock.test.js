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
  description: 'lock',
  items: [
    {
      type: 'Switch',
      name: 'doorLock1',
      label: 'Door Lock 1',
      metadata: {
        alexa: {
          value: 'Lock'
        }
      }
    },
    {
      type: 'Switch',
      name: 'doorLock2',
      label: 'Door Lock 2',
      metadata: {
        alexa: {
          value: 'LockState'
        }
      }
    },
    {
      type: 'Group',
      name: 'gDoorLock3',
      label: 'Door Lock 3',
      metadata: {
        alexa: {
          value: 'Lock'
        }
      }
    },
    {
      type: 'Switch',
      name: 'targetDoorLock3',
      groupNames: ['gDoorLock3'],
      metadata: {
        alexa: {
          value: 'TargetLockState'
        }
      }
    },
    {
      type: 'Number',
      name: 'currentDoorLock3',
      groupNames: ['gDoorLock3'],
      metadata: {
        alexa: {
          value: 'CurrentLockState',
          config: {
            LOCKED: 1,
            UNLOCKED: 2,
            JAMMED: 42
          }
        }
      }
    }
  ],
  expected: {
    doorLock1: {
      capabilities: ['Alexa.LockController.lockState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SMARTLOCK'],
      friendlyName: 'Door Lock 1'
    },
    doorLock2: {
      capabilities: ['Alexa.LockController.lockState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SMARTLOCK'],
      friendlyName: 'Door Lock 2'
    },
    gDoorLock3: {
      capabilities: ['Alexa.LockController.lockState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SMARTLOCK'],
      friendlyName: 'Door Lock 3',
      cookie: [
        {
          name: 'LockController',
          property: 'lockState',
          parameters: {},
          item: { name: 'targetDoorLock3', type: 'Switch' }
        },
        {
          name: 'LockController',
          property: 'lockState',
          tag: 'sensor',
          parameters: { LOCKED: 1, UNLOCKED: 2, JAMMED: 42 },
          item: { name: 'currentDoorLock3', type: 'Number' }
        }
      ]
    }
  }
};
