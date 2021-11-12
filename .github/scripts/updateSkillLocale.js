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
 * Defines catalog file path
 * @type {String}
 */
const CATALOG_FILE = path.resolve('lambda', 'catalog.json');

/**
 * Defines skill manifest file path
 * @type {String}
 */
const SKILL_MANIFEST_FILE = path.resolve('skill-package', 'skill.json');

/**
 * Defines resources locales directory path
 * @type {String}
 */
const RESOURCES_LOCALES_DIR = path.resolve('resources', 'locales');

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
 * @param  {String} file
 * @return {Object}
 */
function loadSchema(file) {
  try {
    return require(file);
  } catch {
    throw new Error(`Failed to load schema: ${file}`);
  }
}

/**
 * Save a schema
 * @param  {Object} schema
 * @param  {String} file
 */
function saveSchema(schema, file) {
  try {
    fs.writeFileSync(file, JSON.stringify(schema, null, 2));
  } catch {
    throw new Error(`Failed to save schema: ${file}`);
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
    const catalogFile = path.resolve(RESOURCES_LOCALES_DIR, locale.split('-')[0], 'catalog.json');
    if (fs.existsSync(catalogFile)) {
      const { assetIds } = loadSchema(catalogFile);
      // Update catalog asset ids locale labels
      for (const [assetId, value] of Object.entries(assetIds)) {
        const labels = value.split(',').map((value) => ({ text: value.trim(), locale }));
        schema[assetId] = [...(schema[assetId] || []), ...labels];
      }
    }
  }
  // Save catalog schema
  saveSchema(schema, CATALOG_FILE);
}

/**
 * Updates skill manifest
 */
function updateSkillManifest() {
  // Load skill manifest schema
  const schema = loadSchema(SKILL_MANIFEST_FILE);
  // Iterate over locale resources
  for (const locale of SUPPORTED_SKILL_LOCALES) {
    const manifestFile = path.resolve(RESOURCES_LOCALES_DIR, locale.split('-')[0], 'manifest.json');
    if (fs.existsSync(manifestFile)) {
      const properties = loadSchema(manifestFile);
      // Update skill manifest locale properties
      for (const [key, value] of Object.entries(properties)) {
        if (typeof schema.manifest[key] === 'object') {
          schema.manifest[key].locales[locale] = value;
        }
      }
    }
  }
  // Save skill manifest schema
  saveSchema(schema, SKILL_MANIFEST_FILE);
}

if (require.main === module) {
  try {
    // Update catalog
    updateCatalog();
    // Update skill manifest
    updateSkillManifest();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
