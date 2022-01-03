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
 * Defines alexa global catalog class
 *    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#global-alexa-catalog
 */
class AlexaGlobalCatalog {
  /**
   * Defines device name air purifier asset
   * @type {String}
   */
  static DEVICE_NAME_AIR_PURIFIER = '@DeviceName.AirPurifier';

  /**
   * Defines device name camera asset
   * @type {String}
   */
  static DEVICE_NAME_CAMERA = '@DeviceName.Camera';

  /**
   * Defines device name fan asset
   * @type {String}
   */
  static DEVICE_NAME_FAN = '@DeviceName.Fan';

  /**
   * Defines device name router asset
   * @type {String}
   */
  static DEVICE_NAME_ROUTER = '@DeviceName.Router';

  /**
   * Defines device name shade asset
   * @type {String}
   */
  static DEVICE_NAME_SHADE = '@DeviceName.Shade';

  /**
   * Defines device name shower asset
   * @type {String}
   */
  static DEVICE_NAME_SHOWER = '@DeviceName.Shower';

  /**
   * Defines device name space heater asset
   * @type {String}
   */
  static DEVICE_NAME_SPACE_HEATER = '@DeviceName.SpaceHeater';

  /**
   * Defines device name washer asset
   * @type {String}
   */
  static DEVICE_NAME_WASHER = '@DeviceName.Washer';

  /**
   * Defines setting 2g guest wifi asset
   * @type {String}
   */
  static SETTING_2G_GUEST_WIFI = '@Setting.2GGuestWiFi';

  /**
   * Defines setting 5g guest wifi asset
   * @type {String}
   */
  static SETTING_5G_GUEST_WIFI = '@Setting.5GGuestWiFi';

  /**
   * Defines setting auto asset
   * @type {String}
   */
  static SETTING_AUTO = '@Setting.Auto';

  /**
   * Defines setting direction asset
   * @type {String}
   */
  static SETTING_DIRECTION = '@Setting.Direction';

  /**
   * Defines setting dry cycle asset
   * @type {String}
   */
  static SETTING_DRY_CYCLE = '@Setting.DryCycle';

  /**
   * Defines setting fan speed asset
   * @type {String}
   */
  static SETTING_FAN_SPEED = '@Setting.FanSpeed';

  /**
   * Defines setting guest wifi asset
   * @type {String}
   */
  static SETTING_GUEST_WIFI = '@Setting.GuestWiFi';

  /**
   * Defines setting heat asset
   * @type {String}
   */
  static SETTING_HEAT = '@Setting.Heat';

  /**
   * Defines setting mode asset
   * @type {String}
   */
  static SETTING_MODE = '@Setting.Mode';

  /**
   * Defines setting night asset
   * @type {String}
   */
  static SETTING_NIGHT = '@Setting.Night';

  /**
   * Defines setting opening asset
   * @type {String}
   */
  static SETTING_OPENING = '@Setting.Opening';

  /**
   * Defines setting oscillate asset
   * @type {String}
   */
  static SETTING_OSCILLATE = '@Setting.Oscillate';

  /**
   * Defines setting preset asset
   * @type {String}
   */
  static SETTING_PRESET = '@Setting.Preset';

  /**
   * Defines setting quiet asset
   * @type {String}
   */
  static SETTING_QUIET = '@Setting.Quiet';

  /**
   * Defines setting temperature asset
   * @type {String}
   */
  static SETTING_TEMPERATURE = '@Setting.Temperature';

  /**
   * Defines setting wash cycle asset
   * @type {String}
   */
  static SETTING_WASH_CYCLE = '@Setting.WashCycle';

  /**
   * Defines setting water temperature asset
   * @type {String}
   */
  static SETTING_WATER_TEMPERATURE = '@Setting.WaterTemperature';

  /**
   * Defines shower hand held asset
   * @type {String}
   */
  static SHOWER_HAND_HELD = '@Shower.HandHeld';

  /**
   * Defines shower rain head asset
   * @type {String}
   */
  static SHOWER_RAIN_HEAD = '@Shower.RainHead';

  /**
   * Defines value close asset
   * @type {String}
   */
  static VALUE_CLOSE = '@Value.Close';

  /**
   * Defines value delicate asset
   * @type {String}
   */
  static VALUE_DELICATE = '@Value.Delicate';

  /**
   * Defines value high asset
   * @type {String}
   */
  static VALUE_HIGH = '@Value.High';

  /**
   * Defines value low asset
   * @type {String}
   */
  static VALUE_LOW = '@Value.Low';

  /**
   * Defines value maximum asset
   * @type {String}
   */
  static VALUE_MAXIMUM = '@Value.Maximum';

  /**
   * Defines value medium asset
   * @type {String}
   */
  static VALUE_MEDIUM = '@Value.Medium';

  /**
   * Defines value minimum asset
   * @type {String}
   */
  static VALUE_MINIMUM = '@Value.Minimum';

  /**
   * Defines value open asset
   * @type {String}
   */
  static VALUE_OPEN = '@Value.Open';

  /**
   * Defines value quick wash asset
   * @type {String}
   */
  static VALUE_QUICK_WASH = '@Value.QuickWash';

