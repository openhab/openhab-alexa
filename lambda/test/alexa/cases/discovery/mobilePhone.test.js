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
  description: 'mobile phone',
  items: [
    {
      type: 'Switch',
      name: 'mobilePhone',
      label: 'Mobile Phone',
      metadata: {
        alexa: {
          value: 'MobilePhone'
        }
      }
    }
  ],
  expected: {
    mobilePhone: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['MOBILE_PHONE'],
      friendlyName: 'Mobile Phone'
    }
  }
};
