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
  description: "single roller shutter switch",
  mocked: [
    {
      "type": "Rollershutter",
      "name": "switch1",
      "label": "Roller Shutter",
      "tags": ["Switchable"]
    }
  ],
  expected: {
    "switch1": {
      "actions": [
        "setPercentage",
        "incrementPercentage",
        "decrementPercentage"
      ],
      "applianceTypes": ["SWITCH"],
      "friendlyName": "Roller Shutter"
    }
  }
};
