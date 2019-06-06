/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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
  description: "contact/motion sensors",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/contact1",
      "type": "Contact",
      "name": "contact1",
      "label": "Contact Sensor",
      "tags": ["ContactSensor"]
    },
    {
      "link": "https://localhost:8443/rest/items/motion1",
      "type": "Contact",
      "name": "motion1",
      "label": "Motion Sensor",
      "tags": ["MotionSensor"]
    },

  ],
  expected: {
    "contact1": {
      "capabilities": [
        "Alexa",
        "Alexa.ContactSensor.detectionState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["CONTACT_SENSOR"],
      "friendlyName": "Contact Sensor"
    },
    "motion1": {
      "capabilities": [
        "Alexa",
        "Alexa.MotionSensor.detectionState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["MOTION_SENSOR"],
      "friendlyName": "Motion Sensor"
    }
  }
};
