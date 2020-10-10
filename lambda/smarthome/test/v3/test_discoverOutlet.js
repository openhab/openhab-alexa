/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
  description: "outlet plug",
  mocked: [
    {
      "type": "Switch",
      "name": "outletPlug",
      "label": "Outlet Plug",
      "tags": ["Outlet"]
    }
  ],
  expected: {
    "outletPlug": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SMARTPLUG"],
      "friendlyName": "Outlet Plug"
    }
  }
};
