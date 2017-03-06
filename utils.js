/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * Utility functions.
 */
function log(title, msg) {
    console.log('[DEBUG] (' + title + '): ' + msg);
}

/**
 * Convert C to F
 */
function toF(value) {
    return Math.round(value * 9 / 5 + 32);
}
/**
 * Convert F to C
 */
function toC(value) {
    return ((value - 32) * 5 / 9).toFixed(2);
}

function generateControlError(messageId, name, code, description) {
    var header = {
        namespace: 'Alexa.ConnectedHome.Control',
        name: name,
        payloadVersion: '2',
        messageId: messageId
    };

    var payload = {
        exception: {
            code: code,
            description: description
        }
    };

    var result = {
        header: header,
        payload: payload
    };

    return result;
}

module.exports.log = log;
module.exports.toF = toF;
module.exports.toC = toC;
module.exports.generateControlError = generateControlError;
