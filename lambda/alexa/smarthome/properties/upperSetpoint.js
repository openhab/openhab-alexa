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

const { Property } = require('../constants');
const LowerSetpoint = require('./lowerSetpoint');

/**
 * Defines upper setpoint property class
 * @extends LowerSetpoint
 */
class UpperSetpoint extends LowerSetpoint {
  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [{ name: Property.LOWER_SETPOINT, tag: this.tag }];
  }
}

module.exports = UpperSetpoint;
