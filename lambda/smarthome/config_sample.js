/**
* Default options, copy to config.js for deployment
* baseURL
*    REST base URL 
* userpass
*    Optional username:password for the REST server
*    by default oauth2 tokens will be used for authentication, uncomment this
*    to use standard BASIC auth when talking directly to a openHAB server.
*
**/
module.exports = {
    openhab: {
        //userpass: 'user@foo.com:Password1',
        baseURL: 'https://myopenhab.org/rest'
    }
};
