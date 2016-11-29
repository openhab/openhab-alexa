/**
 *
 *
 * Utility functions.
 */
function log(title, msg) {
    console.log('[DEBUG] (' + title + '): ' + msg);
};

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
