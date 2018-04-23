module.exports = {
  description: "step speaker enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/stepSpeakerMute",
          "type": "Switch",
          "name": "stepSpeakerMute",
          "tags": [
            "Alexa.StepSpeaker.muted"
          ],
          "groupNames": ["gStepSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/stepSpeakerVolume",
          "type": "Dimmer",
          "name": "stepSpeakerVolume",
          "tags": [
            "Alexa.StepSpeaker.volume"
          ],
          "groupNames": ["gStepSpeaker"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gStepSpeaker",
      "type": "Group",
      "name": "gStepSpeaker",
      "label": "Speaker",
      "tags": [
        "Alexa.Endpoint.Speaker"
      ],
      "groupNames": []
    }
  ],
  expected: {
    "gStepSpeaker": {
      "capabilities": [
        "Alexa"
      ],
      "displayCategories": ["SPEAKER"],
      "friendlyName": "Speaker"
    }
  }
};
