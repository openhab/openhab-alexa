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

module.exports = [
  {
    description: "set color",
    directive: {
      "header": {
        "namespace": "Alexa.ColorController",
        "name": "SetColor"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorController": {"color": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "color"}}}
          })
        }
      },
      "payload": {
        "color": {
          "hue": 350.5,
          "saturation": 0.7138,
          "brightness": 0.6524
        }
      }
    },
    mocked: {
      openhab: {"name": "light1", "state": "350.5,71.38,65.24", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorController",
            "name": "color",
            "value": {
              "hue": 350.5,
              "saturation": 0.7138,
              "brightness": 0.6524
            }
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "light1", "value": "350.5,71.38,65.24"}
      ]
    }
  }
];
