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

const path = require('path');

/**
 * Defines constants
 * @type {Object}
 */
module.exports = {
  /**
   * Defines ask-cli resources file path
   * @type {String}
   */
  ASK_CLI_RESOURCES_FILE: path.resolve('ask-resources.json'),

  /**
   * Defines ask-cli states file path
   * @type {String}
   */
  ASK_CLI_STATES_FILE: path.resolve('.ask', 'ask-states.json'),

  /**
   * Defines catalog file path
   * @type {String}
   */
  CATALOG_FILE: path.resolve('lambda', 'catalog.json'),

  /**
   * Defines resources locales directory path
   * @type {String}
   */
  RESOURCES_LOCALES_DIR: path.resolve('resources', 'locales'),

  /**
   * Defines skill infrastructure template file path
   * @type {String}
   */
  SKILL_INFRA_TEMPLATE_FILE: path.resolve('infrastructure', 'cfn-deployer', 'skill-stack.json'),

  /**
   * Defines skill manifest file path
   * @type {String}
   */
  SKILL_MANIFEST_FILE: path.resolve('skill-package', 'skill.json'),

  /**
   * Defines deployment profile
   *  https://developer.amazon.com/en-US/blogs/alexa/alexa-skills-kit/2020/06/using-the-ask-cli-v2-0-to-continuously-deploy-your-skill
   * @type {String}
   */
  DEPLOY_PROFILE: '__ENVIRONMENT_ASK_PROFILE__',

  /**
   * Defines deployment regions
   *  https://developer.amazon.com/docs/smapi/skill-manifest.html#regions
   * @type {Array}
   */
  DEPLOY_REGIONS: ['NA', 'EU', 'FE'],

  /**
   * Defines skill Locales
   *  https://developer.amazon.com/docs/smapi/skill-manifest.html#locales
   * @type {Array}
   */
  SKILL_LOCALES: [
    'ar-SA',
    'de-DE',
    'en-AU',
    'en-CA',
    'en-GB',
    'en-IN',
    'en-US',
    'es-ES',
    'es-MX',
    'es-US',
    'fr-CA',
    'fr-FR',
    'hi-IN',
    'it-IT',
    'ja-JP',
    'pt-BR'
  ]
};
