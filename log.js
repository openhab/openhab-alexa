/**
 * Logging helpers for lambda
 * Set enviroment variable LOG_LEVEL to one of the following LEVELS to control
 * verbosity of logging.
 */

var LEVELS = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
];

var DEFAULT = 'DEBUG';

function log(level, message) {
    var setLevel = LEVELS.indexOf(process.env.LOG_LEVEL ?
        process.env.LOG_LEVEL : DEFAULT);
    if (LEVELS.indexOf(level) < setLevel) {
        return;
    }
    switch (level) {
    case 'INFO':
        console.info(message);
        break;
    case 'WARN':
        console.warn(message);
        break;
    case 'ERROR':
        console.error(message);
        break;
    default: // debug, trace
        console.log(message);
        break;
    }
}
module.exports.trace = function (message) {
    log('TRACE', message);
};
module.exports.debug = function (message) {
    log('DEBUG', message);
};
module.exports.info = function (message) {
    log('INFO', message);
};
module.exports.warn = function (message) {
    log('WARN', message);
};
module.exports.error = function (message) {
    log('ERROR', message);
};
