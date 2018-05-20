module.exports = [
  {
    description: "get authorization tokens",
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
            "name": "AcceptGrant.Response"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "missing authorization parameters error",
    directive: {
      "header": {
        "namespace": "Alexa.Authorization",
        "name": "AcceptGrant"
      },
      "payload": {
        "grant": {
          "type": "OAuth2.AuthorizationCode",
          "code": null
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
            "message": "Missing authorization parameters"
          }
        }
      },
      openhab: []
    }
  }
];
