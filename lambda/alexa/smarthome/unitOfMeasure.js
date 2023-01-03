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
import { Dimension, UnitSymbol, UnitSystem } from '#openhab/constants.js';

/**
 * Defines Alexa unit of measure class
 *   https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#units-of-measure
 */
export class AlexaUnitOfMeasure {
  /**
   * Defines angle degrees uom
   * @type {String}
   */
  static ANGLE_DEGREES = 'Angle.Degrees';

  /**
   * Defines angle radians uom
   * @type {String}
   */
  static ANGLE_RADIANS = 'Angle.Radians';

  /**
   * Defines distance yards uom
   * @type {String}
   */
  static DISTANCE_YARDS = 'Distance.Yards';

  /**
   * Defines distance inches uom
   * @type {String}
   */
  static DISTANCE_INCHES = 'Distance.Inches';

  /**
   * Defines distance feet uom
   * @type {String}
   */
  static DISTANCE_FEET = 'Distance.Feet';

  /**
   * Defines distance miles uom
   * @type {String}
   */
  static DISTANCE_MILES = 'Distance.Miles';

  /**
   * Defines distance meters uom
   * @type {String}
   */
  static DISTANCE_METERS = 'Distance.Meters';

  /**
   * Defines distance kilometers uom
   * @type {String}
   */
  static DISTANCE_KILOMETERS = 'Distance.Kilometers';

  /**
   * Defines mass gram uom
   * @type {String}
   */
  static MASS_GRAM = 'Mass.Grams';

  /**
   * Defines mass kilograms uom
   * @type {String}
   */
  static MASS_KILOGRAMS = 'Mass.Kilograms';

  /**
   * Defines weight ounces uom
   * @type {String}
   */
  static WEIGHT_OUNCES = 'Weight.Ounces';

  /**
   * Defines weight pounds uom
   * @type {String}
   */
  static WEIGHT_POUNDS = 'Weight.Pounds';

  /**
   * Defines percent uom
   * @type {String}
   */
  static PERCENT = 'Percent';

  /**
   * Defines temperature degrees uom
   * @type {String}
   */
  static TEMPERATURE_DEGREES = 'Temperature.Degrees';

  /**
   * Defines temperature celsius uom
   * @type {String}
   */
  static TEMPERATURE_CELSIUS = 'Temperature.Celsius';

  /**
   * Defines temperature fahrenheit uom
   * @type {String}
   */
  static TEMPERATURE_FAHRENHEIT = 'Temperature.Fahrenheit';

  /**
   * Defines temperature kelvin uom
   * @type {String}
   */
  static TEMPERATURE_KELVIN = 'Temperature.Kelvin';

  /**
   * Defines volume gallon uom
   * @type {String}
   */
  static VOLUME_GALLONS = 'Volume.Gallons';

  /**
   * Defines volume pints uom
   * @type {String}
   */
  static VOLUME_PINTS = 'Volume.Pints';

  /**
   * Defines volume quarts uom
   * @type {String}
   */
  static VOLUME_QUARTS = 'Volume.Quarts';

  /**
   * Defines volume liters uom
   * @type {String}
   */
  static VOLUME_LITERS = 'Volume.Liters';

  /**
   * Defines volume cubic feet uom
   * @type {String}
   */
  static VOLUME_CUBIC_FEET = 'Volume.CubicFeet';

  /**
   * Defines volume cubic meters uom
   * @type {String}
   */
  static VOLUME_CUBIC_METERS = 'Volume.CubicMeters';

  /**
   * Returns if alexa unit of measure is supported
   * @param  {String}  name
   * @return {Boolean}
   */
  static isSupported(name) {
    return Object.values(this).includes(name);
  }

  /**
   * Returns alexa unit of measure id based on given name
   * @param  {String} name
   * @return {String}
   */
  static getId(name) {
    return 'Alexa.Unit.' + name;
  }

  /**
   * Returns alexa unit of measure based on given parameters
   * @param  {Object} parameters
   * @return {String}
   */
  static valueOf(parameters) {
    const uom = UnitsOfMeasure.getUnitOfMeasure(parameters);
    return uom?.name;
  }
}

