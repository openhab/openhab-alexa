/**
* Default options, copy to config.js for deployment
*   or use lambda function environment variables defined inside braces
*     (Default values are listed inside brackets)
*
*   alexa:
*     api: (Amazon LWA authorization tokens request)
*       host: {ALEXA_API_HOST} [api.amazon.com]
*         REST host
*       port: {ALEXA_API_PORT} [443]
*         REST port
*       path:
*         auth: {ALEXA_API_PATH_AUTH} [/auth/o2/token]
*           Base URL path for oauth2 token request endpoint
*         user: {ALEXA_API_PATH_USER} [/user/profile]
*           Base URL path for user profile information endpoint
*
*     gateway: (Alexa Event Gateway for asynchronous response)
*       host: {ALEXA_GATEWAY_HOST} [api.amazonalexa.com]
*         REST host (Based on regional location)
*           North America:  api.amazonalexa.com
*           Europe:         api.eu.amazonalexa.com
*           Far East:       api.fe.amazonalexa.com
*       port: {ALEXA_GATEWAY_PORT} [443]
*         REST port
*       path: {ALEXA_GATEWAY_PATH} [/v3/events]
*         Base URL path for ALexa events endpoint
*
*     skill:
*       clientId: {ALEXA_SKILL_CLIENT_ID} [null] (Required)
*         Alexa Skill Messaging Client Id
*       clientSecret: {ALEXA_SKILL_CLIENT_SECRET} [null] (Required)
*         Alexa Skill Messaging Client Secret
*
*   openhab:
*     host {OPENHAB_HOST} [localhost]
*       REST host
*     port {OPENHAB_PORT} [8443]
*       REST port
*     path {OPENHAB_PATH} [/rest]
*       Base URL path for openHAB REST endpoint
*     userpass {OPENHAB_USERNAME:OPENHAB_PASSWORD} (Optional)
*       username:password for the REST server
*       by default oauth2 tokens will be used for authentication, uncomment this
*       to use standard BASIC auth when talking directly to a openHAB server.
*     proto {OPENHAB_PROTOCOL} [https]
*       http request protocal
*
**/
module.exports = {
  alexa: {
    gateway: {
      host: 'api.amazonalexa.com',
    },
    skill: {
      clientId: '<client_id>',
      clientSecret: '<client_secret>'
    }
  },
  openhab: {
    //userpass: 'user@foo.com:Password1',
    host: 'my.openhab.org',
    port: 443,
    path: '/rest',
  }
};
