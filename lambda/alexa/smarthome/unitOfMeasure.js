/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import { sprintf } from 'sprintf-js';
import { Dimension, SymbolUnit, SystemUnit } from '#openhab/constants.js';

/**
 * Defines Alexa unit of measure class
 */
export default class AlexaUnitOfMeasure {
  /**
   * Defines angle degrees id
   * @type {String}
   */
  static ANGLE_DEGREES = 'Angle.Degrees';

  /**
   * Defines angle radians id
   * @type {String}
   */
  static ANGLE_RADIANS = 'Angle.Radians';

  /**
   * Defines distance yards id
   * @type {String}
   */
  static DISTANCE_YARDS = 'Distance.Yards';

  /**
   * Defines distance inches id
   * @type {String}
   */
  static DISTANCE_INCHES = 'Distance.Inches';

  /**
   * Defines distance feet id
   * @type {String}
   */
  static DISTANCE_FEET = 'Distance.Feet';

  /**
   * Defines distance miles id
   * @type {String}
   */
  static DISTANCE_MILES = 'Distance.Miles';

  /**
   * Defines distance meters id
   * @type {String}
   */
  static DISTANCE_METERS = 'Distance.Meters';

  /**
   * Defines distance kilometers id
   * @type {String}
   */
  static DISTANCE_KILOMETERS = 'Distance.Kilometers';

  /**
   * Defines mass gram id
   * @type {String}
   */
  static MASS_GRAM = 'Mass.Grams';

  /**
   * Defines mass kilograms id
   * @type {String}
   */
  static MASS_KILOGRAMS = 'Mass.Kilograms';

  /**
   * Defines weight ounces id
   * @type {String}
   */
  static WEIGHT_OUNCES = 'Weight.Ounces';

  /**
   * Defines weight pounds id
   * @type {String}
   */
  static WEIGHT_POUNDS = 'Weight.Pounds';

  /**
   * Defines percent id
   * @type {String}
   */
  static PERCENT = 'Percent';

  /**
   * Defines temperature degrees id
   * @type {String}
   */
  static TEMPERATURE_DEGREES = 'Temperature.Degrees';

  /**
   * Defines temperature celsius id
   * @type {String}
   */
  static TEMPERATURE_CELSIUS = 'Temperature.Celsius';

  /**
   * Defines temperature fahrenheit id
   * @type {String}
   */
  static TEMPERATURE_FAHRENHEIT = 'Temperature.Fahrenheit';

  /**
   * Defines temperature kelvin id
   * @type {String}
   */
  static TEMPERATURE_KELVIN = 'Temperature.Kelvin';

  /**
   * Defines volume gallon id
   * @type {String}
   */
  static VOLUME_GALLONS = 'Volume.Gallons';

  /**
   * Defines volume pints id
   * @type {String}
   */
  static VOLUME_PINTS = 'Volume.Pints';

  /**
   * Defines volume quarts id
   * @type {String}
   */
  static VOLUME_QUARTS = 'Volume.Quarts';

  /**
   * Defines volume liters id
   * @type {String}
   */
  static VOLUME_LITERS = 'Volume.Liters';

  /**
   * Defines volume cubic feet id
   * @type {String}
   */
  static VOLUME_CUBIC_FEET = 'Volume.CubicFeet';

  /**
   * Defines volume cubic meters id
   * @type {String}
   */
  static VOLUME_CUBIC_METERS = 'Volume.CubicMeters';

  /**
   * Defines kilogram unit
   * @type {String}
   */
  static UNIT_KILOGRAM = 'KILOGRAM';

  /**
   * Defines gram unit
   * @type {String}
   */
  static UNIT_GRAM = 'GRAM';

  /**
   * Defines pound unit
   * @type {String}
   */
  static UNIT_POUND = 'POUND';

  /**
   * Defines ounce unit
   * @type {String}
   */
  static UNIT_OUNCE = 'OUNCE';

  /**
   * Defines celsius unit
   * @type {String}
   */
  static UNIT_CELSIUS = 'CELSIUS';

  /**
   * Defines fahrenheit unit
   * @type {String}
   */
  static UNIT_FAHRENHEIT = 'FAHRENHEIT';

