/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
    description: "play request",
    directive: {
      "header": {
        "namespace": "Alexa.PlaybackController",
        "name": "Play"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PlaybackController": {
              "playback": {
                "parameters": {}, "item": {"name": "speakerPlayer"}, "schema": {"name": "playbackCommand"}}}
          })
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "context": {
          "properties": []
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "speakerPlayer", "value": "PLAY"}
      ]
    }
  }
];
