/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import log from '#root/log.js';

/**
 * Defines debug class
 */
export default class Debug {
  /**
   * Constructor
   */
  constructor() {
    this._traces = [];
  }

  /**
   * Starts a trace
   * @param {String} name
   * @return {Object}
   */
  startTrace(name) {
    const trace = new Trace(name);
    this._traces.push(trace);
    return trace;
  }

  /**
   * Ends a trace
   * @param {String} name
   * @param {String} error
   */
  endTrace(name, error) {
    const trace = this._traces.find((trace) => trace.name == name && !trace.end);
    if (trace) {
      if (error) trace.addError(error);
      trace.close();
    }
  }

  /**
   * Captures asynchronous function
   * @param {String} name
   * @param {Function} func
   */
  async captureAsyncFunc(name, func) {
    const trace = this.startTrace(name);
    try {
      await func();
    } catch (error) {
      trace.addError(error.message);
      throw error;
    } finally {
      trace.close();
    }
  }

  /**
   * Starts timeout timer
   * @param {Object} directive
   * @param {Object} context
   */
  startTimer(directive, context) {
    this._timer = setTimeout(
      () => log.error('Timed out', { directive, traces: this._traces }),
      context.getRemainingTimeInMillis() - 10
    );
  }

  /**
   * Cancels timeout timer
   */
  cancelTimer() {
    clearTimeout(this._timer);
  }
}

/**
 * Defines trace class
 */
class Trace {
  /**
   * Constructor
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
    this.start = new Date().toISOString();
  }

  /**
   * Adds error message
   * @param {String} error
   */
  addError(error) {
    this.error = error;
  }

  /**
   * Closes trace
   */
  close() {
    this.end = new Date().toISOString();
    this.duration = new Date(this.end) - new Date(this.start);
  }

  /**
   * Returns serialized object
   * @return {Object}
   */
  toJSON() {
    return {
      name: this.name,
      start: this.start,
      ...(this.end && { end: this.end, duration: this.duration }),
      ...(this.error && { error: this.error })
    };
  }
}
