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

const fs = require('fs');

/**
 * Skill schema path
 * @type {String}
 */
const SKILL_SCHEMA_PATH = '../skill.json';

/**
 * Resources path
 * @type {String}
 */
const RESOURCES_PATH = '../resources';

/**
 * Locales supported list
 *  https://developer.amazon.com/docs/smapi/skill-manifest.html#locales
 * @type {Array}
 */
const LOCALES = [
  'de-DE', 'en-AU', 'en-CA', 'en-GB', 'en-IN', 'en-US', 'es-ES', 'es-MX', 'es-US',
  'fr-CA', 'fr-FR', 'hi-IN', 'it-IT', 'ja-JP', 'pt-BR'
];

/**
 * Regions supported list (for production deployment)
 *  https://developer.amazon.com/docs/smapi/skill-manifest.html#regions
 * @type {Array}
 */
const REGIONS = [
  'NA', 'EU', 'FE'
];

/**
 * Placeholder format pattern
 * @type {RegExp}
 */
const PLACEHOLDER_PATTERN = /%(\w+)[:]?(.*?)%/g;

/**
 * Load locale resources
 * @param  {Object} schema
 */
function loadLocaleResources(schema) {
  LOCALES.forEach((locale) => {
    const path = `${RESOURCES_PATH}/locales/${locale.split('-').shift()}`;
    // Update skill manifest locale properties
    if (fs.existsSync(`${path}/manifest.json`)) {
      try {
        const properties = require(`${path}/manifest.json`);
        Object.keys(properties).forEach((key) => {
          if (typeof schema.manifest[key] === 'object') {
            schema.manifest[key].locales[locale] = properties[key];
          }
        });
      } catch (e) {
        console.log(`Failed to load locale properties file: ${path}/manifest.json`);
        throw e;
      }
    }
  });
}

/**
 * Set environment settings
 * @param  {Object} schema
 */
function setEnvironmentSettings(schema) {
  // Set api function name if specified
  schema.manifest.apis.smartHome.endpoint.uri = process.env.ASK_FUNCTION_NAME || 'alexa-openhab';
  // Set api regional endpoints for production deployment
  schema.manifest.apis.smartHome.regions = process.env.ASK_ENV !== 'production' ? undefined : REGIONS.reduce(
    (regions, region) => Object.assign(regions, {[region]: {endpoint: schema.manifest.apis.smartHome.endpoint}}), {});
  // Set publishing distribution mode based on deployment environment
  schema.manifest.publishingInformation.distributionMode = process.env.ASK_ENV !== 'production' ? 'PRIVATE' : 'PUBLIC';
}

/**
 * Format skill schema
 * @param  {Object} schema
 */
function formatSkillSchema(schema) {
  Object.keys(schema).forEach((key) => {
    if (typeof schema[key] === 'object') {
      formatSkillSchema(schema[key]);
    } else if (typeof schema[key] === 'string') {
      schema[key] = schema[key].replace(PLACEHOLDER_PATTERN,
        (placeholder, variable, fallback) => process.env[`ASK_${variable}`] || fallback || placeholder);
    }
  });
}

/**
 * Load skill schema
 * @return {Object}
 */
function loadSkillSchema() {
  try {
    return require(SKILL_SCHEMA_PATH);
  } catch (e) {
    console.log(`Failed to load skill schema: ${SKILL_SCHEMA_PATH}`);
    throw e;
  }
}

/**
 * Save skill schema
 * @param  {Object} schema
 */
function saveSkillSchema(schema) {
  try {
    fs.writeFileSync(SKILL_SCHEMA_PATH, JSON.stringify(schema, null, 2));
  } catch (e) {
    console.log(`Failed to save skill schema: ${SKILL_SCHEMA_PATH}`);
    throw e;
  }
}

if (require.main === module) {
  try {
    // Change working directory to script location
    process.chdir(__dirname);
    // Load skill schema
    const schema = loadSkillSchema();
    // Load locale resources into skill schema
    loadLocaleResources(schema);
    // Set environment settings
    setEnvironmentSettings(schema);
    // Format skill schema
    formatSkillSchema(schema);
    // Save skill schema
    saveSkillSchema(schema);
  } catch (e) {
    process.exit(1);
  }
}
