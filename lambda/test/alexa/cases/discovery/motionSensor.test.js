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
  description: 'motion sensor',
  items: [
    {
      type: 'Contact',
      name: 'motion1',
      label: 'Motion Sensor 1',
      metadata: {
        alexa: {
          value: 'MotionSensor'
        }
      }
    },
    {
      type: 'Switch',
      name: 'motion2',
      label: 'Motion Sensor 2',
      metadata: {
        alexa: {
          value: 'MotionDetectionState'
        }
      }
    },
    {
      type: 'Switch',
      name: 'motion3',
      label: 'Motion Sensor 3',
      metadata: {
        alexa: {
          value: 'MotionSensor.detectionState' // backward compatibility
        }
      }
    }
  ],
  expected: {
    motion1: {
      capabilities: ['Alexa.MotionSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['MOTION_SENSOR'],
      friendlyName: 'Motion Sensor 1'
    },
    motion2: {
      capabilities: ['Alexa.MotionSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['MOTION_SENSOR'],
      friendlyName: 'Motion Sensor 2'
    },
    motion3: {
      capabilities: ['Alexa.MotionSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['MOTION_SENSOR'],
      friendlyName: 'Motion Sensor 3'
    }
  }
};
