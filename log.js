/**
 * Logging helpers for lambda
 * Set enviroment variable LOG_LEVEL to one of the following LEVELS to control
 * verbosity of logging.
 */

var LEVELS = [
    'TRACE',
    'DEBUG',
    'ERROR',
    'WARN',
    'INFO',
];

var DEFAULT = 'ERROR';

function log(level, message) {
    var setLevel = LEVELS.indexOf(process.env.LOG_LEVEL ?
      process.env.LOG_LEVEL : DEFAULT);
    if (LEVELS.indexOf(level) < setLevel) {
        return;
    }
    switch (level) {
    case 'ERROR':
        console.error(message);
        break;
    case 'WARN':
        console.warn(message);
        break;
    case 'INFO':
        console.info(message);
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
module.exports.error = function (message) {
    log('ERROR', message);
};
module.exports.warn = function (message) {
    log('WARN', message);
};
module.exports.info = function (message) {
    log('INFO', message);
};
