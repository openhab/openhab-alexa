/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

const setLevel = typeof process.env.LOG_LEVEL !== 'undefined' ? process.env.LOG_LEVEL.toLowerCase() : 'error';

const logLevelFormat = format(info => Object.assign(info, {level: info.level.toUpperCase()}));

const logger = createLogger({
  level: process.env.NODE_ENV === 'test' ? 'error' : setLevel,
  levels : { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, trace: 5 },
  format: format.combine(
    logLevelFormat(),
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console({
      log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        if (this.stderrLevels[info[LEVEL]]) {
          // eslint-disable-next-line no-console
          console.error(info[MESSAGE]);
        } else {
          // eslint-disable-next-line no-console
          console.log(info[MESSAGE]);
        }

        if (callback) {
          callback();
        }
      }
    })
  ]
});

module.exports = logger;
