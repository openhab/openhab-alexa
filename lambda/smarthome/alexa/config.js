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

/**
 * Returns alexa configuration
 * @type {Object}
 */
module.exports = Object.freeze({
  /**
   * Defines alexa capabilities
   *
   *  {
   *    <interfaceName1>: {
   *      'category': <defaultCategoryName>,
   *      'properties': [
   *        {
   *          'name': <propertyName1>,
   *          'schema': <propertySchemaName1>,
   *          'report': <propertyReportName1>,        (Use if report property name different than discovery one)
   *          'components': [ <componentName1>, ... ] (Use if sub-property components are needed)
   *          'isReportable': <boolean>,              (Include in context properties response)
   *          'isSupported': <boolean>,               (Include in capabilities supported properties discovery response)
   *          'multiInstance': <boolean>              (Support multi-instance)
   *        },
   *        ...
   *      ]
   *    }
   *  }
   *
   * @type {Object}
   */
  CAPABILITIES: {
    'Alexa': {
      'properties': []
    },
    'BrightnessController': {
      'category': 'LIGHT',
      'properties': [
        {'name': 'brightness', 'schema': 'brightness'}
      ]
    },
    'CameraStreamController': {
      'category': 'CAMERA',
      'properties': []
    },
    'ChannelController': {
      'category': 'TV',
      'properties': [
        {'name': 'channel', 'schema': 'channel'}
      ]
    },
    'ColorController': {
      'category': 'LIGHT',
      'properties': [
        {'name': 'color', 'schema': 'color'}
      ]
    },
    'ColorTemperatureController': {
      'category': 'LIGHT',
      'properties': [
        {'name': 'colorTemperatureInKelvin', 'schema': 'colorTemperatureInKelvin'}
      ]
    },
    'ContactSensor': {
      'category': 'CONTACT_SENSOR',
      'properties': [
        {'name': 'detectionState', 'schema': 'detectionState'}
      ]
    },
    'EndpointHealth': {
      'properties' : [
        {'name': 'connectivity', 'schema': 'connectivity'}
      ]
    },
    'EqualizerController': {
      'category': 'SPEAKER',
      'properties': [
        {'name': 'bands', 'schema': 'equalizerBands', 'components': ['bass', 'midrange', 'treble']},
        {'name': 'modes', 'schema': 'equalizerMode', 'report': 'mode'}
      ]
    },
    'InputController': {
      'category': 'TV',
      'properties': [
        {'name': 'input', 'schema': 'inputs', 'isSupported': false}
      ]
    },
    'LockController': {
      'category': 'SMARTLOCK',
      'properties': [
        {'name': 'lockState', 'schema': 'lockState'}
      ]
    },
    'ModeController': {
      'category': 'OTHER',
      'properties': [
        {'name': 'mode', 'schema': 'mode', 'multiInstance': true}
      ]
    },
    'MotionSensor': {
      'category': 'MOTION_SENSOR',
      'properties': [
        {'name': 'detectionState', 'schema': 'detectionState'}
      ]
    },
    'PercentageController': {
      'category': 'OTHER',
      'properties': [
        {'name': 'percentage', 'schema': 'percentage'}
      ]
    },
    'PlaybackController': {
      'category': 'OTHER',
      'properties': [
        {'name': 'playback', 'schema': 'playback', 'isReportable': false, 'isSupported': false}
      ]
    },
    'PowerController': {
      'category': 'SWITCH',
      'properties': [
        {'name': 'powerState', 'schema': 'powerState'}
      ]
    },
    'PowerLevelController': {
      'category': 'SWITCH',
      'properties': [
        {'name': 'powerLevel', 'schema': 'powerLevel'}
      ]
    },
    'RangeController': {
      'category': 'OTHER',
      'properties': [
        {'name': 'rangeValue', 'schema': 'rangeValue', 'multiInstance': true}
      ]
    },
    'SceneController': {
      'category': 'SCENE_TRIGGER',
      'properties': [
        {'name': 'scene', 'schema': 'scene', 'isReportable': false, 'isSupported': false}
      ]
    },
    'SecurityPanelController': {
      'category': 'SECURITY_PANEL',
      'properties': [
        {'name': 'armState', 'schema': 'armState'},
        {'name': 'burglaryAlarm', 'schema': 'alarmState'},
        {'name': 'fireAlarm', 'schema': 'alarmState'},
        {'name': 'carbonMonoxideAlarm', 'schema': 'alarmState'},
        {'name': 'waterAlarm', 'schema': 'alarmState'}
      ]
    },
    'Speaker': {
      'category': 'SPEAKER',
      'properties': [
        {'name': 'muted', 'schema': 'muteState'},
        {'name': 'volume', 'schema': 'volumeLevel'}
      ]
    },
    'StepSpeaker': {
      'category': 'SPEAKER',
      'properties': [
        {'name': 'muted', 'schema': 'muteState', 'isReportable': false, 'isSupported': false},
        {'name': 'volume', 'schema': 'volumeSteps', 'isReportable': false, 'isSupported': false}
      ]
    },
    'TemperatureSensor' : {
      'category': 'TEMPERATURE_SENSOR',
      'properties': [
        {'name': 'temperature', 'schema': 'temperature'}
      ]
    },
    'ThermostatController': {
      'category': 'THERMOSTAT',
      'properties': [
        {'name': 'targetSetpoint', 'schema': 'temperature'},
        {'name': 'lowerSetpoint', 'schema': 'temperature'},
        {'name': 'upperSetpoint', 'schema': 'temperature'},
        {'name': 'thermostatMode', 'schema': 'thermostatMode'}
      ]
    },
    'ToggleController': {
      'category': 'OTHER',
      'properties': [
        {'name': 'toggleState', 'schema': 'toggleState', 'multiInstance': true}
      ]
    }
  },

  /**
   * Defines alexa capability property schemas
   *  https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html
   *
   *  {
   *    <propertySchemaName1>: {
   *      'itemTypes': [ <itemType1>, ... ],
   *      'state': {
   *        'map': {
   *          'custom:<parameterName>': {
   *            <parameterValue1>: {
   *              <alexaState1>: { '<value1>,<value2>,...', ... },
   *              ...
   *            },
   *            ...
   *          },
   *          'default': {
   *            <itemType1>: {
   *              <alexaState1>: { '<value1>,<value2>,...', ... },
   *              ...
   *            },
   *            ...
   *          }
   *        },
   *        'range': {
   *          'custom:<parameterName>': {
   *            <parameterValue1>: [ <minimumValue>, <maximumValue>, <optionalPrecisionValue> ],
   *            ...
   *          },
   *          'default': {
   *            <itemType1>: [ <minimumValue>, <maximumValue>, <optionalPrecisionValue> ],
   *            ...
   *          }
   *        },
   *        'type': <typeValue1>
   *      }
   *    }
   *  }
   *
   * @type {Object}
   */
  PROPERTY_SCHEMAS: {
    'alarmState': {
      'itemTypes': ['Contact', 'Switch'],
      'state': {
        'map': {
          'default': {
            'Contact': {'OK': 'CLOSED', 'ALARM': 'OPEN'},
            'Switch':  {'OK': 'OFF', 'ALARM': 'ON'}
          }
        },
        'type': 'string'
      }
    },
    'armState': {
      'itemTypes': ['Number', 'String', 'Switch'],
      'state': {
        'map': {
          'default': {
            'Number': {
              'DISARMED': '0', 'ARMED_STAY': '1', 'ARMED_AWAY': '2', 'ARMED_NIGHT': '3', 'AUTHORIZATION_REQUIRED': '4',
              'NOT_READY': '5', 'UNCLEARED_ALARM': '6', 'UNCLEARED_TROUBLE': '7', 'BYPASS_NEEDED': '8'
            },
            'String': {
              'DISARMED': 'disarm', 'ARMED_STAY': 'stay', 'ARMED_AWAY': 'away', 'ARMED_NIGHT': 'night',
              'AUTHORIZATION_REQUIRED': 'authreq', 'UNAUTHORIZED': 'unauth', 'NOT_READY': 'notrdy',
              'UNCLEARED_ALARM': 'alarm', 'UNCLEARED_TROUBLE': 'trouble', 'BYPASS_NEEDED': 'bypass'
            },
            'Switch': {'DISARMED': 'OFF', 'ARMED_STAY': 'ON'}
          }
        },
        'supported': [
          // https://developer.amazon.com/docs/device-apis/alexa-securitypanelcontroller.html#configuration
          'ARMED_AWAY', 'ARMED_STAY', 'ARMED_NIGHT', 'DISARMED'
        ],
        'type': 'string'
      }
    },
    'brightness': {
      'itemTypes': ['Color', 'Dimmer'],
      'state': {
        'type': 'integer'
      }
    },
    'channel': {
      'itemTypes': ['Number', 'String'],
      'state': {
        'type': 'object'
      }
    },
    'color': {
      'itemTypes': ['Color'],
      'state': {
        'type': 'object'
      }
    },
    'colorTemperatureInKelvin': {
      'itemTypes': ['Dimmer', 'Number'],
      'state': {
        'map': {
          'custom:omitSaturationColorMode': {
            'hue': true
          }
        },
        'range': {
          'custom:binding': {
            // use binding name and thing type to differentiate white & color ranges
            'hue': (type) =>
              ['white', '0220'].includes(type) ? [2200, 6500] : [2000, 6500],
            'lifx': (type) =>
              ['white', 'whitelight'].includes(type) ? [2700, 6500] : [2500, 9000],
            'milight': (type) =>
              ['white', 'whiteLed'].includes(type) ? [2700, 6500] : [2700, 6500],
            'tradfri': (type) =>
              ['white', '0220'].includes(type) ? [2200, 4000] : [1780, 6000],
            'yeelight': (type) =>
              ['white', 'ceiling', 'dolphin'].includes(type) ? [2700, 6500] : [1700, 6500]
          },
          'default': [1000, 10000]
        },
        'type': 'integer'
      }
    },
    'connectivity': {
      'state': {
        'type': 'object'
      }
    },
    'detectionState': {
      'itemTypes': ['Contact', 'Switch'],
      'state': {
        'map': {
          'default': {
            'Contact': {'NOT_DETECTED': 'CLOSED', 'DETECTED': 'OPEN'},
            'Switch':  {'NOT_DETECTED': 'OFF', 'DETECTED': 'ON'}
          }
        },
        'type': 'string'
      }
    },
    'equalizerBands': {
      'itemTypes': ['Dimmer', 'Number'],
      'state': {
        'range': {
          'default': {
            'Dimmer': [0, 100],
            'Number': [-10, 10]
          }
        },
        'type': 'integer'
      }
    },
    'equalizerMode': {
      'itemTypes': ['Number', 'String'],
      'state': {
        'map': {
          'default': {
            'Number': {'MOVIE': '1', 'MUSIC': '2', 'NIGHT': '3', 'SPORT': '4', 'TV': '5'},
            'String': {'MOVIE': 'movie', 'MUSIC': 'music', 'NIGHT': 'night', 'SPORT': 'sport', 'TV': 'tv'}
          }
        },
        'supported': [
          // https://developer.amazon.com/docs/device-apis/alexa-equalizercontroller.html#discovery
          'MOVIE', 'MUSIC', 'NIGHT', 'SPORT', 'TV'
        ],
        'type': 'string'
      }
    },
    'inputs': {
      'itemTypes': ['String'],
      'state': {
        'supported': [
          // https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#input-values
          'AUX 1', 'AUX 2', 'AUX 3', 'AUX 4', 'AUX 5', 'AUX 6', 'AUX 7', 'BLURAY', 'CABLE', 'CD',
          'COAX 1', 'COAX 2', 'COMPOSITE 1', 'DVD', 'GAME', 'HD RADIO', 'HDMI 1', 'HDMI 2', 'HDMI 3',
          'HDMI 4', 'HDMI 5', 'HDMI 6', 'HDMI 7', 'HDMI 8', 'HDMI 9', 'HDMI 10', 'HDMI ARC', 'INPUT 1',
          'INPUT 2', 'INPUT 3', 'INPUT 4', 'INPUT 5', 'INPUT 6', 'INPUT 7', 'INPUT 8', 'INPUT 9',
          'INPUT 10', 'IPOD', 'LINE 1', 'LINE 2', 'LINE 3', 'LINE 4', 'LINE 5', 'LINE 6', 'LINE 7',
          'MEDIA PLAYER', 'OPTICAL 1', 'OPTICAL 2', 'PHONO', 'PLAYSTATION', 'PLAYSTATION 3',
          'PLAYSTATION 4', 'SATELLITE', 'SMARTCAST', 'TUNER', 'TV', 'USB DAC', 'VIDEO 1', 'VIDEO 2',
          'VIDEO 3', 'XBOX'
        ],
        'type': 'string'
      }
    },
    'lockState': {
      'itemTypes': ['Switch'],
      'state': {
        'map': {
          'default': {
            'Contact': {'LOCKED': 'CLOSED', 'UNLOCKED': 'OPEN'},
            'Number':  {'LOCKED': '1', 'UNLOCKED': '2', 'JAMMED': '3'},
            'String':  {'LOCKED': 'locked', 'UNLOCKED': 'unlocked', 'JAMMED': 'jammed'},
            'Switch':  {'LOCKED': 'ON', 'UNLOCKED': 'OFF'}
          }
        },
        'type': 'string'
      }
    },
    'muteState': {
      'itemTypes': ['Switch'],
      'state': {
        'map': {
          'default': {
            'Switch':  {'true': 'ON', 'false': 'OFF'}
          }
        },
        'type': 'boolean'
      }
    },
    'mode': {
      'itemTypes': ['Number', 'String'],
      'state': {
        'type': 'string'
      }
    },
    'percentage': {
      'itemTypes': ['Dimmer', 'Rollershutter'],
      'state': {
        'type': 'integer'
      }
    },
    'playback': {
      'itemTypes': ['Player']
    },
    'powerLevel': {
      'itemTypes': ['Dimmer'],
      'state': {
        'type': 'integer'
      }
    },
    'powerState': {
      'itemTypes': ['Color', 'Dimmer', 'Switch'],
      'state': {
        'type': 'string'
      }
    },
    'rangeValue': {
      'itemTypes': ['Dimmer', 'Number', 'Number:Angle', 'Number:Dimensionless', 'Number:Length', 'Number:Mass',
        'Number:Temperature', 'Number:Volume', 'Rollershutter'],
      'state': {
        'range': {
          'default': {
            'Dimmer': [0, 100, 1],
            'Number': [0, 10, 1],
            'Rollershutter': [0, 100, 1]
          }
        },
        'type': 'integer'
      }
    },
    'scene': {
      'itemTypes': ['Switch']
    },
    'temperature': {
      'itemTypes': ['Number', 'Number:Temperature'],
      'state': {
        'range': {
          'default': {
            'comfort': {'CELSIUS': .5, 'FAHRENHEIT': 1},
            'setpoint': {'CELSIUS': [10, 32], 'FAHRENHEIT': [50, 90]}
          }
        },
        'type': 'object'
      }
    },
    'thermostatMode': {
      'itemTypes': ['Number', 'String', 'Switch'],
      'state': {
        'map': {
          'custom:binding': {
            'daikin':  {'AUTO': 'AUTO', 'COOL': 'COLD', 'HEAT': 'HEAT'},
            'ecobee1': {'AUTO': 'auto', 'COOL': 'cool', 'HEAT': 'heat', 'OFF': 'off'},
            'max':     {'AUTO': 'AUTOMATIC', 'HEAT': 'MANUAL', 'ECO': 'VACATION'},
            'nest':    {'AUTO': 'HEAT_COOL', 'COOL': 'COOL', 'HEAT': 'HEAT', 'ECO': 'ECO', 'OFF': 'OFF'},
            'nest1':   {'AUTO': 'heat-cool', 'COOL': 'cool', 'HEAT': 'heat', 'ECO': 'eco', 'OFF': 'off'},
            'zwave':   {'AUTO': '3', 'COOL': '2', 'HEAT': '1', 'OFF': '0'},
            'zwave1':  {'AUTO': '3', 'COOL': '2', 'HEAT': '1', 'OFF': '0'}
          },
          'default': {
            'Number': {'AUTO': '3', 'COOL': '2', 'HEAT': '1', 'ECO': '4', 'OFF': '0'},
            'String': {'AUTO': 'auto', 'ECO': 'eco', 'COOL': 'cool', 'HEAT': 'heat', 'OFF': 'off'},
            'Switch': {'HEAT': 'ON', 'OFF': 'OFF'}
          }
        },
        'supported': [
          // https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#thermostat-mode-values
          'AUTO', 'COOL', 'HEAT', 'ECO', 'OFF'
        ],
        'type': 'string'
      }
    },
    'toggleState': {
      'itemTypes': ['Color', 'Dimmer', 'Switch'],
      'state': {
        'type': 'string'
      }
    },
    'volumeLevel': {
      'itemTypes': ['Dimmer', 'Number'],
      'state': {
        'type': 'integer'
      }
    },
    'volumeSteps': {
      'itemTypes': ['Number']
    }
  },

  /**
   * Defines alexa global asset identifiers
   *  https://developer.amazon.com/docs/device-apis/resources-and-assets.html#global-alexa-catalog
   *
   * @type {Object}
   */
  ASSET_IDENTIFIERS: {
    'DeviceName': [
      'Shower', 'Washer', 'Router', 'Fan', 'AirPurifier', 'SpaceHeater'
    ],
    'Shower': [
      'RainHead', 'HandHeld'
    ],
    'Setting': [
      'WaterTemperature', 'Temperature', 'WashCycle', '2GGuestWiFi', '5GGuestWiFi', 'GuestWiFi',
      'Auto', 'Night', 'Quiet', 'Oscillate', 'FanSpeed', 'Preset', 'Mode', 'Direction'
    ],
    'Value': [
      'Delicate', 'QuickWash', 'Maximum', 'Minimum', 'High', 'Low', 'Medium'
    ]
  },

  /**
   * Defines alexa supported display categories
   *  https://developer.amazon.com/docs/device-apis/alexa-discovery.html#display-categories
   *
   * @type {Array}
   */
  DISPLAY_CATEGORIES: [
    'ACTIVITY_TRIGGER', 'CAMERA', 'CONTACT_SENSOR', 'DOOR', 'DOORBELL', 'LIGHT', 'MICROWAVE',
    'MOTION_SENSOR', 'OTHER', 'SCENE_TRIGGER', 'SECURITY_PANEL', 'SMARTLOCK', 'SMARTPLUG',
    'SPEAKER', 'SWITCH', 'TEMPERATURE_SENSOR', 'THERMOSTAT', 'TV'
  ],

  /**
   * Defines alexa supported unit of measurement
   *    https://developer.amazon.com/docs/device-apis/alexa-rangecontroller.html#supported-values-for-unitofmeasure
   *    https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html (Alexa units)
   *    https://www.openhab.org/docs/concepts/units-of-measurement.html#list-of-units (OH symbols + defaults)
   *
   *    {
   *      '<ohItemTypeNumberDimension>': [
   *        {
   *          'id': <alexaUnitOfMesureId>,        (Alexa unitOfMeasure id used by RangeController interface)
   *          'unit': <alexaUnit>,                (Alexa unit properties naming convention)
   *          'symbol': <ohUnitOfMeasureSymbol>,  (OH unit of measurement item state symbol)
   *          'system': <measurementSystem>,      (Measurement sytem)
   *          'default': <ohUnitOfMesureDefault>, (OH unit of measurement default boolean)
   *        },
   *        ...
   *      ],
   *      ...
   *    }
   *
   * @type {Object}
   */
  UNIT_OF_MEASUREMENT: {
    'Angle': [
      {'id': 'Angle.Degrees',           'unit': undefined,          'symbol': '°',    'system': 'SI', 'default': true },
      {'id': 'Angle.Radians',           'unit': undefined,          'symbol': 'rad',  'system': 'SI', 'default': false},
    ],
    'Dimensionless': [
      {'id': 'Percent',                 'unit': undefined,          'symbol': '%',    'system': 'SI', 'default': false},
    ],
    'Length': [
      {'id': 'Distance.Yards',          'unit': undefined,          'symbol': 'yd',   'system': 'US', 'default': false},
      {'id': 'Distance.Inches',         'unit': undefined,          'symbol': 'in',   'system': 'US', 'default': true },
      {'id': 'Distance.Meters',         'unit': undefined,          'symbol': 'm',    'system': 'SI', 'default': true },
      {'id': 'Distance.Feet',           'unit': undefined,          'symbol': 'ft',   'system': 'US', 'default': false},
      {'id': 'Distance.Miles',          'unit': undefined,          'symbol': 'mi',   'system': 'US', 'default': false},
      {'id': 'Distance.Kilometers',     'unit': undefined,          'symbol': 'km',   'system': 'SI', 'default': false},
    ],
    'Mass': [
      {'id': 'Mass.Kilograms',          'unit': 'KILOGRAM',         'symbol': 'kg',   'system': 'SI', 'default': false},
      {'id': 'Mass.Grams',              'unit': 'GRAM',             'symbol': 'g',    'system': 'SI', 'default': false},
      {'id': 'Weight.Pounds',           'unit': 'POUND',            'symbol': 'lb',   'system': 'US', 'default': false},
      {'id': 'Weight.Ounces',           'unit': 'OUNCE',            'symbol': 'oz',   'system': 'US', 'default': false},
    ],
    'Temperature': [
      {'id': 'Temperature.Degrees',     'unit': undefined,          'symbol': '°',    'system': 'SI', 'default': false},
      {'id': 'Temperature.Celsius',     'unit': 'CELSIUS',          'symbol': '°C',   'system': 'SI', 'default': true },
      {'id': 'Temperature.Fahrenheit',  'unit': 'FAHRENHEIT',       'symbol': '°F',   'system': 'US', 'default': true },
      {'id': 'Temperature.Kelvin',      'unit': 'KELVIN',           'symbol': 'K',    'system': 'SI', 'default': false},
    ],
    'Volume': [
      {'id': 'Volume.Gallons',          'unit': 'UK_GALLON',        'symbol': 'gal',  'system': 'UK', 'default': false},
      {'id': 'Volume.Gallons',          'unit': 'US_FLUID_GALLON',  'symbol': 'gal',  'system': 'US', 'default': false},
      {'id': 'Volume.Pints',            'unit': 'UK_PINT',          'symbol': 'pt',   'system': 'UK', 'default': false},
      {'id': 'Volume.Pints',            'unit': 'US_FLUID_PINT',    'symbol': 'pt',   'system': 'US', 'default': false},
      {'id': 'Volume.Quarts',           'unit': 'UK_QUART',         'symbol': 'qt',   'system': 'UK', 'default': false},
      {'id': 'Volume.Quarts',           'unit': 'US_FLUID_QUART',   'symbol': 'qt',   'system': 'US', 'default': false},
      {'id': 'Volume.Liters',           'unit': 'LITER',            'symbol': 'l',    'system': 'SI', 'default': false},
      {'id': 'Volume.CubicMeters',      'unit': 'CUBIC_METER',      'symbol': 'm3',   'system': 'SI', 'default': false},
      {'id': 'Volume.CubicFeet',        'unit': 'CUBIC_FOOT',       'symbol': 'ft3',  'system': 'US', 'default': false},
    ]
  },

  /**
   * Defines alexa capability namespace format pattern
   * @type {RegExp}
   */
  CAPABILITY_PATTERN: /^(?:Alexa\.)?(\w+)\.(\w+)[:]?(\w*)$/,

  /**
   * Defines alexa endpoint namespace format pattern
   * @type {RegExp}
   */
  ENDPOINT_PATTERN: /^(?:Alexa\.)?Endpoint\.(\w+)$/,

  /**
   * Defines alexa response timeout in milliseconds
   * @type {Number}
   */
  RESPONSE_TIMEOUT: 10000,

});
