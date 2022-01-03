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

/**
 * Defines openHAB binding enum
 *  https://www.openhab.org/addons/
 * @type {Object}
 */
const Binding = Object.freeze({
  BROADLINK_THERMOSTAT: 'broadlinkthermostat',
  DAIKIN: 'daikin',
  ECOBEE: 'ecobee',
  HUE: 'hue',
  INSTEON: 'insteon',
  LIFX: 'lifx',
  MAX: 'max',
  MILIGHT: 'milight',
  NEST: 'nest',
  RADIO_THERMOSTAT: 'radiothermostat',
  TPLINK: 'tplinksmarthome',
  TRADFRI: 'tradfri',
  VENSTAR_THERMOSTAT: 'venstarthermostat',
  YEELIGHT: 'yeelight',
  ZWAVE: 'zwave'
});

/**
 * Defines openHAB dimension enum
 *  https://www.openhab.org/docs/concepts/units-of-measurement.html
 * @type {Object}
 */
const Dimension = Object.freeze({
  ANGLE: 'Angle',
  DIMENSIONLESS: 'Dimensionless',
  LENGTH: 'Length',
  MASS: 'Mass',
  TEMPERATURE: 'Temperature',
  VOLUME: 'Volume'
});

/**
 * Defines openHAB item type enum
 *  https://www.openhab.org/docs/concepts/items.html
 * @type {Object}
 */
const ItemType = Object.freeze({
  COLOR: 'Color',
  CONTACT: 'Contact',
  DIMMER: 'Dimmer',
  GROUP: 'Group',
  NUMBER: 'Number',
  NUMBER_ANGLE: `Number:${Dimension.ANGLE}`,
  NUMBER_DIMENSIONLESS: `Number:${Dimension.DIMENSIONLESS}`,
  NUMBER_LENGTH: `Number:${Dimension.LENGTH}`,
  NUMBER_MASS: `Number:${Dimension.MASS}`,
  NUMBER_TEMPERATURE: `Number:${Dimension.TEMPERATURE}`,
  NUMBER_VOLUME: `Number:${Dimension.VOLUME}`,
  ROLLERSHUTTER: 'Rollershutter',
  PLAYER: 'Player',
  STRING: 'String',
  SWITCH: 'Switch'
});

/**
 * Defines openHAB item value enum
 *  https://www.openhab.org/docs/concepts/items.html#enum-types
 * @type {Object}
 */
const ItemValue = Object.freeze({
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  NEXT: 'NEXT',
  PREVIOUS: 'PREVIOUS',
  ON: 'ON',
  OFF: 'OFF',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  REWIND: 'REWIND',
  FAST_FORWARD: 'FASTFORWARD',
  STOP: 'STOP',
  MOVE: 'MOVE',
  UP: 'UP',
  DOWN: 'DOWN',
  NULL: 'NULL',
  UNDEFINED: 'UNDEF'
});

/**
 * Defines openHAB symbol unit enum
 *  https://www.openhab.org/docs/concepts/units-of-measurement.html#list-of-units
 * @type {Object}
 */
const SymbolUnit = Object.freeze({
  DEGREE: '°',
  RADIAN: 'rad',
  PERCENT: '%',
  YARD: 'yd',
  INCH: 'in',
  FOOT: 'ft',
  MILE: 'mi',
  METER: 'm',
  KILOMETER: 'km',
  GRAM: 'g',
  KILOGRAM: 'kg',
  OUNCE: 'oz',
  POUND: 'lb',
  CELSIUS: '°C',
  FAHRENHEIT: '°F',
  KELVIN: 'K',
  GALLON: 'gal',
  PINT: 'pt',
  QUART: 'qt',
  LITER: 'l',
  CUBIC_FOOT: 'ft³',
  CUBIC_METER: 'm³'
});

/**
 * Defines openHAB system unit enum
 *  https://www.openhab.org/docs/concepts/units-of-measurement.html#list-of-units
 * @type {Object}
 */
const SystemUnit = Object.freeze({
  METRIC: 'SI',
  IMPERIAL_US: 'US'
});

module.exports = {
  Binding,
  Dimension,
  ItemType,
  ItemValue,
  SymbolUnit,
  SystemUnit
};
