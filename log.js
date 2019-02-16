let winston = require('winston');

// define the custom settings for each transport (file, console)
let setLevel = process.env.LOG_LEVEL !== null ? process.env.LOG_LEVEL.toLowerCase() : "debug";

const logger = winston.createLogger({
    level: setLevel,
    levels : { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, trace: 5 },
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
  });

module.exports = logger;