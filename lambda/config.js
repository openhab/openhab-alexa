/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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
 * Defines backend configuration, change the values for your deployment
 *  or use lambda function environment variables defined inside braces
 *
 *  openhab:
 *    baseURL: {OPENHAB_BASE_URL} [https://myopenhab.org]
 *      base URL to access your openHAB server
 *
 *    user: {OPENHAB_USERNAME} (Optional)
 *      username to access your openHAB server
 *      by default OAuth2 tokens will be used for authentication, set this
 *      to use standard basic auth when connecting directly to your server.
 *
 *    pass: {OPENHAB_PASSWORD} (Optional)
 *      password to access your openHAB server
 *      by default OAuth2 tokens will be used for authentication, set this
 *      to use standard basic auth when connecting directly to your server.
 *
 *    certFile: {OPENHAB_CERT_FILE} [ssl/client.pfx] (Optional)
 *      SSL client certificate file path to access your openHAB server
 *      use this for certificate auth when connecting directly to your server,
 *      if certificate file exists.
 *
 *    certPass: {OPENHAB_CERT_PASSPHRASE} (Optional)
 *      SSL client certificate passphrase to access your openHAB server
 *      use this for certificate auth when connecting directly to your server,
 *      if certificate file exists.
 *
 * @type {Object}
 */
module.exports = {
  openhab: {
    baseURL: process.env.OPENHAB_BASE_URL || 'https://myopenhab.org',
    user: process.env.OPENHAB_USERNAME || '',
    pass: process.env.OPENHAB_PASSWORD || '',
    certFile: process.env.OPENHAB_CERT_FILE || 'ssl/client.pfx',
    certPass: process.env.OPENHAB_CERT_PASSPHRASE || ''
  }
};
