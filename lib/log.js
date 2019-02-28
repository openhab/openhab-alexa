/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const { createLogger, format, transports } = require('winston');

let setLevel = typeof (process.env.LOG_LEVEL) !== 'undefined' ? process.env.LOG_LEVEL.toLowerCase() : 'debug';

const logger = createLogger({
    level: process.env.NODE_ENV === 'test' ? 'error' : setLevel,
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
