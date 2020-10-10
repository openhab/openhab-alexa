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

/**
 * Returns date in iso string format
 * @return {String}
 */
function date() {
  const date = new Date();
  return date.toISOString();
}

/**
 * Returns time epoch seconds
 * @return {Integer}
 */
function timeInSeconds() {
  const time = new Date().getTime();
  return Math.round(time / 1000);
}

module.exports = {
  date: date,
  timeInSeconds: timeInSeconds
};
