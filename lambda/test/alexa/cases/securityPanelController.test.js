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

module.exports = [
  {
    description: 'arm away no delay string item',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'alarmAlert',
              parameters: { inverted: true },
              item: { name: 'AlarmAlert', type: 'Contact' }
            },
            {
              name: 'SecurityPanelController',
              property: 'burglaryAlarm',
              parameters: { inverted: true },
              item: { name: 'BurglaryAlarm', type: 'Contact' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_AWAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'disarmed', type: 'String' },
      { name: 'AlarmAlert', state: 'OPEN', type: 'Contact' },
      { name: 'ArmMode', state: 'away', type: 'String' },
      { name: 'BurglaryAlarm', state: 'OPEN', type: 'Contact' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'ARMED_AWAY'
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'burglaryAlarm',
              value: {
                value: 'OK'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'Arm.Response'
          },
          payload: {}
        }
      },
      openhab: {
        commands: [{ name: 'ArmMode', value: 'away' }]
      }
    }
  },
  {
    description: 'arm away delay string item',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED'],
                exitDelay: 180
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'alarmAlert',
              parameters: {},
              item: { name: 'AlarmAlert', type: 'Contact' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_AWAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'disarmed', type: 'String' },
      { name: 'AlarmAlert', state: 'NULL', type: 'Contact' },
      { name: 'ArmMode', state: 'away', type: 'String' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'ARMED_AWAY'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'Arm.Response'
          },
          payload: {
            exitDelayInSeconds: 180
          }
        }
      },
      openhab: {
        commands: [{ name: 'ArmMode', value: 'away' }]
      }
    }
  },
  {
    description: 'arm stay no delay number item',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                DISARMED: 0,
                ARMED_STAY: 1,
                ARMED_AWAY: 2,
                exitDelay: 180,
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [
      { name: 'ArmMode', state: '0', type: 'Number' },
      { name: 'ArmMode', state: '1', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'ARMED_STAY'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'Arm.Response'
          },
          payload: {}
        }
      },
      openhab: {
        commands: [{ name: 'ArmMode', value: 1 }]
      }
    }
  },
  {
    description: 'arm no properties invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          // workaround bug introduced by previous version
          propertyMap: JSON.stringify({
            SecurityPanelController: {}
          })
        }
      },
      payload: {
        armState: 'ARMED_AWAY'
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
            type: 'INVALID_VALUE',
            message: 'The security panel has no properties defined.'
          }
        }
      }
    }
  },
  {
    description: 'arm no state property invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'burglaryAlarm',
              parameters: {},
              item: { name: 'BurglaryAlarm', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_AWAY'
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
            type: 'INVALID_VALUE',
            message: 'The security panel has no arm state property.'
          }
        }
      }
    }
  },
  {
    description: 'arm unsupported invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                DISARMED: 'OFF',
                ARMED_STAY: 'ON',
                supportedArmStates: ['ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_AWAY'
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
            type: 'INVALID_VALUE',
            message: "The security panel doesn't support ARMED_AWAY state."
          }
        }
      }
    }
  },
  {
    description: 'arm authorization required error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [{ name: 'ArmMode', state: 'away', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'AUTHORIZATION_REQUIRED',
            message: 'Unable to arm the security panel because it is currently in armed away mode.'
          }
        }
      }
    }
  },
  {
    description: 'arm bypass needed error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'zonesAlert',
              parameters: { inverted: true },
              item: { name: 'ZonesAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'away', type: 'String' },
      { name: 'ZonesAlert', state: 'OFF', type: 'Switch' }
    ],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'BYPASS_NEEDED',
            message: 'Unable to arm the security panel because it has open zones that must be bypassed.'
          }
        }
      }
    }
  },
  {
    description: 'arm not ready error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'readyAlert',
              parameters: {},
              item: { name: 'ReadyAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'away', type: 'String' },
      { name: 'ReadyAlert', state: 'ON', type: 'Switch' }
    ],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'NOT_READY',
            message: 'Unable to arm the security panel because it is not ready.'
          }
        }
      }
    }
  },
  {
    description: 'arm uncleard alarm error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'alarmAlert',
              parameters: {},
              item: { name: 'AlarmAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'away', type: 'String' },
      { name: 'AlarmAlert', state: 'ON', type: 'Switch' }
    ],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'UNCLEARED_ALARM',
            message: 'Unable to arm the security panel because it is in alarm status.'
          }
        }
      }
    }
  },
  {
    description: 'arm uncleard trouble error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Arm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'troubleAlert',
              parameters: {},
              item: { name: 'TroubleAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        armState: 'ARMED_STAY'
      }
    },
    items: [
      { name: 'ArmMode', state: 'away', type: 'String' },
      { name: 'TroubleAlert', state: 'ON', type: 'Switch' }
    ],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'UNCLEARED_TROUBLE',
            message: 'Unable to arm the security panel because it is in trouble status.'
          }
        }
      }
    }
  },
  {
    description: 'disarm with pin code',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED'],
                pinCodes: ['1234']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'burglaryAlarm',
              parameters: {},
              item: { name: 'BurglaryAlarm', type: 'Contact' }
            },
            {
              name: 'SecurityPanelController',
              property: 'fireAlarm',
              parameters: {},
              item: { name: 'FireAlarm', type: 'Contact' }
            }
          ])
        }
      },
      payload: {
        authorization: {
          type: 'FOUR_DIGIT_PIN',
          value: '1234'
        }
      }
    },
    items: [
      { name: 'ArmMode', state: 'disarmed', type: 'String' },
      { name: 'BurglaryAlarm', state: 'CLOSED', type: 'Contact' },
      { name: 'FireAlarm', state: 'NULL', type: 'Contact' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'DISARMED'
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'burglaryAlarm',
              value: {
                value: 'OK'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'ArmMode', value: 'disarmed' }]
      }
    }
  },
  {
    description: 'disarm no pin code',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            }
          ])
        }
      },
      payload: {}
    },
    items: [{ name: 'ArmMode', state: 'disarmed', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'DISARMED'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'ArmMode', value: 'disarmed' }]
      }
    }
  },
  {
    description: 'disarm no properties invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          // workaround bug introduced by previous version
          propertyMap: JSON.stringify({
            SecurityPanelController: {}
          })
        }
      },
      payload: {}
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'The security panel has no properties defined.'
          }
        }
      }
    }
  },
  {
    description: 'disarm no state property invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'burglaryAlarm',
              parameters: {},
              item: { name: 'BurglaryAlarm', type: 'Switch' }
            }
          ])
        }
      },
      payload: {}
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'The security panel has no arm state property.'
          }
        }
      }
    }
  },
  {
    description: 'disarm unauthorized error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED'],
                pinCodes: ['9876']
              },
              item: { name: 'ArmMode', type: 'String' }
            }
          ])
        }
      },
      payload: {
        authorization: {
          type: 'FOUR_DIGIT_PIN',
          value: '1234'
        }
      }
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'UNAUTHORIZED',
            message: 'Unable to disarm the security panel because the PIN code is not correct.'
          }
        }
      }
    }
  },
  {
    description: 'disarm not ready error',
    directive: {
      header: {
        namespace: 'Alexa.SecurityPanelController',
        name: 'Disarm'
      },
      endpoint: {
        endpointId: 'gSecurityPanel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'readyAlert',
              parameters: {},
              item: { name: 'ReadyAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {}
    },
    items: [{ name: 'ReadyAlert', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.SecurityPanelController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'NOT_READY',
            message: 'Unable to disarm the security panel because it is not ready.'
          }
        }
      }
    }
  },
  {
    description: 'alarm state report',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'gAlarmSystem',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SecurityPanelController',
              property: 'armState',
              parameters: {
                supportedArmStates: ['ARMED_AWAY', 'ARMED_STAY', 'DISARMED']
              },
              item: { name: 'ArmMode', type: 'String' }
            },
            {
              name: 'SecurityPanelController',
              property: 'burglaryAlarm',
              parameters: { inverted: true },
              item: { name: 'BurglaryAlarm', type: 'Switch' }
            },
            {
              name: 'SecurityPanelController',
              property: 'fireAlarm',
              parameters: { inverted: true },
              item: { name: 'FireAlarm', type: 'Switch' }
            },
            {
              name: 'SecurityPanelController',
              property: 'carbonMonoxideAlarm',
              parameters: { inverted: true },
              item: { name: 'CarbonMonoxideAlarm', type: 'Switch' }
            },
            {
              name: 'SecurityPanelController',
              property: 'waterAlarm',
              parameters: { inverted: true },
              item: { name: 'WaterAlarm', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'ArmState', state: 'away', type: 'String' },
      { name: 'BurglaryAlarm', state: 'OFF', type: 'Switch' },
      { name: 'FireAlarm', state: 'ON', type: 'Switch' },
      { name: 'CarbonMonoxideAlarm', state: 'ON', type: 'Switch' },
      { name: 'WaterAlarm', state: 'ON', type: 'Switch' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'armState',
              value: 'ARMED_AWAY'
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'burglaryAlarm',
              value: {
                value: 'ALARM'
              }
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'fireAlarm',
              value: {
                value: 'OK'
              }
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'carbonMonoxideAlarm',
              value: {
                value: 'OK'
              }
            },
            {
              namespace: 'Alexa.SecurityPanelController',
              name: 'waterAlarm',
              value: {
                value: 'OK'
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
  }
];
