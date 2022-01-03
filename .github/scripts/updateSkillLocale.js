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
const { loadSchema, saveSchema } = require('./utils');
const { CATALOG_FILE, RESOURCES_LOCALES_DIR, SKILL_LOCALES, SKILL_MANIFEST_FILE } = require('./constants');

/**
 * Updates catalog
 */
function updateCatalog() {
  // Build catalog schema based on locale resources
  //  (This is a temporary solution until Amazon provides the ability to upload our own catalog:
  //    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#upload-your-own-catalog)
  const schema = {};
  // Iterate over locale resources
  for (const locale of SKILL_LOCALES) {
    const catalogFile = path.resolve(RESOURCES_LOCALES_DIR, locale.split('-')[0], 'catalog.json');
    const { assetIds = {} } = loadSchema(catalogFile, { required: false });
    // Update catalog asset ids locale labels
    for (const [assetId, value] of Object.entries(assetIds)) {
      const labels = value.split(',').map((value) => ({ text: value.trim(), locale }));
      schema[assetId] = [...(schema[assetId] || []), ...labels];
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
  for (const locale of SKILL_LOCALES) {
    const manifestFile = path.resolve(RESOURCES_LOCALES_DIR, locale.split('-')[0], 'manifest.json');
    const properties = loadSchema(manifestFile, { required: false });
    // Update skill manifest locale properties
    for (const [key, value] of Object.entries(properties)) {
      if (typeof schema.manifest[key] === 'object') {
        schema.manifest[key].locales[locale] = value;
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
