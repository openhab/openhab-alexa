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
    description: "arm away no delay string item",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Arm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": true},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              },
              "burglaryAlarm": {
                "parameters": {},
                "item": {"name": "BurglaryAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              }
            }
          })
        }
      },
      "payload": {
        "armState": "ARMED_AWAY"
      }
    },
    mocked: {
      openhab: [
        {"name": "AlarmMode", "state": "disarm", "type": "String"},
        {"name": "AlarmMode", "state": "away", "type": "String"},
        {"name": "BurglaryAlarm", "state": "OFF", "type": "Switch"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.SecurityPanelController",
            "name": "armState",
            "value": "ARMED_AWAY"
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa.SecurityPanelController",
            "name": "Arm.Response"
          },
          "payload": {}
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": "away"}
      ]
    }
  },
  {
    description: "arm away delay string item",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Arm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": true, "exitDelay": 180},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              }
            }
          })
        }
      },
      "payload": {
        "armState": "ARMED_AWAY"
      }
    },
    mocked: {
      openhab: [
        {"name": "AlarmMode", "state": "disarm", "type": "String"},
        {"name": "AlarmMode", "state": "away", "type": "String"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.SecurityPanelController",
            "name": "armState",
            "value": "ARMED_AWAY"
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa.SecurityPanelController",
            "name": "Arm.Response"
          },
          "payload": {
            "exitDelayInSeconds": 180
          }
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": "away"}
      ]
    }
  },
  {
    description: "arm stay no delay number item",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Arm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "DISARMED": 0, "ARMED_STAY": 1, "ARMED_AWAY": 2, "exitDelay": 180,
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"]},
                "item": {"name": "AlarmMode", "type": "Number"},
                "schema": {"name": "armState"}
              }
            }
          })
        }
      },
      "payload": {
        "armState": "ARMED_STAY"
      }
    },
    mocked: {
      openhab: [
        {"name": "AlarmMode", "state": "0", "type": "Number"},
        {"name": "AlarmMode", "state": "1", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.SecurityPanelController",
            "name": "armState",
            "value": "ARMED_STAY"
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa.SecurityPanelController",
            "name": "Arm.Response"
          },
          "payload": {}
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": 1}
      ]
    }
  },
  {
    description: "arm authorization required error",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Arm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": true, "exitDelay": 180},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              }
            }
          })
        }
      },
      "payload": {
        "armState": "ARMED_STAY"
      }
    },
    mocked: {
      openhab: {"name": "AlarmMode", "state": "away", "type": "String"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.SecurityPanelController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "AUTHORIZATION_REQUIRED",
            "message": "Unable to arm the security panel because authorization is required"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "disarm with pin code",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Disarm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": true, "exitDelay": 180},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              },
              "burglaryAlarm": {
                "parameters": {},
                "item": {"name": "BurglaryAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              }
            }
          })
        }
      },
      "payload": {
        "authorization": {
          "type": "FOUR_DIGIT_PIN",
          "value": "1234"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "AlarmMode", "state": "disarm:1234", "type": "String"},
        {"name": "BurglaryAlarm", "state": "OFF", "type": "Switch"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.SecurityPanelController",
            "name": "armState",
            "value": "DISARMED"
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": "disarm:1234"}
      ]
    }
  },
  {
    description: "disarm no pin code",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Disarm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": false, "exitDelay": 180},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              }
            }
          })
        }
      },
      "payload": {}
    },
    mocked: {
      openhab: {"name": "AlarmMode", "state": "disarm", "type": "String"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.SecurityPanelController",
            "name": "armState",
            "value": "DISARMED"
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": "disarm"}
      ]
    }
  },
  {
    description: "disarm unauthorized error",
    directive: {
      "header": {
        "namespace": "Alexa.SecurityPanelController",
        "name": "Disarm",
      },
      "endpoint": {
        "endpointId": "AlarmMode",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
                  "supportsPinCodes": true, "exitDelay": 180},
                "item": {"name": "AlarmMode", "type": "String"},
                "schema": {"name": "armState"}
              }
            }
          })
        }
      },
      "payload": {
        "authorization": {
          "type": "FOUR_DIGIT_PIN",
          "value": "1234"
        }
      }
    },
    mocked: {
      openhab: {"name": "AlarmMode", "state": "unauth", "type": "String"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.SecurityPanelController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "UNAUTHORIZED",
            "message": "Unable to disarm the security panel because the PIN code is not correct"
          }
        }
      },
      openhab: [
        {"name": "AlarmMode", "value": "disarm:1234"}
      ]
    }
  },
  {
    description: "alarm state report",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "gAlarmSystem",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SecurityPanelController": {
              "armState": {
                "parameters": {
                  "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"]},
                "item": {"name": "ArmState", "type": "String"},
                "schema": {"name": "armState"}
              },
              "burglaryAlarm": {
                "parameters": {},
                "item": {"name": "BurglaryAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              },
              "fireAlarm": {
                "parameters": {},
                "item": {"name": "FireAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              },
              "carbonMonoxideAlarm": {
                "parameters": {},
                "item": {"name": "CarbonMonoxideAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              },
              "waterAlarm": {
                "parameters": {},
                "item": {"name": "WaterAlarm", "type": "Switch"},
                "schema": {"name": "alarmState"}
              }
            }
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "ArmState", "state": "away", "type": "String"},
        {"name": "BurglaryAlarm", "state": "ON", "type": "Switch"},
        {"name": "FireAlarm", "state": "OFF", "type": "Switch"},
        {"name": "CarbonMonoxideAlarm", "state": "OFF", "type": "Switch"},
        {"name": "WaterAlarm", "state": "OFF", "type": "Switch"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.SecurityPanelController",
              "name": "armState",
              "value": "ARMED_AWAY"
            },
            {
              "namespace": "Alexa.SecurityPanelController",
              "name": "burglaryAlarm",
              "value": "ALARM"
            },
            {
              "namespace": "Alexa.SecurityPanelController",
              "name": "fireAlarm",
              "value": "OK"
            },
            {
              "namespace": "Alexa.SecurityPanelController",
              "name": "carbonMonoxideAlarm",
              "value": "OK"
            },
            {
              "namespace": "Alexa.SecurityPanelController",
              "name": "waterAlarm",
              "value": "OK"
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "StateReport"
          }
        }
      },
      openhab: []
    }
  }
];
