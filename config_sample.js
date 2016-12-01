/**
* Default options, copy to config.js for deployment
* host
*    REST https host
* port
*    REST https port
* userpass
*    Optional username:password for the REST server
*    by default oauth2 tokens will be used for authentication, uncomment this
*    to use standard BASIC auth when talking directly to a openHAB server.
* path
*    Base URL path for openHAB items  
*
**/
module.exports = {
    //userpass: 'user@foo.com:Password1',
    host: 'my.openhab.org',
    port: 443,
    path: '/rest/items/',
};
