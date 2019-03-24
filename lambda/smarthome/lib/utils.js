/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
 * Returns JSON object if parseable otherwise text
 * @param  {String} text
 * @return {*}
 */
function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

/**
 * Returns time epoch seconds
 * @return {Integer}
 */
function timeInSeconds() {
  const time = new Date().getTime();
  return Math.round(time / 1000);
}

module.exports.date = date;
module.exports.parseJSON = parseJSON;
module.exports.timeInSeconds = timeInSeconds;
