module.exports = {
  description: "multiple scene/activity items",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/scene1",
      "type": "Switch",
      "name": "scene1",
      "label": "Scene 1",
      "tags": ["Alexa.SceneController.scene"]
    },
    {
      "link": "https://localhost:8443/rest/items/scene2",
      "type": "Switch",
      "name": "scene2",
      "label": "Scene 2",
      "tags": ["Alexa.SceneController.scene:supportsDeactivation=false"]
    },
    {
      "link": "https://localhost:8443/rest/items/activity1",
      "type": "Switch",
      "name": "activity1",
      "label": "Activity 1",
      "tags": ["Alexa.SceneController.scene:category=ACTIVITY_TRIGGER"]
    }
  ],
  expected: {
    "scene1": {
      "capabilities": ["Alexa", "Alexa.SceneController"],
      "parameters": {"Alexa.SceneController.supportsDeactivation": true},
      "displayCategories": ["SCENE_TRIGGER"],
      "friendlyName": "Scene 1"
    },
    "scene2": {
      "capabilities": ["Alexa",  "Alexa.SceneController"],
      "parameters": {"Alexa.SceneController.supportsDeactivation": false},
      "displayCategories": ["SCENE_TRIGGER"],
      "friendlyName": "Scene 2"
    },
    "activity1": {
      "capabilities": ["Alexa",  "Alexa.SceneController"],
      "parameters": {"Alexa.SceneController.supportsDeactivation": true},
      "displayCategories": ["ACTIVITY_TRIGGER"],
      "friendlyName": "Activity 1"
    }
  }
};
