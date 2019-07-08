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
    description: "report state playback reporter",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PlaybackStateReporter": {
              "playbackState": {
                "parameters": {}, "item": {"name": "speakerPlayer", "type": "Player"},
                "schema": {"name": "playbackState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "speakerPlayer", "state": "PLAY", "type": "Player"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.PlaybackStateReporter",
              "name": "playbackState",
              "value": {
                "state": "PLAYING"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "StateReport"
          },
        }
      },
      openhab: []
    }
  }
];
