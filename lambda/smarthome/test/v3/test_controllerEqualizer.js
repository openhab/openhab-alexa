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
    description: "set bands",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "SetBands"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "bands:bass": {
                "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
                "item": {"name": "equalizerBass", "type": "Number"}, "schema": {"name": "equalizerBands"}
              },
              "bands:treble": {
                "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
                "item": {"name": "equalizerTreble", "type": "Number"}, "schema": {"name": "equalizerBands"}
              },
              "modes": {
                "parameters": {"supportedModes": ["MOVIE", "TV"]},
                "item": {"name": "equalizerMode", "type": "String"}, "schema": {"name": "equalizerMode"}
              }
            }
          })
        }
      },
      "payload": {
        "bands": [
          {"name": "BASS", "level": -2}
        ]
      }
    },
    mocked: {
      openhab: [
        {"name": "equalizerBass", "state": "-2", "type": "Number"},
        {"name": "equalizerTreble", "state": "2", "type": "Number"},
        {"name": "equalizerMode", "state": "movie", "type": "String"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.EqualizerController",
              "name": "bands",
              "value": [
                {
                  "name": "BASS",
                  "value": -2
                },
                {
                  "name": "TREBLE",
                  "value": 2
                }
              ]
            },
            {
              "namespace": "Alexa.EqualizerController",
              "name": "mode",
              "value": "MOVIE"
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "equalizerBass", "value": -2}
      ]
    }
  },
  {
    description: "adjust bands with level delta",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "AdjustBands"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "bands:bass": {
                "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
                "item": {"name": "equalizerBass", "type": "Number"}, "schema": {"name": "equalizerBands"}
              }
            }
          })
        }
      },
      "payload": {
        "bands": [
          {"name": "BASS", "levelDelta": 7, "levelDirection": "DOWN"}
        ]
      }
    },
    mocked: {
      openhab: [
        {"name": "equalizerBass", "state": "1", "type": "Number"},
        {"name": "equalizerBass", "state": "-5", "type": "Number"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EqualizerController",
            "name": "bands",
            "value": [{
              "name": "BASS",
              "value": -5
            }]
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
        {"name": "equalizerBass", "value": -5}
      ]
    }
  },
  {
    description: "adjust bands no level delta number item",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "AdjustBands"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "bands:bass": {
                "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0, "increment": 3},
                "item": {"name": "equalizerBass", "type": "Number"}, "schema": {"name": "equalizerBands"}
              }
            }
          })
        }
      },
      "payload": {
        "bands": [
          {"name": "BASS", "levelDirection": "DOWN"}
        ]
      }
    },
    mocked: {
      openhab: [
        {"name": "equalizerBass", "state": "1", "type": "Number"},
        {"name": "equalizerBass", "state": "-2", "type": "Number"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EqualizerController",
            "name": "bands",
            "value": [{
              "name": "BASS",
              "value": -2
            }]
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
        {"name": "equalizerBass", "value": -2}
      ]
    }
  },
  {
    description: "adjust bands no level delta dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "AdjustBands"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "bands:bass": {
                "parameters": {"range": {"minimum": 0, "maximum": 100}, "default": 50},
                "item": {"name": "equalizerBass", "type": "Dimmer"}, "schema": {"name": "equalizerBands"}
              }
            }
          })
        }
      },
      "payload": {
        "bands": [
          {"name": "BASS", "levelDirection": "UP"}
        ]
      }
    },
    mocked: {
      openhab: [
        {"name": "equalizerBass", "state": "50", "type": "Dimmer"},
        {"name": "equalizerBass", "state": "60", "type": "Dimmer"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EqualizerController",
            "name": "bands",
            "value": [{
              "name": "BASS",
              "value": 60
            }]
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
        {"name": "equalizerBass", "value": 'INCREASE'}
      ]
    }
  },
  {
    description: "reset bands",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "ResetBands"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "bands:bass": {
                "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
                "item": {"name": "equalizerBass", "type": "Number"}, "schema": {"name": "equalizerBands"}
              }
            }
          })
        }
      },
      "payload": {
        "bands": [
          {"name": "BASS"}
        ]
      }
    },
    mocked: {
      openhab: {"name": "equalizerBass", "state": "0", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EqualizerController",
            "name": "bands",
            "value": [{
              "name": "BASS",
              "value": 0
            }]
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
        {"name": "equalizerBass", "value": 0}
      ]
    }
  },
  {
    description: "set mode",
    directive: {
      "header": {
        "namespace": "Alexa.EqualizerController",
        "name": "SetMode"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "EqualizerController": {
              "modes": {
                "parameters": {"supportedModes": ["MOVIE", "TV"]},
                "item": {"name": "equalizerMode", "type": "String"}, "schema": {"name": "equalizerMode"}
              }
            }
          })
        }
      },
      "payload": {
        "mode": "MOVIE"
      }
    },
    mocked: {
      openhab: {"name": "equalizerMode", "state": "movie", "type": "String"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EqualizerController",
            "name": "mode",
            "value": "MOVIE"
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
        {"name": "equalizerMode", "value": "movie"}
      ]
    }
  }
];
