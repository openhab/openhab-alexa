/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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

const decamelize = require('decamelize');
const log = require('@lib/log.js');
const rest = require('@lib/rest.js');
const { getCapabilityInterface, getCapabilityCategory, isSupportedDisplayCategory } = require('../capabilities.js');
const { ENDPOINT_PATTERN } = require('../config.js');
const AlexaDirective = require('../directive.js');
const AlexaPropertyMap = require('../propertyMap.js');

/**
 * Defines Alexa.Discovery interface directive class
 * @extends AlexaDirective
 */
class AlexaDiscovery extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.tries = 0;
  }

  /**
   *  Discover devices
   */
  discover() {
    // Request following data from openHAB:
    //  - all items
    //  - server settings
    Promise.all([
      rest.getItems(this.directive.payload.scope.token, this.timeout),
      rest.getServerSettings(this.directive.payload.scope.token, this.timeout)
    ]).then(([items, settings]) => {
      const discoveredDevices = [];
      const groupItems = [];

      log.debug('Data:', {items: items, settings: settings});

      // Retry retrieving all items if not an array, up to 3 tries, otherwise throw error
      if (!Array.isArray(items)) {
        if (++this.tries <= 3) {
          log.info(`Retry #${this.tries}`);
          return this.discover();
        }
        throw new TypeError(`Discover items retrieved not an array [type: ${typeof items}]`);
      }

      items.forEach((item) => {
        // Set endpoint friendly name using item label or first synonyms metadata value
        const friendlyName = item.label ||
          item.metadata && item.metadata.synonyms && item.metadata.synonyms.value.split(',').shift();
        // Skip item if friendly name empty or if already part of a group
        if (!friendlyName || groupItems.includes(item.name)) {
          return;
        }

        // Convert items v2 style label/tag to v3
        convertV2Item(item);

        const displayCategories = [];
        // Adds unique supported display categories function
        const addDisplayCategory = function (category) {
          category = isSupportedDisplayCategory(category) ? category : 'OTHER';
          if (!displayCategories.includes(category)) {
            displayCategories.push(category);
          }
        };

        const propertyMap = new AlexaPropertyMap();
        let isEndpointGroup = false;
        // OH Goups can act as a single Endpoint using its children for capabilities
        if (item.type === 'Group' && !item.groupType) {
          item.metadata.alexa.value.split(',').some((capability) => {
            // Find matching Endpoint capability
            let groupMatch;
            if ((groupMatch = capability.match(ENDPOINT_PATTERN))) {
              log.debug(`found group ${groupMatch[0]} for item ${item.name}`);
              isEndpointGroup = true;
              // Get group members and add them to property map
              items.filter(member => member.groupNames.includes(item.name)).forEach((member) => {
                convertV2Item(member, item.metadata.alexa.config);
                log.debug(`adding ${member.name} to group ${item.name}`);
                groupItems.push(member.name);
                propertyMap.addItem(member, settings);
              });
              //set display category for group
              addDisplayCategory(decamelize(groupMatch[1]).toUpperCase());
              return true;
            }
          });
        }
        // Add item to property map if not endpoint group
        if (!isEndpointGroup) {
          propertyMap.addItem(item, settings);
        }
        // Skip item if no property defined
        if (Object.keys(propertyMap).length === 0) {
          return;
        }

        log.debug('Property Map:', propertyMap);

        // Initialize capabilities list with alexa capability
        const capabilities = [getCapabilityInterface('Alexa')];
        // Iterate over property map capabilities
        Object.keys(propertyMap).forEach((interfaceName) => {
          const properties = propertyMap[interfaceName];
          const capability = getCapabilityInterface(interfaceName, properties, settings);
          // Skip if capability not defined
          if (!capability) {
            log.warn('Unsupported capability:', {name: interfaceName, properties: properties});
            return;
          }
          // Add capability to list
          capabilities.push(capability);
          // Add properties or capability categories if not endpoint group item
          if (!isEndpointGroup) {
            const categories = propertyMap.getCategories(interfaceName);
            if (categories.length > 0) {
              categories.forEach(category => addDisplayCategory(category));
            } else {
              addDisplayCategory(getCapabilityCategory(interfaceName));
            }
          }
        });
        // Add endpoint health capability to list if includes some retrievable properties
        if (capabilities.some(capability => capability.properties && capability.properties.retrievable)) {
          capabilities.push(getCapabilityInterface('EndpointHealth'));
        }

        // Add device to discovered list
        discoveredDevices.push({
          endpointId: item.name,
          manufacturerName: 'openHAB',
          friendlyName: friendlyName,
          description: item.type + ' ' + item.name + ' via openHAB',
          displayCategories: displayCategories,
          cookie: {
            propertyMap: propertyMap.dump()
          },
          capabilities: capabilities
        });
      });

      // Remove items that are already part of a group.
      for (let i = discoveredDevices.length - 1; i >= 0; i--) {
        if (groupItems.includes(discoveredDevices[i].endpointId)) {
          discoveredDevices.splice(i, 1);
        }
      }

      // Generate discover response
      const response = this.generateResponse({
        header: {
          namespace: this.directive.header.namespace,
          name: 'Discover.Response'
        },
        payload: {
          endpoints: discoveredDevices
        }
      });

      this.returnAlexaResponse(response);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

/**
 * Convert v2 style label/tag on a single item to V3
 * @param {Object} item
 * @param {Object} config  [group level config] (optional)
 */
function convertV2Item(item, config = {}) {

  // Returns an array of V3 capabilities for V2 switchable tag based on item type
  const getV2SwitchableCapabilities = function () {
    switch (item.type === 'Group' ? item.groupType : item.type) {
      case 'Switch':
        return [
          'PowerController.powerState'
        ];
      case 'Dimmer':
        return [
          'PowerController.powerState',
          'BrightnessController.brightness'
        ];
      case 'Color':
        return [
          'PowerController.powerState',
          'BrightnessController.brightness',
          'ColorController.color'
        ];
      case 'Rollershutter':
        return [
          'PercentageController.percentage'
        ];
      default:
        return [];
    }
  }

  // Returns temperature scale based on V2 style tags
  const getV2TemperatureScale = function () {
    return item.tags.find(tag => ['CELSIUS', 'FAHRENHEIT'].includes(tag.toUpperCase()));
  };

  // Initialize alexa metadata item object if not defined
  if (!item.metadata || !item.metadata.alexa) {
    item.metadata = Object.assign({ alexa: { value: '', config: {} } }, item.metadata);
  }
  // Metadata information:
  //  values: fallback to tags if no metadata value defined
  //  config: metadata config parameters
  const metadata = {
    values: item.metadata.alexa.value ? item.metadata.alexa.value.split(',') : item.tags,
    config: item.metadata.alexa.config || {}
  };

  // Convert metadata v2 style label values to capabilities
  metadata.values.forEach((value) => {
    // Extract tag from label value
    const [label, tag] = value.split('#');
    let capabilities = [];
    let parameters = {};

    // Define endpoint tag for group item with no group type
    if (item.type === 'Group' && !item.groupType) {
      switch (label) {
        case 'Lighting':
          capabilities = ['Endpoint.Light'];
          break;
        case 'Switchable':
          capabilities = ['Endpoint.Switch'];
          break;
        case 'Thermostat':
          capabilities = ['Endpoint.Thermostat'];
          // add v2 temperature scale parameter if group scale config not defined
          if (!metadata.config.scale) {
            metadata.config.scale = getV2TemperatureScale();
          }
          break;
        default:
          if (isSupportedDisplayCategory(decamelize(label))) {
            capabilities = ['Endpoint.' + label];
          }
      }
    } else {
      switch (label) {
        case 'Lighting':
        case 'Switchable':
          capabilities = getV2SwitchableCapabilities();
          parameters = {category: label === 'Lighting' ? 'LIGHT' : 'SWITCH'};
          break;
        case 'Blind':
        case 'WindowCovering':
          capabilities = ['RangeController.rangeValue'];
          parameters = {
            category: 'INTERIOR_BLIND', friendlyNames: '@Setting.Opening',
            supportedRange: '0:100:10', unitOfMeasure: 'Percent',
            actionMappings: 'Close=0,Open=100,Lower=(-10),Raise=(+10)', stateMappings:'Closed=0,Open=1:100'};
          break;
        case 'Door':
          capabilities = ['ToggleController.toggleState'];
          parameters = {
            category: 'DOOR', friendlyNames: '@Setting.Opening',
            actionMappings: 'Close=OFF,Open=ON', stateMappings:'Closed=OFF,Open=ON'};
          break;
        case 'Lock':
          capabilities = ['LockController.lockState'];
          break;
        case 'Outlet':
          capabilities = ['PowerController.powerState'];
          parameters = {category: 'SMARTPLUG'};
          break;
        case 'CurrentHumidity':
          capabilities = ['RangeController.rangeValue'];
          parameters = {
            friendlyNames: '@Setting.Humidity', nonControllable: true,
            supportedRange: '0:100:1', unitOfMeasure: 'Percent'};
          break;
        case 'CurrentTemperature':
          capabilities = ['TemperatureSensor.temperature'];
          parameters = {scale: config.scale || getV2TemperatureScale()};
          break;
        case 'TargetTemperature':
        case 'homekit:TargetTemperature':
          capabilities = ['ThermostatController.targetSetpoint'];
          parameters = {scale: config.scale || getV2TemperatureScale()};
          break;
        case 'LowerTemperature':
          capabilities = ['ThermostatController.lowerSetpoint'];
          parameters = {scale: config.scale || getV2TemperatureScale()};
          break;
        case 'UpperTemperature':
          capabilities = ['ThermostatController.upperSetpoint'];
          parameters = {scale: config.scale || getV2TemperatureScale()};
          break;
        case 'HeatingCoolingMode':
        case 'homekit:HeatingCoolingMode':
        case 'homekit:TargetHeatingCoolingMode':
        case 'homekit:CurrentHeatingCoolingMode':
          capabilities = ['ThermostatController.thermostatMode'];
          parameters = {binding: config.binding};
          break;
        case 'ColorTemperature':
          capabilities = ['ColorTemperatureController.colorTemperatureInKelvin'];
          break;
        case 'Activity':
        case 'Scene':
          capabilities = ['SceneController.scene'];
          parameters = {category: label === 'Activity' ? 'ACTIVITY_TRIGGER' : 'SCENE_TRIGGER'};
          break;
        case 'EntertainmentChannel':
          capabilities = ['ChannelController.channel'];
          break;
        case 'EntertainmentInput':
          capabilities = ['InputController.input'];
          break;
        case 'EqualizerBass':
          capabilities = ['EqualizerController.bands:bass'];
           break;
        case 'EqualizerMidrange':
          capabilities = ['EqualizerController.bands:midrange'];
          break;
        case 'EqualizerTreble':
          capabilities = ['EqualizerController.bands:treble'];
          break;
        case 'EqualizerMode':
          capabilities = ['EqualizerController.modes'];
          break;
        case 'MediaPlayer':
          capabilities = ['PlaybackController.playback'];
          break;
        case 'SpeakerMute':
          capabilities = ['Speaker.muted'];
          break;
        case 'SpeakerVolume':
          capabilities = ['Speaker.volume'];
          break;
        case 'ContactSensor':
          capabilities = ['ContactSensor.detectionState'];
          break;
        case 'MotionSensor':
          capabilities = ['MotionSensor.detectionState'];
          break;
        case 'SecurityAlarmMode':
          capabilities = ['SecurityPanelController.armState'];
          break;
        case 'BurglaryAlarm':
          capabilities = ['SecurityPanelController.burglaryAlarm'];
          break;
        case 'FireAlarm':
          capabilities = ['SecurityPanelController.fireAlarm'];
          break;
        case 'CarbonMonoxideAlarm':
          capabilities = ['SecurityPanelController.carbonMonoxideAlarm'];
          break;
        case 'WaterAlarm':
          capabilities = ['SecurityPanelController.waterAlarm'];
          break;
        case 'ModeComponent':
          capabilities = ['ModeController.mode'];
          break;
        case 'RangeComponent':
          capabilities = ['RangeController.rangeValue'];
          break;
        case 'ToggleComponent':
          capabilities = ['ToggleController.toggleState'];
          break;
      }
    }

    // Push all unique capabilities with tag to metadata values
    //  and merge parameters into metadata config
    capabilities.forEach((capability) => {
      metadata.values = [...new Set(metadata.values).add(capability + (tag ? '#' + tag : ''))];
      metadata.config = Object.assign(parameters, metadata.config);
    });
  });

  // Update item alexa metadata information
  Object.assign(item.metadata, {
    alexa: {
      value: metadata.values.join(','),
      config: metadata.config
    }
  });
}

module.exports = AlexaDiscovery;
