/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const path = require('path');

/**
 * Defines catalog path
 * @type {String}
 */
const CATALOG_PATH = path.join('..', 'lambda', 'catalog.json');

/**
 * Defines skill manifest path
 * @type {String}
 */
const SKILL_MANIFEST_PATH = path.join('..', 'skill-package', 'skill.json');

/**
 * Defines resources locales path
 * @type {String}
 */
const RESOURCES_LOCALES_PATH = path.join('..', 'resources', 'locales');

/**
 * Defines supported skill Locales
 *  https://developer.amazon.com/docs/smapi/skill-manifest.html#locales
 * @type {Array}
 */
const SUPPORTED_SKILL_LOCALES = [
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
];

/**
 * Load a schema
 * @param  {String} path
 * @return {Object}
 */
function loadSchema(path) {
  try {
    return require(path);
  } catch {
    throw new Error(`Failed to load schema: ${path}`);
  }
}

/**
 * Save a schema
 * @param  {Object} schema
 * @param  {String} path
 */
function saveSchema(schema, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(schema, null, 2));
  } catch {
    throw new Error(`Failed to save schema: ${path}`);
  }
}

/**
 * Updates catalog
 */
function updateCatalog() {
  // Build catalog schema based on locale resources
  //  (This is a temporary solution until Amazon provides the ability to upload our own catalog:
  //    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#upload-your-own-catalog)
  const schema = {};
  // Iterate over locale resources
  for (const locale of SUPPORTED_SKILL_LOCALES) {
    const catalogPath = path.join(RESOURCES_LOCALES_PATH, locale.split('-')[0], 'catalog.json');
    if (fs.existsSync(catalogPath)) {
      const { assetIds } = loadSchema(catalogPath);
      // Update catalog asset ids locale labels
      for (const [assetId, value] of Object.entries(assetIds)) {
        const labels = value.split(',').map((value) => ({ text: value.trim(), locale }));
        schema[assetId] = [...(schema[assetId] || []), ...labels];
      }
    }
  }
  // Save catalog schema
  saveSchema(schema, CATALOG_PATH);
}

/**
 * Updates skill manifest
 */
function updateSkillManifest() {
  // Load skill manifest schema
  const schema = loadSchema(SKILL_MANIFEST_PATH);
  // Iterate over locale resources
  for (const locale of SUPPORTED_SKILL_LOCALES) {
    const manifestPath = path.join(RESOURCES_LOCALES_PATH, locale.split('-')[0], 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const properties = loadSchema(manifestPath);
      // Update skill manifest locale properties
      for (const [key, value] of Object.entries(properties)) {
        if (typeof schema.manifest[key] === 'object') {
          schema.manifest[key].locales[locale] = value;
        }
      }
    }
  }
  // Save skill manifest schema
  saveSchema(schema, SKILL_MANIFEST_PATH);
}

if (require.main === module) {
  try {
    // Change working directory to script location
    process.chdir(__dirname);
    // Update catalog
    updateCatalog();
    // Update skill manifest
    updateSkillManifest();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
