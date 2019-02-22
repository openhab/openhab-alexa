const { createLogger, format, transports } = require('winston');

let setLevel = typeof (process.env.LOG_LEVEL) !== 'undefined' ? process.env.LOG_LEVEL.toLowerCase() : 'debug';

const logger = createLogger({
    level: setLevel,
    levels : { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, trace: 5 },
    format: format.combine(
      format.splat(),
      format.simple()
    ),
    transports: [
        new transports.Console()
    ]
  });

module.exports = logger;
