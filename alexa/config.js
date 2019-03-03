/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
   *        { 'name': <propertyName1>, 'schema': <propertySchemaName1>, 'isReportable': <boolean> },
   *        ...
   *      ]
   *    }
   *  }
   *
   * @type {Object}
   */
  CAPABILITIES: {
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
    'InputController': {
      'category': 'TV',
      'properties': [
        {'name': 'input', 'schema': 'inputs'}
      ]
    },
    'LockController': {
      'category': 'SMARTLOCK',
      'properties': [
        {'name': 'lockState', 'schema': 'lockState'}
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
        {'name': 'playbackState', 'schema': 'playbackState', 'isReportable': false}
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
    'SceneController': {
      'category': 'SCENE_TRIGGER',
      'properties': [
        {'name': 'scene', 'schema': 'scene', 'isReportable': false}
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
        {'name': 'muted', 'schema': 'muteState', 'isReportable': false},
        {'name': 'volume', 'schema': 'volumeLevel', 'isReportable': false}
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
   *          },
   *          'default': {
   *            <itemType1>: {
   *              <alexaState1>: { '<value1>,<value2>,...', ... },
   *              ...
   *            },
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
        'type': 'integer'
      }
    },
    'connectivity': {
      'state': {
        'type': 'string'
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
    'inputs': {
      'itemTypes': ['String'],
      'state': {
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
    'percentage': {
      'itemTypes': ['Dimmer', 'Rollershutter'],
      'state': {
        'type': 'integer'
      }
    },
    'playbackState': {
      'itemTypes': ['Player'],
      'state': {
        'map': {
          'default': {
            'Player': {'PLAYING': 'PLAY', 'PAUSED': 'PAUSE'}
          }
        },
        'type': 'string'
      }
    },
    'powerLevel': {
      'itemTypes': ['Dimmer'],
      'state': {
        'type': 'integer'
      }
    },
    'powerState': {
      'itemTypes': ['Color', 'Dimmer', 'Rollershutter', 'Switch'],
      'state': {
        'type': 'string'
      }
    },
    'scene': {
      'itemTypes': ['Switch']
    },
    'temperature': {
      'itemTypes': ['Number', 'Number:Temperature'],
      'state': {
        'type': 'object'
      }
    },
    'thermostatMode': {
      'itemTypes': ['Number', 'String', 'Switch'],
      'state': {
        'map': {
          'custom:binding': {
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
        'type': 'string'
      }
    },
    'volumeLevel': {
      'itemTypes': ['Dimmer', 'Number'],
      'state': {
        'type': 'integer'
      }
    }
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
   * Defines alexa supported input controller names
   *  https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#input-values
   *
   * @type {Array}
   */
  INPUT_NAMES: [
    'AUX 1', 'AUX 2', 'AUX 3', 'AUX 4', 'AUX 5', 'AUX 6', 'AUX 7', 'BLURAY', 'CABLE', 'CD',
    'COAX 1', 'COAX 2', 'COMPOSITE 1', 'DVD', 'GAME', 'HD RADIO', 'HDMI 1', 'HDMI 2', 'HDMI 3',
    'HDMI 4', 'HDMI 5', 'HDMI 6', 'HDMI 7', 'HDMI 8', 'HDMI 9', 'HDMI 10', 'HDMI ARC', 'INPUT 1',
    'INPUT 2', 'INPUT 3', 'INPUT 4', 'INPUT 5', 'INPUT 6', 'INPUT 7', 'INPUT 8', 'INPUT 9',
    'INPUT 10', 'IPOD', 'LINE 1', 'LINE 2', 'LINE 3', 'LINE 4', 'LINE 5', 'LINE 6', 'LINE 7',
    'MEDIA PLAYER', 'OPTICAL 1', 'OPTICAL 2', 'PHONO', 'PLAYSTATION', 'PLAYSTATION 3',
    'PLAYSTATION 4', 'SATELLITE', 'SMARTCAST', 'TUNER', 'TV', 'USB DAC', 'VIDEO 1', 'VIDEO 2',
    'VIDEO 3', 'XBOX'
  ],


  /**
   * Defines alexa supported thermostat modes
   *  https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#thermostat-mode-values
   *
   * @type {Array}
   */
  THERMOSTAT_MODES: [
    'AUTO', 'COOL', 'HEAT', 'ECO', 'OFF'
  ],

  /**
   * Defines alexa capability namespace format pattern
   * @type {RegExp}
   */
  CAPABILITY_PATTERN: /^(?:Alexa\.)?(\w+)\.(\w+)$/,

  /**
   * Defines alexa endpoint namespace format pattern
   * @type {RegExp}
   */
  ENDPOINT_PATTERN: /^(?:Alexa\.)?Endpoint\.(\w+)$/,

});