  /**
   * Returns if asset id is supported
   * @param  {String}  assetId
   * @return {Boolean}
   */
  static isSupported(assetId) {
    return Object.values(AlexaGlobalCatalog).includes(assetId);
  }

  /**
   * Returns list of label object values
   * @param  {String} assetId
   * @return {Array}
   */
  static getLabels(assetId) {
    return [{ assetId: 'Alexa.' + assetId.slice(1) }];
  }
}

/**
 * Defines alexa asset catalog class
 * @extends AlexaGlobalCatalog
 */
class AlexaAssetCatalog extends AlexaGlobalCatalog {
  /**
   * Defines setting angle asset
   * @type {String}
   */
  static SETTING_ANGLE = '@Setting.Angle';

  /**
   * Defines setting battery level asset
   * @type {String}
   */
  static SETTING_BATTERY_LEVEL = '@Setting.BatteryLevel';

  /**
   * Defines setting clean asset
   * @type {String}
   */
  static SETTING_CLEAN = '@Setting.Clean';

  /**
   * Defines setting dock asset
   * @type {String}
   */
  static SETTING_DOCK = '@Setting.Dock';

  /**
   * Defines setting forward asset
   * @type {String}
   */
  static SETTING_FORWARD = '@Setting.Forward';

  /**
   * Defines setting humidity asset
   * @type {String}
   */
  static SETTING_HUMIDITY = '@Setting.Humidity';

  /**
   * Defines setting input asset
   * @type {String}
   */
  static SETTING_INPUT = '@Setting.Input';

  /**
   * Defines setting position asset
   * @type {String}
   */
  static SETTING_POSTION = '@Setting.Position';

  /**
   * Defines setting range value asset
   * @type {String}
   */
  static SETTING_RANGE_VALUE = '@Setting.RangeValue';

  /**
   * Defines setting reverse asset
   * @type {String}
   */
  static SETTING_REVERSE = '@Setting.Reverse';

  /**
   * Defines setting speed asset
   * @type {String}
   */
  static SETTING_SPEED = '@Setting.Speed';

  /**
   * Defines setting spot asset
   * @type {String}
   */
  static SETTING_SPOT = '@Setting.Spot';

  /**
   * Defines setting target temperature asset
   * @type {String}
   */
  static SETTING_TARGET_TEMPERATURE = '@Setting.TargetTemperature';

  /**
   * Defines setting tilt asset
   * @type {String}
   */
  static SETTING_TILT = '@Setting.Tilt';

  /**
   * Defines setting toggle state asset
   * @type {String}
   */
  static SETTING_TOGGLE_STATE = '@Setting.ToggleState';

  /**
   * Defines value decrease asset
   * @type {String}
   */
  static VALUE_DECREASE = '@Value.Decrease';

  /**
   * Defines value default asset
   * @type {String}
   */
  static VALUE_DEFAULT = '@Value.Default';

  /**
   * Defines value down asset
   * @type {String}
   */
  static VALUE_DOWN = '@Value.Down';

  /**
   * Defines value increase asset
   * @type {String}
   */
  static VALUE_INCREASE = '@Value.Increase';

  /**
   * Defines value left asset
   * @type {String}
   */
  static VALUE_LEFT = '@Value.Left';

  /**
   * Defines value move asset
   * @type {String}
   */
  static VALUE_MOVE = '@Value.Move';

  /**
   * Defines value off asset
   * @type {String}
   */
  static VALUE_OFF = '@Value.Off';

  /**
   * Defines value on asset
   * @type {String}
   */
  static VALUE_ON = '@Value.On';

  /**
   * Defines value pause asset
   * @type {String}
   */
  static VALUE_PAUSE = '@Value.Pause';

  /**
   * Defines value resume asset
   * @type {String}
   */
  static VALUE_RESUME = '@Value.Resume';

  /**
   * Defines value right asset
   * @type {String}
   */
  static VALUE_RIGHT = '@Value.Right';

  /**
   * Defines value start asset
   * @type {String}
   */
  static VALUE_START = '@Value.Start';

  /**
   * Defines value stop asset
   * @type {String}
   */
  static VALUE_STOP = '@Value.Stop';

  /**
   * Defines value up asset
   * @type {String}
   */
  static VALUE_UP = '@Value.Up';

  /**
   * Returns custom catalog label values
   *  This is a temporary solution until Amazon provides the ability to upload our own catalog:
   *    https://developer.amazon.com/docs/device-apis/resources-and-assets.html#upload-your-own-catalog
   *
   *  {
   *    '<assetId>': [
   *      {
   *        text: '<label>',
   *        locale: '<locale>'
   *      }
   *    ]
   *  }
   *
   * @return {Object}
   */
  static get labelValues() {
    return require('@root/catalog.json');
  }

  /**
   * Returns if asset id is supported
   * @param  {String}  assetId
   * @return {Boolean}
   */
  static isSupported(assetId) {
    return super.isSupported(assetId) || Object.values(AlexaAssetCatalog).includes(assetId);
  }

  /**
   * Returns list of label object values
   * @param  {String} assetId
   * @return {Array}
   */
  static getLabels(assetId) {
    return super.isSupported(assetId) ? super.getLabels(assetId) : this.labelValues[assetId];
  }
}

module.exports = AlexaAssetCatalog;
