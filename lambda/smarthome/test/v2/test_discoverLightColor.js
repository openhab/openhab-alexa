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
  description: "single color light",
  mocked: [
    {
      "type": "Color",
      "name": "light1",
      "label": "Color Light 1",
      "tags": ["Lighting"]
    }
  ],
  expected: {
    "light1": {
      "actions": [
        "incrementPercentage",
        "decrementPercentage",
        "setPercentage",
        "turnOn",
        "turnOff",
        "setColor"
      ],
      "applianceTypes": ["LIGHT"],
      "friendlyName": "Color Light 1"
    }
  }
};
