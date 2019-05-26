module.exports = {
  description: "contact/motion sensors",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/contact1",
      "type": "Contact",
      "name": "contact1",
      "label": "Contact Sensor",
      "tags": ["ContactSensor"]
    },
    {
      "link": "https://localhost:8443/rest/items/motion1",
      "type": "Contact",
      "name": "motion1",
      "label": "Motion Sensor",
      "tags": ["MotionSensor"]
    },

  ],
  expected: {
    "contact1": {
      "capabilities": [
        "Alexa",
        "Alexa.ContactSensor.detectionState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["CONTACT_SENSOR"],
      "friendlyName": "Contact Sensor"
    },
    "motion1": {
      "capabilities": [
        "Alexa",
        "Alexa.MotionSensor.detectionState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["MOTION_SENSOR"],
      "friendlyName": "Motion Sensor"
    }
  }
};
