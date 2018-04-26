module.exports = [
  {
    description: "health check request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.System",
        "name": "HealthCheckRequest",
        "payloadVersion": "2"
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.System",
          "name": "HealthCheckResponse"
        },
        "payload": {
          "description": "The system is currently healthy",
          "isHealthy": true
        }
      },
      openhab: []
    }
  }
];
