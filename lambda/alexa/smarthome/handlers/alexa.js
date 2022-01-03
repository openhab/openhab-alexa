/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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

const { Interface } = require('../constants');
const AlexaHandler = require('./handler');

/**
 * Defines alexa state reporting cause type enum
 *  https://developer.amazon.com/docs/smarthome/state-reporting-for-a-smart-home-skill.html#cause-object
 * @type {Object}
 */
const CauseType = Object.freeze({
  APP_INTERACTION: 'APP_INTERACTION',
  PERIODIC_POLL: 'PERIODIC_POLL',
  PHYSICAL_INTERACTION: 'PHYSICAL_INTERACTION',
  RULE_TRIGGER: 'RULE_TRIGGER',
  VOICE_INTERACTION: 'VOICE_INTERACTION'
});

/**
 * Defines Alexa interface handler class
 * @extends AlexaHandler
 */
class Alexa extends AlexaHandler {
  /**
   * Defines report state directive
   * @type {String}
   */
  static REPORT_STATE = 'ReportState';

  /**
   * Defines state report response
   * @type {String}
   */
  static STATE_REPORT = 'StateReport';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [Alexa.REPORT_STATE]: this.reportState
    };
  }

  /**
   * Returns state report
   * @param  {Object}  directive
   * @return {Promise}
   */
  static async reportState(directive) {
    return directive.response({ name: Alexa.STATE_REPORT });
  }
}

module.exports = Alexa;
module.exports.CauseType = CauseType;