  /**
   * Defines kelvin unit
   * @type {String}
   */
  static UNIT_KELVIN = 'KELVIN';

  /**
   * Defines US fluid gallon unit
   * @type {String}
   */
  static UNIT_US_FLUID_GALLON = 'US_FLUID_GALLON';

  /**
   * Defines US fluid pint unit
   * @type {String}
   */
  static UNIT_US_FLUID_PINT = 'US_FLUID_PINT';

  /**
   * Defines US fluid quart unit
   * @type {String}
   */
  static UNIT_US_FLUID_QUART = 'US_FLUID_QUART';

  /**
   * Defines liter unit
   * @type {String}
   */
  static UNIT_LITER = 'LITER';

  /**
   * Defines cubic foot
   * @type {String}
   */
  static UNIT_CUBIC_FOOT = 'CUBIC_FOOT';

  /**
   * Defines cubic meter unit
   * @type {String}
   */
  static UNIT_CUBIC_METER = 'CUBIC_METER';

  /**
   * Returns units of measure
   *    https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#units-of-measure (Alexa ids)
   *    https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#temperature-scales (Alexa temperature units)
   *    https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#volume-unit (Alexa volume units)
   *    https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#weight-unit (Alexa weight units)
   *    https://www.openhab.org/docs/concepts/units-of-measurement.html#list-of-units (OH symbols + defaults)
   *
   *    {
   *      id: <alexaUnitOfMesureId>,             (Alexa unitOfMeasure id used by RangeController interface)
   *      unit: <alexaUnit>,                     (Alexa unit properties naming convention)
   *      dimension: <ohUnitOfMeasureDimension>, (OH unit of measure item type number dimension)
   *      symbol: <ohUnitOfMeasureSymbol>,       (OH unit of measure item state symbol)
   *      system: <ohUnitOfMeasureSystem>,       (OH unit of measure sytem)
   *      default: <ohUnitOfMesureDefault>,      (OH unit of measure default boolean)
   *    }
   *
   * @return {Array}
   */
  static get unitsOfMeasure() {
    return [
      {
        id: this.ANGLE_DEGREES,
        dimension: Dimension.ANGLE,
        symbol: SymbolUnit.DEGREE,
        default: true
      },
      {
        id: this.ANGLE_RADIANS,
        dimension: Dimension.ANGLE,
        symbol: SymbolUnit.RADIAN,
        default: false
      },
      {
        id: this.PERCENT,
        dimension: Dimension.DIMENSIONLESS,
        symbol: SymbolUnit.PERCENT,
        default: false
      },
      {
        id: this.DISTANCE_YARDS,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.YARD,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.DISTANCE_INCHES,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.INCH,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.DISTANCE_FEET,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.FOOT,
        system: SystemUnit.IMPERIAL_US,
        default: true
      },
      {
        id: this.DISTANCE_MILES,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.MILE,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.DISTANCE_METERS,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.METER,
        system: SystemUnit.METRIC,
        default: true
      },
      {
        id: this.DISTANCE_KILOMETERS,
        dimension: Dimension.LENGTH,
        symbol: SymbolUnit.KILOMETER,
        system: SystemUnit.METRIC,
        default: false
      },
      {
        id: this.MASS_GRAMS,
        unit: this.UNIT_GRAM,
        dimension: Dimension.MASS,
        symbol: SymbolUnit.GRAM,
        system: SystemUnit.METRIC,
        default: false
      },
      {
        id: this.MASS_KILOGRAMS,
        unit: this.UNIT_KILOGRAM,
        dimension: Dimension.MASS,
        symbol: SymbolUnit.KILOGRAM,
        system: SystemUnit.METRIC,
        default: true
      },
      {
        id: this.WEIGHT_OUNCES,
        unit: this.UNIT_OUNCE,
        dimension: Dimension.MASS,
        symbol: SymbolUnit.OUNCE,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.WEIGHT_POUNDS,
        unit: this.UNIT_POUND,
        dimension: Dimension.MASS,
        symbol: SymbolUnit.POUND,
        system: SystemUnit.IMPERIAL_US,
        default: true
      },
      {
        id: this.TEMPERATURE_DEGREES,
        dimension: Dimension.TEMPERATURE,
        symbol: SymbolUnit.DEGREE,
        default: false
      },
      {
        id: this.TEMPERATURE_CELSIUS,
        unit: this.UNIT_CELSIUS,
        dimension: Dimension.TEMPERATURE,
        symbol: SymbolUnit.CELSIUS,
        system: SystemUnit.METRIC,
        default: true
      },
      {
        id: this.TEMPERATURE_FAHRENHEIT,
        unit: this.UNIT_FAHRENHEIT,
        dimension: Dimension.TEMPERATURE,
        symbol: SymbolUnit.FAHRENHEIT,
        system: SystemUnit.IMPERIAL_US,
        default: true
      },
      {
        id: this.TEMPERATURE_KELVIN,
        unit: this.UNIT_KELVIN,
        dimension: Dimension.TEMPERATURE,
        symbol: SymbolUnit.KELVIN,
        system: SystemUnit.METRIC,
        default: false
      },
      {
        id: this.VOLUME_GALLONS,
        unit: this.UNIT_US_FLUID_GALLON,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.GALLON,
        system: SystemUnit.IMPERIAL_US,
        default: true
      },
      {
        id: this.VOLUME_PINTS,
        unit: this.UNIT_US_FLUID_PINT,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.PINT,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.VOLUME_QUARTS,
        unit: this.UNIT_US_FLUID_QUART,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.QUART,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.VOLUME_LITERS,
        unit: this.UNIT_LITER,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.LITER,
        system: SystemUnit.METRIC,
        default: false
      },
      {
        id: this.VOLUME_CUBIC_FEET,
        unit: this.UNIT_CUBIC_FOOT,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.CUBIC_FOOT,
        system: SystemUnit.IMPERIAL_US,
        default: false
      },
      {
        id: this.VOLUME_CUBIC_METERS,
        unit: this.UNIT_CUBIC_METER,
        dimension: Dimension.VOLUME,
        symbol: SymbolUnit.CUBIC_METER,
        system: SystemUnit.METRIC,
        default: true
      }
    ];
  }

