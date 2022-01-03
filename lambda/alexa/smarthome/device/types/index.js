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
 * Defines supported device types classes
 * @type {Object}
 */
module.exports = {
  Activity: require('./activity'),
  AirConditioner: require('./airConditioner'),
  AirFreshener: require('./airFreshener'),
  AirPurifier: require('./airPurifier'),
  Automobile: require('./automobile'),
  AutomobileAccessory: require('./automobileAccessory'),
  BluetoothSpeaker: require('./bluetoothSpeaker'),
  Camera: require('./camera'),
  ChristmasTree: require('./christmasTree'),
  CoffeeMaker: require('./coffeeMaker'),
  Computer: require('./computer'),
  ContactSensor: require('./contactSensor'),
  Dishwasher: require('./dishwasher'),
  Door: require('./door'),
  Doorbell: require('./doorbell'),
  Dummy: require('./dummy'),
  Dryer: require('./dryer'),
  ExteriorBlind: require('./exteriorBlind'),
  Fan: require('./fan'),
  GameConsole: require('./gameConsole'),
  GarageDoor: require('./garageDoor'),
  Headphones: require('./headphones'),
  Hub: require('./hub'),
  InteriorBlind: require('./interiorBlind'),
  Laptop: require('./laptop'),
  Light: require('./light'),
  Lock: require('./lock'),
  Microwave: require('./microwave'),
  MobilePhone: require('./mobilePhone'),
  MotionSensor: require('./motionSensor'),
  MusicSystem: require('./musicSystem'),
  NetworkHardware: require('./networkHardware'),
  Other: require('./other'),
  Outlet: require('./outlet'),
  Oven: require('./oven'),
  Phone: require('./phone'),
  Printer: require('./printer'),
  Router: require('./router'),
  Scene: require('./scene'),
  Screen: require('./screen'),
  SecurityPanel: require('./securityPanel'),
  SecuritySystem: require('./securitySystem'),
  SlowCooker: require('./slowCooker'),
  Speaker: require('./speaker'),
  StreamingDevice: require('./streamingDevice'),
  Switch: require('./switch'),
  Tablet: require('./tablet'),
  Television: require('./television'),
  TemperatureSensor: require('./temperatureSensor'),
  Thermostat: require('./thermostat'),
  VacuumCleaner: require('./vacuumCleaner'),
  Washer: require('./washer'),
  WaterHeater: require('./waterHeater'),
  Wearable: require('./wearable')
};

/**
 * Returns device type based on given name
 * @param  {String} name
 * @return {Object}
 */
module.exports.get = function (name) {
  return Object.values(this).find(
    (deviceType) =>
      (deviceType.supportedNames && deviceType.supportedNames.includes(name)) ||
      // Fallback to display category for backward compatibility
      (deviceType.displayCategories && deviceType.displayCategories.includes(name))
  );
};
