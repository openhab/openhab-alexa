module.exports = {
  description: "step speaker enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/stepSpeakerMute",
          "type": "Switch",
          "name": "stepSpeakerMute",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "StepSpeaker.muted"
            }
          },
          "groupNames": ["gStepSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/stepSpeakerVolume",
          "type": "Dimmer",
          "name": "stepSpeakerVolume",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "StepSpeaker.volume"
            }
          },
          "groupNames": ["gStepSpeaker"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gStepSpeaker",
      "type": "Group",
      "name": "gStepSpeaker",
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
    "gStepSpeaker": {
      "capabilities": [
        "Alexa",
        "Alexa.StepSpeaker",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SPEAKER"],
      "friendlyName": "Speaker"
    }
  }
};