/**
 * Defines alexa unit of mass class
 *   https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#weight-unit
 */
class AlexaUnitOfMass {
  /**
   * Defines gram unit
   * @type {String}
   */
  static GRAM = 'GRAM';

  /**
   * Defines kilogram unit
   * @type {String}
   */
  static KILOGRAM = 'KILOGRAM';

  /**
   * Defines ounce unit
   * @type {String}
   */
  static OUNCE = 'OUNCE';

  /**
   * Defines pound unit
   * @type {String}
   */
  static POUND = 'POUND';
}

/**
 * Defines alexa unit of temperature class
 *   https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#temperature-scales
 */
export class AlexaUnitOfTemperature {
  /**
   * Defines celsius unit
   * @type {String}
   */
  static CELSIUS = 'CELSIUS';

  /**
   * Defines fahrenheit unit
   * @type {String}
   */
  static FAHRENHEIT = 'FAHRENHEIT';

  /**
   * Defines kelvin unit
   * @type {String}
   */
  static KELVIN = 'KELVIN';

  /**
   * Returns alexa unit of temperature based on given parameters
   * @param  {Object} parameters
   * @return {String}
   */
  static valueOf(parameters) {
    const uom = UnitsOfMeasure.getUnitOfMeasure({ dimension: Dimension.TEMPERATURE, ...parameters });
    return uom?.unit;
  }
}

/**
 * Defines alexa unit of volume class
 *   https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#volume-unit
 */
class AlexaUnitOfVolume {
  /**
   * Defines us fluid gallon unit
   * @type {String}
   */
  static US_FLUID_GALLON = 'US_FLUID_GALLON';

  /**
   * Defines us fluid pint unit
   * @type {String}
   */
  static US_FLUID_PINT = 'US_FLUID_PINT';

  /**
   * Defines us fluid quart unit
   * @type {String}
   */
  static US_FLUID_QUART = 'US_FLUID_QUART';

  /**
   * Defines liter unit
   * @type {String}
   */
  static LITER = 'LITER';

  /**
   * Defines cubic foot unit
   * @type {String}
   */
  static CUBIC_FOOT = 'CUBIC_FOOT';

  /**
   * Defines cubic meter unit
   * @type {String}
   */
  static CUBIC_METER = 'CUBIC_METER';
}

/**
 * Defines units of measure class
 */
