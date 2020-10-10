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

module.exports = [
  {
    description: "turn on power switch item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOn"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "ON"
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
        {"name": "light1", "value": "ON"}
      ]
    }
  },
  {
    description: "turn on power dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOn"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "100", "type": "Dimmer", "stateDescription": {"pattern": ">%d%<"}}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "ON"
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
        {"name": "light1", "value": "ON"}
      ]
    }
  },
  {
    description: "turn off power color item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOff"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "0,0,0", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "OFF"
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
        {"name": "light1", "value": "OFF"}
      ]
    }
  },
  {
    description: "turn on power not retrievable state",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOn"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {
              "powerState": {
                "parameters": {}, "item": {"name": "light1", "stateRetrievable": false, "type": "Switch"},
                "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {},
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "ON"
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
        {"name": "light1", "value": "ON"}
      ]
    }
  }
];
