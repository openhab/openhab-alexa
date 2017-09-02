# Amazon Alexa Smart Home Skill for openHAB 2

Amazon certified openHAB2 as a [smarthome skill for Alexa](https://www.amazon.com/openHAB-Foundation/dp/B01MTY7Z5L).
This page describes how to use the skill certified by Amazon.
This skill allows you to connect your openHAB setup through the [myopenHAB.org](http://myopenHAB.org) cloud service to Amazon Alexa.
(See [README.md](https://github.com/openhab/openhab-alexa/blob/master/README.md) for other setup options regarding your own openHAB cloud.)

With this skill you can control items that respond to on/off and numeric commands.
The Skill as well has limited support for thermostats.
The skill is supported for English (U.S.), English (U.K.), and German languages. 

## General Configuration Instructions

### Requirements

* [openHAB Cloud Connector](http://docs.openhab.org/addons/io/openhabcloud/readme.html) configured using myopenHAB.org
* Amazon account
* Amazon Echo, Amazon Echo Dot or compatible Alexa speaker or solution (e.g. [Reverb](https://reverb.ai/))

### 1. Item Configuration

You have to tag your items to make them useable by Alexa.
See [Tagging](http://docs.openhab.org/configuration/items.html#tagging) for more details.

* **Items via .items - File**

  Please make sure to place your tag infront of the channel-informations. e.g.
  See [Item Definition and Syntax](http://docs.openhab.org/configuration/items.html#item-definition-and-syntax)
  
   ```java
   Switch Kitchen_Light "Kitchen Light" <light> (gKitchen) [ "Lighting" ] {channel="..."}
   ```
   
  Some examples of tagged items are:
  
  ```java
  Switch Kitchen_Light "Kitchen Light" <light> (gKitchen) [ "Lighting" ]
  Dimmer Bedroom_Light "Bedroom Light" <light> (gBedroom) [ "Lighting" ]
  Number Bedroom_Temperature "Bedroom Temperature" (gBedroom) [ "CurrentTemperature" ]
  
  Group gDownstairsThermostat "Downstairs Thermostat" (gFF) [ "Thermostat" ]
  Number Downstairs_Thermostat_CurrentTemp "Downstairs Thermostat Current Temperature" (gDownstairsThermostat) [ "CurrentTemperature" ]
  Number Downstairs_Thermostat_Target_Temperature "Downstairs Thermostat Target Temperature" (gDownstairsThermostat) [ "TargetTemperature" ]
  String Downstairs_Thermostat_Heating_Cooling_Mode "Downstairs Thermostat Heating/Cooling Mode" (gDownstairsThermostat) [ "homekit:HeatingCooling
  ```

* **Items via PaperUI**
 
   There is no easy way to tag your Items via PaperUI.
 
   Some users managed to tag items via REST API.
   Have a loot at [this post](https://community.openhab.org/t/apply-tags-to-items-added-linked-in-paper-ui/19443/11?u=mboremski).
   <!--- Are there more relevant ways to configure items? --->
   <!--- Should we add a chapter for availabletags? --->

### 2. Skill Configuration

1. Visit the [Alexa-Website](https://alexa.amazon.com/) or use the belonging app on your mobile.
2. Navigate to "Smart Home" -> "Configure Smart Home" and search for openHAB.
3. Follow the Instructions there to authorise Alexa using your myopenhab.org-account.

### 3. Final Configuration

After tagging your items you can go back to the Alexa-configurations and search for devices.

### Example Voice Commands

Here are some example voice commands:

 * "Alexa, turn on Kitchen Light"
 * "Alexa, turn off Kitchen Light"
 * "Alexa, turn on Bedroom Light"
 * "Alexa, turn on Bedroom Light"
 * "Alexa, dim Kitchen Lights to 30 percent"

### Additional Comments

<!--- you have better suggestions for the Headline? --->

* Thermostats are created by adding the items of a thermostat to a group which has the tag "Thermostat" which follows the HomeKit binding configuration. 
See [HomeKit Add-on](http://docs.openhab.org/addons/io/homekit/readme.html) for more information on how to configure thermostats.
Thermostats can have their target temperature set as well as be asked what the current temperature is.
* Channels which are tagged "CurrentTemperature" but NOT part of a thermostat group will be exposed as a Temperature item in Alexa and can be asked what their current value is ("Alex what is the upstairs temperature? ")
* By default all temperatures are in Celsius, for Fahrenheit add the tag `Fahrenheit` to the thermostat group item (which should also be tagged with `Thermostat`).
For standalone temperature channels, add it directly to the item.
* In addition you can tag Rollershutter items by `[ "Switchable" ]` and get support for `setPercentage`, `incrementPercentage`and `decrementPercentage` commands.
Example:
  ```java
  Rollershutter Shutter_GF_Kitchen "Rollershutter Kitchen" [ "Switchable" ]
  ```
* With commands like `Alexa, set rollershutter kitchen to 100%` you control the rollershutter in the kitchen.
* If your rollershutters or blinds happen not to support aperture by percentage the following rule helps to achieve opening and closing:
  ```java
  rule Rollershutter_Kitchen
  when
      Item Shutter_GF_Kitchen received command
  then
      if (receivedCommand < 50) { // in germany alexa often recognizes "0" as "9"
        sendCommand(Shutter_GF_Kitchen, UP)
      } else {
        sendCommand(Shutter_GF_Kitchen, DOWN)
      }
  end
  ```
