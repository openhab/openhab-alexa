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
 * Catalog schema path
 * @type {String}
 */
const CATALOG_SCHEMA_PATH = '../lambda/smarthome/catalog.json';

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
 * Get catalog schema
 * @return {Object}
 */
function getCatalogSchema() {
  const schema = {assetIds: {}};

  LOCALES.forEach((locale) => {
    const path = `${RESOURCES_PATH}/locales/${locale.split('-').shift()}`;
    if (fs.existsSync(`${path}/catalog.json`)) {
      try {
        const { assetIds } = require(`${path}/catalog.json`);
        // Update catalog asset ids locale labels
        Object.keys(assetIds).forEach((assetId) => {
          const labels = assetIds[assetId].map(text => ({text: text, locale: locale}));
          schema.assetIds[assetId] = [].concat(schema.assetIds[assetId] || [], labels);
        });
      } catch (e) {
        console.log(`Failed to load locale properties file: ${path}/catalog.json`);
        throw e;
      }
    }
  });
  return schema;
}

/**
 * Save catalog schema
 * @param  {Object} schema
 */
function saveCatalogSchema(schema) {
  try {
    fs.writeFileSync(CATALOG_SCHEMA_PATH, JSON.stringify(schema, null, 2));
  } catch (e) {
    console.log(`Failed to save skill schema: ${CATALOG_SCHEMA_PATH}`);
    throw e;
  }
}

if (require.main === module) {
  try {
    // Change working directory to script location
    process.chdir(__dirname);
    // Get catalog schema based on locale resources
    //  (This is a temporary solution until Amazon provides the ability to upload our own catalog:
    //    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#upload-your-own-catalog)
    const schema = getCatalogSchema();
    // Save catalog schema
    saveCatalogSchema(schema);
  } catch (e) {
    process.exit(1);
  }
}
