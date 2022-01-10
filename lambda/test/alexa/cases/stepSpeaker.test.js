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
    description: 'adjust volume steps',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'volume',
              parameters: { VOLUME_UP: 'VOLUP', VOLUME_DOWN: 'VOLDOWN' },
              item: { name: 'stepSpeakerVolume', type: 'String' }
            }
          ])
        }
      },
      payload: {
        volumeSteps: 2,
        volumeStepsDefault: false
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [
          { name: 'stepSpeakerVolume', value: 'VOLUP' },
          { name: 'stepSpeakerVolume', value: 'VOLUP' }
        ]
      }
    }
  },
  {
    description: 'adjust volume steps default up',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'volume',
              parameters: { VOLUME_UP: 'VOLUP', VOLUME_DOWN: 'VOLDOWN' },
              item: { name: 'stepSpeakerVolume', type: 'String' }
            }
          ])
        }
      },
      payload: {
        volumeSteps: 10,
        volumeStepsDefault: true
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'stepSpeakerVolume', value: 'VOLUP' }]
      }
    }
  },
  {
    description: 'adjust volume steps default down',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'volume',
              parameters: { VOLUME_UP: 'VOLUP', VOLUME_DOWN: 'VOLDOWN' },
              item: { name: 'stepSpeakerVolume', type: 'String' }
            }
          ])
        }
      },
      payload: {
        volumeSteps: -10,
        volumeStepsDefault: true
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'stepSpeakerVolume', value: 'VOLDOWN' }]
      }
    }
  },
  {
    description: 'adjust volume steps invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'muted',
              parameters: { MUTE: 'MUTE' },
              item: { name: 'stepSpeakerMute', type: 'String' }
            }
          ])
        }
      },
      payload: {
        volumeSteps: 10,
        volumeStepsDefault: true
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
            message: 'No volume property defined.'
          }
        }
      }
    }
  },
  {
    description: 'set mute',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'SetMute'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'muted',
              parameters: { MUTE: 'MUTE' },
              item: { name: 'stepSpeakerMute', type: 'String' }
            }
          ])
        }
      },
      payload: {
        mute: true
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'stepSpeakerMute', value: 'MUTE' }]
      }
    }
  },
  {
    description: 'set mute invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.StepSpeaker',
        name: 'SetMute'
      },
      endpoint: {
        endpointId: 'gStepSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'StepSpeaker',
              property: 'volume',
              parameters: { VOLUME_UP: 'VOLUP', VOLUME_DOWN: 'VOLDOWN' },
              item: { name: 'stepSpeakerVolume', type: 'String' }
            }
          ])
        }
      },
      payload: {
        mute: true
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
            message: 'No muted property defined.'
          }
        }
      }
    }
  }
];
