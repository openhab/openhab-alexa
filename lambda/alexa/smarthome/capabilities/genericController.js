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

const AlexaCapability = require('./capability');
const AlexaDisplayCategory = require('../category');
const { AlexaCapabilityResources } = require('../resources');
const Generic = require('../properties/generic');

/**
 * Defines alexa generic controller capability class
 *  https://developer.amazon.com/docs/device-apis/generic-controllers.html
 * @extends AlexaCapability
 */
class GenericController extends AlexaCapability {
  /**
   * Constructor
   * @param {String} name
   * @param {String} instance
   */
  constructor(name, instance) {
    super(name);
    this.instance = instance;
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.OTHER];
  }

  /**
   * Returns if has non-controllable properties
   * @return {Boolean}
   */
  get hasNonControllableProperties() {
    return this.properties.every((property) => property.isReportable && property.isNonControllable);
  }

  /**
   * Returns capability properties
   * @return {Object}
   */
  getCapabilityProperties() {
    return {
      ...super.getCapabilityProperties(),
      nonControllable: this.hasNonControllableProperties
    };
  }

  /**
   * Returns capability resources
   * @return {Object}
   */
  getCapabilityResources() {
    // Determine capability resources labels and language
    const { friendlyNames: labels, language } = this.properties.find((property) => property instanceof Generic);

    // Return capability resources object based on labels and language
    return { ...(labels && AlexaCapabilityResources.getResources(labels, language)) };
  }
}

module.exports = GenericController;
