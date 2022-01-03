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
  description: 'printer',
  items: [
    {
      type: 'Switch',
      name: 'printer',
      label: 'Printer',
      metadata: {
        alexa: {
          value: 'Printer'
        }
      }
    }
  ],
  expected: {
    printer: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['PRINTER'],
      friendlyName: 'Printer'
    }
  }
};
