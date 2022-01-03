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

const { RequestError, StatusCodeError } = require('request-promise-native/errors');

module.exports = [
  {
    description: 'report state color item',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'light',
        cookie: {
          // backward compatibility cookie property map load test
          propertyMap: JSON.stringify({
            PowerController: {
              powerState: { parameters: {}, item: { name: 'light', type: 'Color' }, schema: { name: 'powerState' } }
            },
            BrightnessController: {
              brightness: { parameters: {}, item: { name: 'light', type: 'Color' }, schema: { name: 'brightness' } }
            },
            ColorController: {
              color: { parameters: {}, item: { name: 'light', type: 'Color' }, schema: { name: 'color' } }
            }
          })
        }
      }
    },
    items: [{ name: 'light', state: '0,0,42', type: 'Color' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'ON'
            },
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
              value: 42
            },
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 0,
                saturation: 0,
                brightness: 0.42
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state color in color mode',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'color', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { range: [2700, 6500] },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'color', state: '42,50,100', type: 'Color' },
      { name: 'colorTemperature', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 42,
                saturation: 0.5,
                brightness: 1
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state color in color mode (hue binding)',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'color', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Dimmer', binding: 'hue' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'color', state: '42,50,100', type: 'Color' },
      { name: 'colorTemperature', state: 'NULL', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 42,
                saturation: 0.5,
                brightness: 1
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state color temperature in white mode',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'colorLight', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { range: [2700, 6500] },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorLight', state: '0,0,100', type: 'Color' },
      { name: 'colorTemperature', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 4600
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state color temperature in white mode (hue binding)',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'colorLight', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'hue' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorLight', state: '0,50,100', type: 'Color' },
      { name: 'colorTemperature', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 4250
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state equalizer bands bass component',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'equalizerBass',
        cookie: {
          // backward compatibility cookie property map with component load test
          propertyMap: JSON.stringify({
            EqualizerController: {
              'bands:bass': {
                parameters: { range: { minimum: -5, maximum: 5 }, default: 1 },
                item: { name: 'equalizerBass', type: 'Number' },
                schema: { name: 'bands' }
              }
            }
          })
        }
      }
    },
    items: [{ name: 'equalizerBass', state: '1', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: 1
                }
              ]
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state contact sensor contact item',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'contact',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ContactSensor',
              property: 'detectionState',
              parameters: {},
              item: { name: 'contact', type: 'Contact' }
            }
          ])
        }
      }
    },
    items: [{ name: 'contact', state: 'OPEN', type: 'Contact' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ContactSensor',
              name: 'detectionState',
              value: 'DETECTED'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state contact sensor switch item',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'contact',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ContactSensor',
              property: 'detectionState',
              parameters: { inverted: true },
              item: { name: 'contact', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'contact', state: 'ON', type: 'Contact' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ContactSensor',
              name: 'detectionState',
              value: 'NOT_DETECTED'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state motion sensor',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'motion',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'MotionSensor',
              property: 'detectionState',
              parameters: { inverted: true },
              item: { name: 'motion', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'motion', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.MotionSensor',
              name: 'detectionState',
              value: 'DETECTED'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state number temperature item with state presentation',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'temperature',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'TemperatureSensor',
              property: 'temperature',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'temperature', type: 'Number:Temperature' }
            }
          ])
        }
      }
    },
    items: [
      {
        name: 'temperature',
        state: '68.0123456789 °F',
        type: 'Number:Temperature',
        stateDescription: { pattern: '%.1f °F' }
      }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.TemperatureSensor',
              name: 'temperature',
              value: {
                value: 68.0,
                scale: 'FAHRENHEIT'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state generic mode with property map cookie',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'mode1',
        cookie: {
          // backward compatibility cookie property map load test
          propertyMap: JSON.stringify({
            'ModeController:mode1': {
              mode: {
                parameters: {
                  supportedModes: 'FOO=foo,BAR=bar',
                  friendlyNames: '@Setting.Preset'
                },
                item: { name: 'mode1', type: 'String' },
                schema: { name: 'mode' }
              }
            }
          })
        }
      }
    },
    items: [{ name: 'mode', state: 'FOO', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ModeController',
              instance: 'mode1',
              name: 'mode',
              value: 'FOO'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial generic group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'ModeController',
              instance: 'Mode:mode1',
              property: 'mode',
              parameters: { capabilityNames: ['mode1'], supportedModes: { FOO: 'foo', BAR: 'bar' } },
              item: { name: 'mode1', type: 'String' }
            },
            {
              name: 'RangeController',
              instance: 'Range:range1',
              property: 'rangeValue',
              parameters: { capabilityNames: ['range1'] },
              item: { name: 'range1', type: 'Number' }
            },
            {
              name: 'ToggleController',
              instance: 'Toggle:toggle1',
              property: 'toggleState',
              parameters: { capabilityNames: ['toggle1'] },
              item: { name: 'toggle1', type: 'Switch' }
            },
            {
              name: 'ToggleController',
              instance: 'Toggle:toggle2',
              property: 'toggleState',
              parameters: { capabilityNames: ['toggle2'], inverted: true },
              item: { name: 'toggle2', type: 'Switch' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'OFF', type: 'Switch' },
      { name: 'mode1', state: 'UNDEF', type: 'String' },
      { name: 'range1', state: 'UNDEF', type: 'Number' },
      { name: 'toggle1', state: 'UNDEF', type: 'Switch' },
      { name: 'toggle2', state: 'UNDEF', type: 'Switch' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'OFF'
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial color light group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'brightness', type: 'Dimmer' }
            },
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'color', type: 'Color' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'ON', type: 'Switch' },
      { name: 'brightness', state: 'UNDEF', type: 'Dimmer' },
      { name: 'color', state: 'UNDEF', type: 'Color' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'ON'
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial white light group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'brightness', type: 'Dimmer' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Dimmer' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'UNDEF', type: 'Switch' },
      { name: 'brightness', state: '100', type: 'Dimmer' },
      { name: 'colorTemperature', state: 'UNDEF', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
              value: 100
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial lock group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'lock', type: 'Switch' }
            },
            {
              name: 'RangeController',
              instance: 'BatteryLevel',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.BatteryLevel'],
                nonControllable: true,
                supportedRange: [0, 100, 1],
                unitOfMeasure: 'Percent'
              },
              item: { name: 'batteryLevel', type: 'Number' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'lock', state: 'UNDEF', type: 'Switch' },
      { name: 'batteryLevel', state: '42', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'BatteryLevel',
              name: 'rangeValue',
              value: 42
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial sensor group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gSensor',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'MotionSensor',
              property: 'detectionState',
              parameters: {},
              item: { name: 'motion', type: 'Switch' }
            },
            {
              name: 'TemperatureSensor',
              property: 'temperature',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'temperature', type: 'Number' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'motion', state: 'UNDEF', type: 'Switch' },
      { name: 'temperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.TemperatureSensor',
              name: 'temperature',
              value: {
                value: 70.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial speaker group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'Speaker',
              property: 'volume',
              parameters: {},
              item: { name: 'speakerVolume', type: 'Dimmer' }
            },
            {
              name: 'Speaker',
              property: 'muted',
              parameters: {},
              item: { name: 'speakerMute', type: 'Switch' }
            },
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: {},
              item: { name: 'equalizerBass', type: 'Number' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'OFF', type: 'Switch' },
      { name: 'speakerVolume', state: 'UNDEF', type: 'Dimmer' },
      { name: 'speakerMute', state: 'UNDEF', type: 'Switch' },
      { name: 'equalizerBass', state: 'UNDEF', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'OFF'
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial switch group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gSwitch',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'PowerLevelController',
              property: 'powerLevel',
              parameters: {},
              item: { name: 'powerLevel', type: 'Dimmer' }
            },
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'percentage', type: 'Dimmer' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'OFF', type: 'Switch' },
      { name: 'powerLevel', state: 'UNDEF', type: 'Dimmer' },
      { name: 'percentage', state: 'UNDEF', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'OFF'
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial television group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gTelevision',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'power', type: 'Switch' }
            },
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            },
            {
              name: 'InputController',
              property: 'input',
              parameters: { supportedInputs: ['HDMI1'] },
              item: { name: 'input', type: 'String' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'power', state: 'OFF', type: 'Switch' },
      { name: 'channel', state: 'UNDEF', type: 'Dimmer' },
      { name: 'input', state: 'UNDEF', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'OFF'
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state partial thermostat group',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '70', type: 'Number' },
      { name: 'highTargetTemperature', state: 'UNDEF', type: 'Number' },
      { name: 'lowTargetTemperature', state: 'UNDEF', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 70.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.EndpointHealth',
              name: 'connectivity',
              value: {
                value: 'UNREACHABLE'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  },
  {
    description: 'report state context properties error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'switch1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'switch1', type: 'Switch' }
            },
            {
              name: 'EndpointHealth',
              property: 'connectivity',
              parameters: {}
            }
          ])
        }
      }
    },
    items: [{ name: 'switch1', state: 'NULL', type: 'Switch' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Unable to get context properties response.'
          }
        }
      }
    }
  },
  {
    description: 'report state server not accessible error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new RequestError(),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'BRIDGE_UNREACHABLE',
            message: 'Server not accessible'
          }
        }
      }
    }
  },
  {
    description: 'report state invalid item command value error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new StatusCodeError(400),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Invalid item command value'
          }
        }
      }
    }
  },
  {
    description: 'report state authentication failure error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new StatusCodeError(401),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_AUTHORIZATION_CREDENTIAL',
            message: 'Failed to authenticate'
          }
        }
      }
    }
  },
  {
    description: 'report state endpoint not found error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new StatusCodeError(404),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'NO_SUCH_ENDPOINT',
            message: 'Endpoint not found'
          }
        }
      }
    }
  },
  {
    description: 'report state internal syntax error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new SyntaxError(),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INTERNAL_ERROR',
            message: 'Internal error'
          }
        }
      }
    }
  },
  {
    description: 'report state internal type error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1'
      }
    },
    error: new TypeError(),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INTERNAL_ERROR',
            message: 'Internal error'
          }
        }
      }
    }
  },
  {
    description: 'report state endpoint not reachable default error',
    directive: {
      header: {
        namespace: 'Alexa',
        instance: 'foobar', // for code coverage
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'foobar1',
        cookie: { foobar: '{}' }
      }
    },
    error: new Error(),
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Endpoint not reachable'
          }
        }
      }
    }
  },
  {
    description: 'invalid directive error',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'FooBar'
      },
      endpoint: {
        endpointId: 'foobar1',
        cookie: {}
      }
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_DIRECTIVE',
            message: 'Unsupported directive Alexa/FooBar'
          }
        }
      }
    }
  }
];
