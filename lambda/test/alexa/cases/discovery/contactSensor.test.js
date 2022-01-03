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
  description: 'contact sensor',
  items: [
    {
      type: 'Contact',
      name: 'contact1',
      label: 'Contact Sensor 1',
      metadata: {
        alexa: {
          value: 'ContactSensor'
        }
      }
    },
    {
      type: 'Switch',
      name: 'contact2',
      label: 'Contact Sensor 2',
      metadata: {
        alexa: {
          value: 'ContactDetectionState'
        }
      }
    },
    {
      type: 'Switch',
      name: 'contact3',
      label: 'Contact Sensor 3',
      metadata: {
        alexa: {
          value: 'ContactSensor.detectionState' // backward compatibility
        }
      }
    }
  ],
  expected: {
    contact1: {
      capabilities: ['Alexa.ContactSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CONTACT_SENSOR'],
      friendlyName: 'Contact Sensor 1'
    },
    contact2: {
      capabilities: ['Alexa.ContactSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CONTACT_SENSOR'],
      friendlyName: 'Contact Sensor 2'
    },
    contact3: {
      capabilities: ['Alexa.ContactSensor.detectionState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CONTACT_SENSOR'],
      friendlyName: 'Contact Sensor 3'
    }
  }
};
