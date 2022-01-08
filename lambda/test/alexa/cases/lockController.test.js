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
    description: 'lock',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'doorLock', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'doorLock', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'LOCKED'
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
        commands: [{ name: 'doorLock', value: 'ON' }]
      }
    }
  },
  {
    description: 'lock inverted',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: { inverted: true },
              item: { name: 'doorLock', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'doorLock', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'LOCKED'
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
        commands: [{ name: 'doorLock', value: 'OFF' }]
      }
    }
  },
  {
    description: 'unlock',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Unlock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'doorLock', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'doorLock', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'UNLOCKED'
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
        commands: [{ name: 'doorLock', value: 'OFF' }]
      }
    }
  },
  {
    description: 'unlock inverted',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Unlock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: { inverted: true },
              item: { name: 'doorLock', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'doorLock', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'UNLOCKED'
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
        commands: [{ name: 'doorLock', value: 'ON' }]
      }
    }
  },
  {
    description: 'lock decouple state contact item',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'targetDoorLock', type: 'Switch' }
            },
            {
              name: 'LockController',
              property: 'lockState',
              tag: 'sensor',
              parameters: {},
              item: { name: 'currentDoorLock', type: 'Contact' }
            }
          ])
        }
      }
    },
    items: [{ name: 'currentDoorLock', state: 'CLOSED', type: 'Contact' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'LOCKED'
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
        commands: [{ name: 'targetDoorLock', value: 'ON' }]
      }
    }
  },
  {
    description: 'lock decouple state number item',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'targetDoorLock', type: 'Switch' }
            },
            {
              name: 'LockController',
              property: 'lockState',
              tag: 'sensor',
              parameters: {},
              item: { name: 'currentDoorLock', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'currentDoorLock', state: '1', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'LOCKED'
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
        commands: [{ name: 'targetDoorLock', value: 'ON' }]
      }
    }
  },
  {
    description: 'lock decouple state string item',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'targetDoorLock', type: 'Switch' }
            },
            {
              name: 'LockController',
              property: 'lockState',
              tag: 'sensor',
              parameters: {},
              item: { name: 'currentDoorLock', type: 'String' }
            }
          ])
        }
      }
    },
    items: [{ name: 'currentDoorLock', state: 'locked', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'LOCKED'
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
        commands: [{ name: 'targetDoorLock', value: 'ON' }]
      }
    }
  },
  {
    description: 'lock jammed decouple state item',
    directive: {
      header: {
        namespace: 'Alexa.LockController',
        name: 'Lock'
      },
      endpoint: {
        endpointId: 'doorLock',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'LockController',
              property: 'lockState',
              parameters: {},
              item: { name: 'targetDoorLock', type: 'Switch' }
            },
            {
              name: 'LockController',
              property: 'lockState',
              tag: 'sensor',
              parameters: { LOCKED: 1, UNLOCKED: 2, JAMMED: 42 },
              item: { name: 'currentDoorLock', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'currentDoorLock', state: '42', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.LockController',
              name: 'lockState',
              value: 'JAMMED'
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
        commands: [{ name: 'targetDoorLock', value: 'ON' }]
      }
    }
  }
];