class UnitsOfMeasure {
  /**
   * Defines units of measure
   *
   *    {
   *      name: <alexaUnitOfMesure>,             (Alexa unit of measure name)
   *      unit: <alexaUnit>,                     (Alexa unit name)
   *      dimension: <ohUnitOfMeasureDimension>, (OH unit of measure item type number dimension)
   *      symbol: <ohUnitOfMeasureSymbol>,       (OH unit of measure item state symbol)
   *      system: <ohUnitOfMeasureSystem>,       (OH unit of measure sytem)
   *      default: <ohUnitOfMesureDefault>,      (OH unit of measure default boolean)
   *    }
   *
   * @type {Array}
   */
  static #UOMS = [
    {
      name: AlexaUnitOfMeasure.ANGLE_DEGREES,
      dimension: Dimension.ANGLE,
      symbol: UnitSymbol.DEGREE,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.ANGLE_RADIANS,
      dimension: Dimension.ANGLE,
      symbol: UnitSymbol.RADIAN,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.PERCENT,
      dimension: Dimension.DIMENSIONLESS,
      symbol: UnitSymbol.PERCENT,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_YARDS,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.YARD,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_INCHES,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.INCH,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_FEET,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.FOOT,
      system: UnitSystem.IMPERIAL_US,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_MILES,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.MILE,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_METERS,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.METER,
      system: UnitSystem.METRIC,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.DISTANCE_KILOMETERS,
      dimension: Dimension.LENGTH,
      symbol: UnitSymbol.KILOMETER,
      system: UnitSystem.METRIC,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.MASS_GRAMS,
      unit: AlexaUnitOfMass.GRAM,
      dimension: Dimension.MASS,
      symbol: UnitSymbol.GRAM,
      system: UnitSystem.METRIC,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.MASS_KILOGRAMS,
      unit: AlexaUnitOfMass.KILOGRAM,
      dimension: Dimension.MASS,
      symbol: UnitSymbol.KILOGRAM,
      system: UnitSystem.METRIC,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.WEIGHT_OUNCES,
      unit: AlexaUnitOfMass.OUNCE,
      dimension: Dimension.MASS,
      symbol: UnitSymbol.OUNCE,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.WEIGHT_POUNDS,
      unit: AlexaUnitOfMass.POUND,
      dimension: Dimension.MASS,
      symbol: UnitSymbol.POUND,
      system: UnitSystem.IMPERIAL_US,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.TEMPERATURE_DEGREES,
      dimension: Dimension.TEMPERATURE,
      symbol: UnitSymbol.DEGREE,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.TEMPERATURE_CELSIUS,
      unit: AlexaUnitOfTemperature.CELSIUS,
      dimension: Dimension.TEMPERATURE,
      symbol: UnitSymbol.CELSIUS,
      system: UnitSystem.METRIC,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.TEMPERATURE_FAHRENHEIT,
      unit: AlexaUnitOfTemperature.FAHRENHEIT,
      dimension: Dimension.TEMPERATURE,
      symbol: UnitSymbol.FAHRENHEIT,
      system: UnitSystem.IMPERIAL_US,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.TEMPERATURE_KELVIN,
      unit: AlexaUnitOfTemperature.KELVIN,
      dimension: Dimension.TEMPERATURE,
      symbol: UnitSymbol.KELVIN,
      system: UnitSystem.METRIC,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_GALLONS,
      unit: AlexaUnitOfVolume.US_FLUID_GALLON,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.GALLON,
      system: UnitSystem.IMPERIAL_US,
      default: true
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_PINTS,
      unit: AlexaUnitOfVolume.US_FLUID_PINT,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.PINT,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_QUARTS,
      unit: AlexaUnitOfVolume.US_FLUID_QUART,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.QUART,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_LITERS,
      unit: AlexaUnitOfVolume.LITER,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.LITER,
      system: UnitSystem.METRIC,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_CUBIC_FEET,
      unit: AlexaUnitOfVolume.CUBIC_FOOT,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.CUBIC_FOOT,
      system: UnitSystem.IMPERIAL_US,
      default: false
    },
    {
      name: AlexaUnitOfMeasure.VOLUME_CUBIC_METERS,
      unit: AlexaUnitOfVolume.CUBIC_METER,
      dimension: Dimension.VOLUME,
      symbol: UnitSymbol.CUBIC_METER,
      system: UnitSystem.METRIC,
      default: true
    }
  ];

  /**
   * Returns unit of measure based on given parameters
   * @param  {String} dimension
   * @param  {String} statePresentation
   * @param  {String} system
   * @return {Object}
   */
  static getUnitOfMeasure({ dimension, statePresentation, system = UnitSystem.METRIC }) {
    // Determine symbol using item state presentation
    const symbol = this.getUnitSymbol(statePresentation);
    // Return unit of measure using symbol/dimension or fallback to default value using dimension/system
    return (
      this.#UOMS.find((uom) => uom.symbol === symbol && (!dimension || uom.dimension === dimension)) ||
      this.#UOMS.find((uom) => uom.default && uom.dimension === dimension && (!uom.system || uom.system === system))
    );
  }

  /**
   * Returns unit symbol based on given item state presentation pattern
   * @param  {String} pattern
   * @return {String}
   */
  static getUnitSymbol(pattern) {
    try {
      // Use a random number to format the item state presentation
      const presentation = sprintf(pattern, Math.random());
      // Return symbol based on the supported list matching the formatted item state presentation
      return Object.values(UnitSymbol).find((symbol) => new RegExp(`\\d\\s*${symbol}$`).test(presentation));
    } catch {
      return undefined;
    }
  }
}
