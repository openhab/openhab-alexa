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
