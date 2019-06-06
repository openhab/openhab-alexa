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

module.exports = {
  description: "speaker player enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/speakerMute",
          "type": "Switch",
          "name": "speakerMute",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "Speaker.muted"
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/speakerVolume",
          "type": "Dimmer",
          "name": "speakerVolume",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "Speaker.volume"
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/speakerPlayer",
          "type": "Player",
          "name": "speakerPlayer",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "PlaybackController.playback,PlaybackStateReporter.playbackState"
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/equalizerBass",
          "type": "Number",
          "name": "equalizerBass",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "EqualizerController.bands:bass",
              "config": {
                "range": "-5:5"
              }
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/equalizerMidrange",
          "type": "Number",
          "name": "equalizerMidrange",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "EqualizerController.bands:midrange",
              "config": {
                "range": "-5:5"
              }
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/equalizerTreble",
          "type": "Number",
          "name": "equalizerTreble",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "EqualizerController.bands:treble",
              "config": {
                "range": "-5:5"
              }
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/equalizerInvalid",
          "type": "Number",
          "name": "equalizerInvalid",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "EqualizerController.bands:invalid",
              "config": {
                "range": "-5:5"
              }
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/equalizerMode",
          "type": "String",
          "name": "equalizerMode",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "EqualizerController.modes",
              "config": {
                "supportedModes": "MOVIE,TV,FOOBAR"
              }
            }
          },
          "groupNames": ["gSpeaker"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gSpeaker",
      "type": "Group",
      "name": "gSpeaker",
      "label": "Speaker",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Speaker"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gSpeaker": {
      "capabilities": [
        "Alexa",
        "Alexa.Speaker.muted",
        "Alexa.Speaker.volume",
        "Alexa.PlaybackController",
        "Alexa.PlaybackStateReporter.playbackState",
        "Alexa.EqualizerController.bands",
        "Alexa.EqualizerController.modes",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SPEAKER"],
      "friendlyName": "Speaker",
      "parameters": {
        "Alexa.EqualizerController.configurations": {
          "bands": {
            "supported": [{"name": "BASS"}, {"name": "MIDRANGE"}, {"name": "TREBLE"}],
            "range": {"minimum": -5, "maximum": 5}
          },
          "modes": {
            "supported": [{"name": "MOVIE"}, {"name": "TV"}]
          }
        },
        "Alexa.PlaybackController.supportedOperations": [
          'Play', 'Pause', 'Next', 'Previous', 'Rewind', 'FastForward'
        ]
      },
      "propertyMap": {
        "EqualizerController": {
          "bands:bass": {
            "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
            "item": {"name": "equalizerBass", "type": "Number"},
            "schema": {"name": "equalizerBands"}
          },
          "bands:midrange": {
            "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
            "item": {"name": "equalizerMidrange", "type": "Number"},
            "schema": {"name": "equalizerBands"}
          },
          "bands:treble": {
            "parameters": {"range": {"minimum": -5, "maximum": 5}, "default": 0},
            "item": {"name": "equalizerTreble", "type": "Number"},
            "schema": {"name": "equalizerBands"}
          },
          "modes": {
            "parameters": {"supportedModes": ["MOVIE", "TV"]},
            "item": {"name": "equalizerMode", "type": "String"},
            "schema": {"name": "equalizerMode"}
          }
        }
      }
    }
  }
};
