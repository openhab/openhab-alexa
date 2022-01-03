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
  description: 'speaker',
  items: [
    {
      type: 'Group',
      name: 'gSpeaker1',
      label: 'Speaker 1',
      metadata: {
        alexa: {
          value: 'Speaker'
        }
      }
    },
    {
      type: 'Switch',
      name: 'mute1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'MuteState'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'volume1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'VolumeLevel'
        }
      }
    },
    {
      type: 'Number',
      name: 'equalizerBass1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'EqualizerBass',
          config: {
            defaultLevel: 0,
            range: '-5:5'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'equalizerMidrange1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'EqualizerMidrange',
          config: {
            defaultLevel: 0,
            range: '-5:5'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'equalizerTreble1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'EqualizerTreble',
          config: {
            defaultLevel: 0,
            range: '-5:5'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'equalizerMode1',
      groupNames: ['gSpeaker1'],
      metadata: {
        alexa: {
          value: 'EqualizerMode',
          config: {
            supportedModes: 'MOVIE,TV,FOOBAR'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'speaker2',
      label: 'Speaker 2',
      metadata: {
        alexa: {
          value: 'Speaker'
        }
      }
    },
    {
      type: 'Number',
      name: 'equalizerBass3',
      label: 'Speaker Equalizer Bass 3',
      metadata: {
        alexa: {
          value: 'EqualizerBass'
        }
      }
    },
    {
      type: 'Number',
      name: 'equalizerMode3',
      label: 'Speaker Equalizer Mode 3',
      metadata: {
        alexa: {
          value: 'EqualizerMode'
        }
      }
    },
    {
      type: 'Number',
      name: 'volume3',
      label: 'Speaker Volume 3',
      metadata: {
        alexa: {
          value: 'VolumeLevel'
        }
      }
    },
    {
      // valid capability because bass & treble not reserved names for mode resources
      type: 'String',
      name: 'speakerMode3',
      label: 'Speaker Mode 3',
      metadata: {
        alexa: {
          value: 'Speaker.Mode',
          config: {
            capabilityNames: 'Bands',
            supportedModes: 'Bass,Treble'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'volume4',
      label: 'Speaker Volume 4',
      metadata: {
        alexa: {
          value: 'Speaker.volume' // backward compatibility
        }
      }
    }
  ],
  expected: {
    gSpeaker1: {
      capabilities: [
        'Alexa.Speaker.muted',
        'Alexa.Speaker.volume',
        'Alexa.EqualizerController.bands',
        'Alexa.EqualizerController.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker 1',
      parameters: {
        'Alexa.EqualizerController.configurations': {
          bands: {
            supported: [{ name: 'BASS' }, { name: 'MIDRANGE' }, { name: 'TREBLE' }],
            range: { minimum: -5, maximum: 5 }
          },
          modes: {
            supported: [{ name: 'MOVIE' }, { name: 'TV' }]
          }
        }
      },
      cookie: [
        {
          name: 'EqualizerController',
          property: 'bands',
          component: 'bass',
          parameters: { defaultLevel: 0, range: [-5, 5] },
          item: { name: 'equalizerBass1', type: 'Number' }
        },
        {
          name: 'EqualizerController',
          property: 'bands',
          component: 'midrange',
          parameters: { defaultLevel: 0, range: [-5, 5] },
          item: { name: 'equalizerMidrange1', type: 'Number' }
        },
        {
          name: 'EqualizerController',
          property: 'bands',
          component: 'treble',
          parameters: { defaultLevel: 0, range: [-5, 5] },
          item: { name: 'equalizerTreble1', type: 'Number' }
        },
        {
          name: 'EqualizerController',
          property: 'mode',
          parameters: { supportedModes: ['MOVIE', 'TV'] },
          item: { name: 'equalizerMode1', type: 'String' }
        }
      ]
    },
    speaker2: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker 2'
    },
    equalizerBass3: {
      capabilities: ['Alexa.EqualizerController.bands', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker Equalizer Bass 3',
      parameters: {
        'Alexa.EqualizerController.configurations': {
          bands: {
            supported: [{ name: 'BASS' }],
            range: { minimum: -10, maximum: 10 }
          }
        }
      }
    },
    equalizerMode3: {
      capabilities: ['Alexa.EqualizerController.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker Equalizer Mode 3',
      parameters: {
        'Alexa.EqualizerController.configurations': {
          modes: {
            supported: [{ name: 'MOVIE' }, { name: 'MUSIC' }, { name: 'NIGHT' }, { name: 'SPORT' }, { name: 'TV' }]
          }
        }
      }
    },
    volume3: {
      capabilities: ['Alexa.Speaker.volume', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker Volume 3'
    },
    speakerMode3: {
      capabilities: ['Alexa.ModeController:speakerMode3.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker Mode 3',
      configuration: {
        'Alexa.ModeController:speakerMode3': {
          ordered: false,
          supportedModes: {
            Bass: {
              friendlyNames: [
                'text:Bass:en-AU',
                'text:Bass:en-CA',
                'text:Bass:en-GB',
                'text:Bass:en-IN',
                'text:Bass:en-US'
              ]
            },
            Treble: {
              friendlyNames: [
                'text:Treble:en-AU',
                'text:Treble:en-CA',
                'text:Treble:en-GB',
                'text:Treble:en-IN',
                'text:Treble:en-US'
              ]
            }
          }
        }
      }
    },
    volume4: {
      capabilities: ['Alexa.Speaker.volume', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SPEAKER'],
      friendlyName: 'Speaker Volume 4'
    }
  }
};
