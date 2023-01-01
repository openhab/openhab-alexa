/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import { createLogger, format, transports } from 'winston';

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

/* c8 ignore start */
export default createLogger({
  level: !process.env.LOG_LEVEL || process.env.NODE_ENV === 'test' ? 'error' : process.env.LOG_LEVEL.toLowerCase(),
  levels: { error: 0, warn: 1, info: 2, debug: 3 },
  format: format.printf(
    // eslint-disable-next-line no-unused-vars
    ({ level, message, ...meta }) =>
      `${message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta, getCircularReplacer()) : ''}`
  ),
  transports: [
    new transports.Console({
      log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        // eslint-disable-next-line no-console
        console[info[LEVEL]](info[MESSAGE]);

        if (callback) {
          callback();
        }
      }
    })
  ]
});

/**
 * Returns circular replacer
 * @return {Function}
 */
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
