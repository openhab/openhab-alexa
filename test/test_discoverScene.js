module.exports = {
  description: "multiple scene/activity items",
  input: {
    "staged": false,
    "values": [
      {
        "link": "https://localhost:8443/rest/items/scene1",
        "type": "Switch",
        "name": "scene1",
        "tags": ["Alexa.SceneController.scene"]
      },
      {
        "link": "https://localhost:8443/rest/items/scene2",
        "type": "Switch",
        "name": "scene2",
        "tags": ["Alexa.SceneController.scene:supportsDeactivation=false"]
      },
      {
        "link": "https://localhost:8443/rest/items/activity1",
        "type": "Switch",
        "name": "activity1",
        "tags": ["Alexa.SceneController.scene:category=ACTIVITY_TRIGGER"]
      }
    ]
  },
  expected: {
    "scene1": {
      "capabilities": ["Alexa", "Alexa.SceneController"],
      "displayCategories": ["SCENE_TRIGGER"],
      "parameters": {"Alexa.SceneController:supportsDeactivation": true}
    },
    "scene2": {
      "capabilities": ["Alexa",  "Alexa.SceneController"],
      "displayCategories": ["SCENE_TRIGGER"],
      "parameters": {"Alexa.SceneController:supportsDeactivation": false}
    },
    "activity1": {
      "capabilities": ["Alexa",  "Alexa.SceneController"],
      "displayCategories": ["ACTIVITY_TRIGGER"],
      "parameters": {"Alexa.SceneController:supportsDeactivation": true}
    }
  }
};