  /**
   * Returns if alexa unit of measure id is supported
   * @param  {String}  id
   * @return {Boolean}
   */
  static isSupported(id) {
    return this.unitsOfMeasure.some((uom) => uom.id === id);
  }

  /**
   * Returns alexa unit of measure id based on given query
   * @param  {Object} query
   * @return {String}
   */
  static getId(query) {
    const uom = this.getUnitOfMeasure(query);
    return uom?.id;
  }

  /**
   * Returns alexa unit name based on given query
   * @param  {Object} query
   * @return {String}
   */
  static getUnit(query) {
    const uom = this.getUnitOfMeasure(query);
    return uom?.unit;
  }

  /**
   * Returns unit of measure based on given query
   * @param  {String} dimension
   * @param  {String} statePresentation
   * @param  {String} system
   * @return {Object}
   */
  static getUnitOfMeasure({ dimension, statePresentation, system = SystemUnit.METRIC }) {
    // Determine query symbol using item state presentation
    const symbol = this.getSymbol(statePresentation);
    // Return unit of measure using query symbol/dimension or fallback to default value using query dimension/system
    return (
      this.unitsOfMeasure.find((uom) => uom.symbol === symbol && (!dimension || uom.dimension === dimension)) ||
      this.unitsOfMeasure.find(
        (uom) => uom.default && uom.dimension === dimension && (!uom.system || uom.system === system)
      )
    );
  }

  /**
   * Returns symbol based on given item state presentation pattern
   * @param  {String} pattern
   * @return {String}
   */
  static getSymbol(pattern) {
    try {
      // Use a random number to format the item state presentation
      const presentation = sprintf(pattern, Math.random());
      // Return symbol based on the supported list matching the formatted item state presentation
      return this.unitsOfMeasure
        .map((uom) => uom.symbol)
        .find((symbol) => new RegExp(`\\d\\s*${symbol}$`).test(presentation));
    } catch {
      return undefined;
    }
  }
}
