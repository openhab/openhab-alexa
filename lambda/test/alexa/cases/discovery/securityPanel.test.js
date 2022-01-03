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

module.exports = {
  description: 'security panel',
  items: [
    {
      type: 'Group',
      name: 'gSecurityPanel1',
      label: 'Security Panel 1',
      metadata: {
        alexa: {
          value: 'SecurityPanel'
        }
      }
    },
    {
      type: 'String',
      name: 'armState1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'ArmState',
          config: {
            supportedArmStates: 'DISARMED,ARMED_STAY,ARMED_AWAY',
            pinCodes: '1234,9876',
            exitDelay: 180
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'alarmAlert1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'AlarmAlert'
        }
      }
    },
    {
      type: 'Switch',
      name: 'readyAlert1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'ReadyAlert'
        }
      }
    },
    {
      type: 'Switch',
      name: 'troubleAlert1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'TroubleAlert'
        }
      }
    },
    {
      type: 'Switch',
      name: 'zonesAlert1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'ZonesAlert'
        }
      }
    },
    {
      type: 'Switch',
      name: 'burglaryAlarm1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'BurglaryAlarm'
        }
      }
    },
    {
      type: 'Switch',
      name: 'fireAlarm1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'FireAlarm'
        }
      }
    },
    {
      type: 'Switch',
      name: 'carbonMonoxideAlarm1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'CarbonMonoxideAlarm'
        }
      }
    },
    {
      type: 'Switch',
      name: 'waterAlarm1',
      groupNames: ['gSecurityPanel1'],
      metadata: {
        alexa: {
          value: 'WaterAlarm'
        }
      }
    },
    {
      // Number item type state mapping no supportedArmStates
      type: 'Number',
      name: 'armMode2',
      label: 'Security Panel Arm Mode 2',
      metadata: {
        alexa: {
          value: 'ArmState',
          config: {
            DISARMED: 0,
            ARMED_STAY: 1,
            ARMED_AWAY: 2,
            exitDelay: 300,
            pinCodes: '42'
          }
        }
      }
    },
    {
      // Switch item type default config
      type: 'Switch',
      name: 'armMode3',
      label: 'Security Panel Arm Mode 3',
      metadata: {
        alexa: {
          value: 'ArmState'
        }
      }
    },
    {
      type: 'Contact',
      name: 'burglaryAlarm3',
      label: 'Security Panel Burglary Alarm 3',
      metadata: {
        alexa: {
          value: 'BurglaryAlarm',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gSecurityPanel99',
      label: 'Invalid Security Panel',
      metadata: {
        alexa: {
          value: 'SecurityPanel'
        }
      }
    },
    {
      // Invalid arm state because of missing supportedArmStates
      type: 'String',
      name: 'armState99',
      groupNames: ['gSecurityPanel99'],
      metadata: {
        alexa: {
          value: 'ArmState',
          config: {
            supportedArmStates: 'ARMED_AWAY'
          }
        }
      }
    },
    {
      // Ignored security alert because linked arm state not valid
      type: 'Switch',
      name: 'alarmAlert99',
      groupNames: ['gSecurityPanel99'],
      metadata: {
        alexa: {
          value: 'AlarmAlert'
        }
      }
    }
  ],
  expected: {
    gSecurityPanel1: {
      capabilities: [
        'Alexa.SecurityPanelController.armState',
        'Alexa.SecurityPanelController.burglaryAlarm',
        'Alexa.SecurityPanelController.fireAlarm',
        'Alexa.SecurityPanelController.carbonMonoxideAlarm',
        'Alexa.SecurityPanelController.waterAlarm',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['SECURITY_PANEL'],
      friendlyName: 'Security Panel 1',
      configuration: {
        'Alexa.SecurityPanelController': {
          supportedArmStates: [{ value: 'DISARMED' }, { value: 'ARMED_STAY' }, { value: 'ARMED_AWAY' }],
          supportedAuthorizationTypes: [{ type: 'FOUR_DIGIT_PIN' }]
        }
      },
      cookie: [
        {
          name: 'SecurityPanelController',
          property: 'armState',
          parameters: {
            supportedArmStates: ['DISARMED', 'ARMED_STAY', 'ARMED_AWAY'],
            pinCodes: ['1234', '9876'],
            exitDelay: 180
          },
          item: { name: 'armState1', type: 'String' }
        },
        {
          name: 'SecurityPanelController',
          property: 'alarmAlert',
          parameters: {},
          item: { name: 'alarmAlert1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'readyAlert',
          parameters: {},
          item: { name: 'readyAlert1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'troubleAlert',
          parameters: {},
          item: { name: 'troubleAlert1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'zonesAlert',
          parameters: {},
          item: { name: 'zonesAlert1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'burglaryAlarm',
          parameters: {},
          item: { name: 'burglaryAlarm1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'fireAlarm',
          parameters: {},
          item: { name: 'fireAlarm1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'carbonMonoxideAlarm',
          parameters: {},
          item: { name: 'carbonMonoxideAlarm1', type: 'Switch' }
        },
        {
          name: 'SecurityPanelController',
          property: 'waterAlarm',
          parameters: {},
          item: { name: 'waterAlarm1', type: 'Switch' }
        }
      ]
    },
    armMode2: {
      capabilities: ['Alexa.SecurityPanelController.armState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SECURITY_PANEL'],
      friendlyName: 'Security Panel Arm Mode 2',
      configuration: {
        'Alexa.SecurityPanelController': {
          supportedArmStates: [{ value: 'ARMED_AWAY' }, { value: 'ARMED_STAY' }, { value: 'DISARMED' }]
        }
      },
      cookie: [
        {
          name: 'SecurityPanelController',
          property: 'armState',
          parameters: {
            DISARMED: 0,
            ARMED_STAY: 1,
            ARMED_AWAY: 2,
            pinCodes: [],
            exitDelay: 255
          },
          item: { name: 'armMode2', type: 'Number' }
        }
      ]
    },
    armMode3: {
      capabilities: ['Alexa.SecurityPanelController.armState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SECURITY_PANEL'],
      friendlyName: 'Security Panel Arm Mode 3',
      configuration: {
        'Alexa.SecurityPanelController': {
          supportedArmStates: [{ value: 'DISARMED' }, { value: 'ARMED_STAY' }]
        }
      },
      cookie: [
        {
          name: 'SecurityPanelController',
          property: 'armState',
          parameters: {},
          item: { name: 'armMode3', type: 'Switch' }
        }
      ]
    },
    burglaryAlarm3: {
      capabilities: ['Alexa.SecurityPanelController.burglaryAlarm', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SECURITY_PANEL'],
      friendlyName: 'Security Panel Burglary Alarm 3',
      cookie: [
        {
          name: 'SecurityPanelController',
          property: 'burglaryAlarm',
          parameters: { inverted: true },
          item: { name: 'burglaryAlarm3', type: 'Contact' }
        }
      ]
    }
  }
};
