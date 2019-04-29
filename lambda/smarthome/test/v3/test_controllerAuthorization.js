module.exports = [
  {
    description: "grant authorization not supported",
    directive: {
      "header": {
        "namespace": "Alexa.Authorization",
        "name": "AcceptGrant"
      },
      "payload": {
        "grant": {
          "type": "OAuth2.AuthorizationCode",
          "code": "auth-code"
        },
        "grantee": {
          "type": "BearerToken",
          "token": "access-token-from-skill"
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.Authorization",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "ACCEPT_GRANT_FAILED",
            "message": "Not supported"
          }
        }
      },
      openhab: []
    }
  }
];
