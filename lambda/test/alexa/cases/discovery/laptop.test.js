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
  description: 'laptop',
  items: [
    {
      type: 'Switch',
      name: 'latop',
      label: 'Laptop',
      metadata: {
        alexa: {
          value: 'Laptop'
        }
      }
    }
  ],
  expected: {
    latop: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['LAPTOP'],
      friendlyName: 'Laptop'
    }
  }
};
