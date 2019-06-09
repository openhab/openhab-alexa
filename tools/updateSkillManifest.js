/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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
  'fr-CA', 'fr-FR', 'it-IT', 'ja-JP', 'pt-BR'
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
    const dirname = fs.readdirSync(`${RESOURCES_PATH}/locales`).find(
      filename => filename === locale.split('-').shift());
    if (dirname) {
      fs.readdirSync(`${RESOURCES_PATH}/locales/${dirname}`).filter(
        filename => filename.endsWith('.json')).forEach((filename) => {
        const property = filename.replace(/\.json$/, '');
        if (typeof schema.manifest[property] === 'object') {
          try {
            schema.manifest[property].locales[locale] = require(`${RESOURCES_PATH}/locales/${dirname}/${filename}`);
          } catch (e) {
            console.log(`Failed to load locale property file: ${RESOURCES_PATH}/locales/${dirname}/${filename}`);
            throw e;
          }
        }
      });
    }
  });
}

/**
 * Set api endpoints
 * @param {Object} schema
 */
function setApiEndpoints(schema) {
  if (process.env.ASK_FUNCTION_NAME) {
    schema.manifest.apis.smartHome.endpoint.uri = process.env.ASK_FUNCTION_NAME;
  }
  if (process.env.ASK_ENV === 'production') {
    schema.manifest.apis.smartHome.regions = {};
    REGIONS.forEach(region =>
      schema.manifest.apis.smartHome.regions[region] = schema.manifest.apis.smartHome.endpoint);
  } else {
    delete schema.manifest.apis.smartHome.regions;
  }
}

/**
 * Set publishing distribution settings
 * @param {Object} schema
 */
function setPublishingDistributionSettings(schema) {
  if (process.env.ASK_ENV === 'production') {
    schema.manifest.publishingInformation.distributionMode = 'PUBLIC';
  } else {
    schema.manifest.publishingInformation.distributionMode = 'PRIVATE';
  }
}

/**
 * Format skill schema
 * @param {Object} schema
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
    // Set api endpoints
    setApiEndpoints(schema);
    // Set publishing distribution settings
    setPublishingDistributionSettings(schema);
    // Format skill schema
    formatSkillSchema(schema);
    // Save skill schema
    saveSkillSchema(schema);
  } catch (e) {
    process.exit(1);
  }
}
