/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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
  description: 'christmas tree',
  items: [
    {
      type: 'Dimmer',
      name: 'christmasTree',
      label: 'Christmas Tree',
      metadata: {
        alexa: {
          value: 'ChristmasTree'
        }
      }
    }
  ],
  expected: {
    christmasTree: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['CHRISTMAS_TREE'],
      friendlyName: 'Christmas Tree'
    }
  }
};
