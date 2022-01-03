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
  description: 'doorbell',
  items: [
    {
      type: 'Group',
      name: 'gDoorbell',
      label: 'Doorbell',
      metadata: {
        alexa: {
          value: 'Doorbell'
        }
      }
    },
    {
      type: 'String',
      name: 'cameraStream',
      groupNames: ['gDoorbell'],
      metadata: {
        alexa: {
          value: 'CameraStream',
          config: {
            proxyBaseUrl: 'https://openhab.myserver.tld'
          }
        }
      }
    }
  ],
  expected: {
    gDoorbell: {
      capabilities: ['Alexa.CameraStreamController', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['DOORBELL'],
      friendlyName: 'Doorbell',
      parameters: {
        'Alexa.CameraStreamController.cameraStreamConfigurations': [
          {
            protocols: ['HLS'],
            resolutions: [{ width: 1920, height: 1080 }],
            authorizationTypes: ['NONE'],
            videoCodecs: ['H264'],
            audioCodecs: ['AAC']
          }
        ]
      }
    }
  }
};
