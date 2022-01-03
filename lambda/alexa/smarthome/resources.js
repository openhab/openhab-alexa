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

const AlexaAssetCatalog = require('./catalog');

/**
 * Defines alexa capability resources class
 *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#capability-resources
 */
class AlexaCapabilityResources {
  /**
   * Defines asset label prefix
   * @type {String}
   */
  static ASSET_LABEL_PREFIX = '@';

  /**
   * Defines default language
   * @type {String}
   */
  static DEFAULT_LANGUAGE = 'en';

  /**
   * Defines alexa reserved friendly names
   *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#reserved-words
   * @type {Array}
   */
  static FRIENDLY_NAMES_RESERVED = [
    'alarm',
    'alarms',
    'all alarms',
    'away mode',
    'bass',
    'camera',
    'date',
    'date today',
    'day',
    'do not disturb',
    'drop in',
    'music',
    'night light',
    'notification',
    'playing',
    'sleep sounds',
    'time',
    'timer',
    'today in music',
    'treble',
    'volume',
    'way f. m.'
  ];

  /**
   * Defines alexa supported Locales
   *  https://developer.amazon.com/docs/smapi/skill-manifest.html#locales
   * @type {Array}
   */
  static LOCALES = [
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
  ];

  /**
   * Returns if valid label
   * @param {String} label
   * @return {Boolean}
   */
  static isValidLabel(label) {
    return label.startsWith(this.ASSET_LABEL_PREFIX)
      ? AlexaAssetCatalog.isSupported(label)
      : label.length > 0 && !this.FRIENDLY_NAMES_RESERVED.includes(label.toLowerCase());
  }

  /**
   * Return alexa resources object for a given list of labels and language
   * @param  {Array}  labels
   * @param  {String} language
   * @return {Object}
   */
  static getResources(labels, language) {
    return {
      friendlyNames: labels
        // Filter out invalid label
        .filter((label) => this.isValidLabel(label))
        // Define resource label values
        .map((label) =>
          label.startsWith(this.ASSET_LABEL_PREFIX)
            ? // Use asset catalog if asset label
              AlexaAssetCatalog.getLabels(label)
            : // Use text-based label and supported locales language otherwise
              this.getSupportedLocales(language).map((locale) => ({ text: label, locale }))
        )
        .flat()
        // Define label objects setting type based on properties (assetId => asset; text + locale => text)
        .map((value) => ({ '@type': value.assetId ? 'asset' : 'text', value }))
    };
  }

  /**
   * Returns list of supported locales for a given language
   * @param  {String} language
   * @return {Array}
   */
  static getSupportedLocales(language) {
    return this.LOCALES.filter((locale) => locale.split('-')[0] === language.toLowerCase());
  }
}

/**
 * Defines alexa mode resources class
 *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#mode-resources
 * @extends AlexaCapabilityResource
 */
class AlexaModeResources extends AlexaCapabilityResources {
  /**
   * Defines alexa reserved friendly names
   *  (None for mode resources)
   * @type {Array}
   */
  static FRIENDLY_NAMES_RESERVED = [];
}

/**
 * Defines alexa preset resources class
 *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#preset-resources
 * @extends AlexaCapabilityResource
 */
class AlexaPresetResources extends AlexaCapabilityResources {
  /**
   * Defines alexa reserved friendly names
   *  (None for preset resources)
   * @type {Array}
   */
  static FRIENDLY_NAMES_RESERVED = [];
}

module.exports = {
  AlexaCapabilityResources,
  AlexaModeResources,
  AlexaPresetResources
};
