/*
* Copyright (c) 2014-2019 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/

 /**
* Amazon Smart Home Skill Property Map for API V3
*/
var utils = require('./utils.js');

 // Define alexa capability namespace format pattern
var CAPABILITY_PATTERN = /^(?:Alexa\.)?(\w+)\.(\w+)$/;
// Define item property metadata parameter format pattern
var ITEM_PARAM_PATTERN = /^item(\w)(\w+)$/;
 // Define unit of measurement scale mapping
var UNIT_MEASUREMENT_SCALE_MAPPING = {
  '°C': 'CELSIUS',
  '°F': 'FAHRENHEIT'
};

 /**
 * Defines property map object to assoicate items to an endpoint from metadata, per the description below:
 *
 * openHAB Metadata
 *
 * Number FooTargetSetPoint "Foo Target SetPoint" {alexa="ThermostatController.targetSetpoint" [scale="Fahrenheit"]}
 * Number FooUpperSetPoint  "Foo Upper SetPoint"  {alexa="ThermostatController.upperSetpoint" [scale="Fahrenheit"]}
 * Number FooLowerSetPoint  "Foo Lower SetPoint"  {alexa="ThermostatController.lowerSetpoint" [scale="Fahrenheit"]}
 * String FooMode           "Foo Mode"            {alexa="ThermostatController.thermostatMode" [OFF=0,HEAT=1,COOL=2,AUTO=3]}
 * Switch FooSwitch         "FooSwitch"           {alexa="PowerController.powerState"}
 *
 * returns
 *
 * propertyMap:
 *  {
 *    ThermostatController: {
 *      targetSetpoint: {
 *          item: {
 *            name: "FooTargetSetPoint",
 *            type: "Number",
 *          },
 *          parameters: {
 *            scale: "Fahrenheit",
 *          }
 *      },
 *      upperSetpoint: {
 *          item: {
 *            name: "FooTargetSetPoint",
 *            type: "Number",
 *          },
 *          parameters: {
 *            scale: "Fahrenheit",
 *          }
 *      },
 *      lowerSetpoint: {
 *          item: {
 *            name: "FooTargetSetPoint",
 *            type: "Number",
 *          },
 *          parameters: {
 *            scale: "Fahrenheit",
 *          }
 *      },
 *      thermostatMode: {
 *          item: {
 *            name: "FooMode",
 *            type: "Number",
 *          },
 *          parameters: {
 *            OFF: 0,
 *            HEAT: 1,
 *            COOL: 2,
 *            AUTO: 3
 *          }
 *      }
 *    },
 *    PowerController: {
 *      powerState: {
 *         item: {
 *           name: "FooSwitch"
 *            type: "Switch",
 *         }
 *      }
 *    }
 *
*/
var AlexaPropertyMap = function () {
};

 /**
 * Clears property map object
 */
AlexaPropertyMap.prototype.clear = function() {
  Object.keys(this).forEach(property => delete this[property]);
}

 /**
 * Dumps property map object to string format
 * @return {String}
 */
AlexaPropertyMap.prototype.dump = function() {
  return JSON.stringify(this);
}

 /**
 * Loads json fomated string into property map object
 * @param  {String} propertyMap
 */
AlexaPropertyMap.prototype.load = function(propertyMap) {
  Object.assign(this, JSON.parse(propertyMap));
}

 /**
 * Adds item to property map object
 * @param  {Object} item
 */
AlexaPropertyMap.prototype.addItem = function(item) {
  var propertyMap = this;
  var matches;

   item.metadata.alexa.value.split(',').forEach(function (capability) {
    if (matches = capability.match(CAPABILITY_PATTERN)) {
      var interfaceName = matches[1];
      var propertyName = matches[2];
      var properties = propertyMap[interfaceName] || {};
      var property = {
        parameters: item.metadata.alexa.config || {},
        item: {
          name: item.name,
          type: item.type
        }
      };

       // Check if item (group)type supported by capability, skip if not
      if (!utils.supportedItemTypeCapability(item.groupType || item.type, interfaceName, propertyName)) {
        return;
      }

       // Extract item property settings from metadata config. These settings starts with 'item'.
      Object.keys(property.parameters).forEach(function(parameter) {
        if (matches = parameter.match(ITEM_PARAM_PATTERN)) {
          // lowercase the first character (e.g. itemSensor => sensor)
          var setting = matches[1].toLowerCase() + matches[2];
          property.item[setting] = property.item[setting] || property.parameters[parameter];
          delete property.parameters[parameter];
        }
      });

      // Set scale parameter based on unit of measurement number item type if not already defined
      if (item.type.startsWith('Number:') && !property.parameters.scale) {
        var unit = item.state.split(' ').pop();
        property.parameters.scale = UNIT_MEASUREMENT_SCALE_MAPPING[unit];
      }

       // Add property to map object
      propertyMap[interfaceName] = Object.assign(properties, {[propertyName]: property});
    }
  });
}

 /**
 * Returns list of categories for a given interface name
 * @param  {String} interfaceName
 * @return {Array}
 */
AlexaPropertyMap.prototype.getCategories = function(interfaceName) {
  var properties = this[interfaceName] || {};
  var parameter = 'category';

   return Object.keys(properties).reduce(function(categories, propertyName) {
    var category = (properties[propertyName].parameters[parameter] || '').toUpperCase();
    if (!categories.includes(category) && utils.supportedDisplayCategory(category)) {
      categories.push(category);
    }
    return categories;
  }, []);
}

 /**
 * Returns list of item objects for a given list of interface names
 *
 *  Items array return format:
 *    [
 *      {
 *        name: <name1>,
 *        param1: <param1>, (item parameter stored in property map)
 *        ...
 *        capabilities: [
 *          {
 *            interface: <interfaceName1>, property: <propertyName1>
 *          },
 *          ...
 *        ]
 *      },
 *      ...
 *    ]
 *
 * @param  {Array} interfaceNames
 * @return {Array}
 */
AlexaPropertyMap.prototype.getItemsByInterfaces = function(interfaceNames) {
  var propertyMap = this;

   return interfaceNames.reduce(function(items, interfaceName) {
    var properties = propertyMap[interfaceName] || {};
    Object.keys(properties).forEach(function(propertyName) {
      var capability = {interface: interfaceName, property: propertyName};
      var item = properties[propertyName].item;
      var index = items.findIndex(i => i.name === item.name);

       if (index === -1) {
        items.push(Object.assign(item, {capabilities: [capability]}));
      } else {
        items[index].capabilities.push(capability);
      }
    });
    return items;
  }, []);
}

 module.exports = AlexaPropertyMap;
