/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/**
* Default options, copy to config.js for deployment
* baseURL [https://myopenhab.org/rest]
*    REST base URL, uncomment this to connect directly to a openHAB server.
* user
*    Optional username for the REST server
*    by default oauth2 tokens will be used for authentication, uncomment this
*    to use standard basic auth when talking directly to a openHAB server.
* pass
*    Optional password for the REST server
*    by default oauth2 tokens will be used for authentication, uncomment this
*    to use standard basic auth when talking directly to a openHAB server.
* certFile [ssl/client.pfx]
*    Optional SSL client certificate file path for the REST server
*    use this for certificate auth when talking directly to a openHAB server.
* certPass
*    Optional SSL client certificate passphrase for the REST server
*    use this for certificate auth when talking directly to a openHAB server.
*
**/
module.exports = {
  openhab: {
    //baseURL: 'https://openhab.example.com/rest',
    //user: 'user@foo.com',
    //pass: 'Password1'
  }
};
