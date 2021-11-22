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
  description: 'air conditioner',
  items: [
    {
      type: 'Switch',
      name: 'airConditioner',
      label: 'Air Conditioner',
      metadata: {
        alexa: {
          value: 'AirConditioner'
        }
      }
    }
  ],
  expected: {
    airConditioner: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['AIR_CONDITIONER'],
      friendlyName: 'Air Conditioner'
    }
  }
};
