/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

export default {
  description: 'screen',
  items: [
    {
      type: 'Switch',
      name: 'screen',
      label: 'Screen',
      metadata: {
        alexa: {
          value: 'Screen'
        }
      }
    }
  ],
  expected: {
    screen: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SCREEN'],
      friendlyName: 'Screen'
    }
  }
};
