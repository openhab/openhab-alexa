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
    description: 'adjust volume steps no default',
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
              parameters: {},
              item: { name: 'stepSpeakerVolume', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        volumeSteps: 10,
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
      openhab: [{ name: 'stepSpeakerVolume', value: 10 }]
    }
  },
  {
    description: 'adjust volume steps default no increment parameter',
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
              parameters: {},
              item: { name: 'stepSpeakerVolume', type: 'Number' }
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
      openhab: [{ name: 'stepSpeakerVolume', value: -10 }]
    }
  },
  {
    description: 'adjust volume steps up default with increment parameter',
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
              parameters: { increment: 5 },
              item: { name: 'stepSpeakerVolume', type: 'Number' }
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
      openhab: [{ name: 'stepSpeakerVolume', value: 5 }]
    }
  },
  {
    description: 'adjust volume steps down default with increment parameter',
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
              parameters: { increment: 5 },
              item: { name: 'stepSpeakerVolume', type: 'Number' }
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
      openhab: [{ name: 'stepSpeakerVolume', value: -5 }]
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
              parameters: {},
              item: { name: 'stepSpeakerMute', type: 'Switch' }
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
    description: 'set mute volume',
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
              parameters: {},
              item: { name: 'stepSpeakerMute', type: 'Switch' }
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
      openhab: [{ name: 'stepSpeakerMute', value: 'ON' }]
    }
  }
];
