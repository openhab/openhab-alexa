# Amazon Alexa Smart Home skill for openHAB 2

This is a nodejs / lambda application that connects the Alexa Smart Home API to a user's openHAB instance, either directly or through the openHAB Cloud service (preferred).  The Smart Home API is not a general skill API, it allows the user to bypass using a application wake work and instead ask Alexa to perform a smart home action like "Alexa turn lights on"

This is designed to use the Homekit style tags in openHAB 2 to bind a user's devices to Alexa. This does not work with openHAB 1.x because there is no tagging mechanism. If you want to use the Alexa Smart Home skill with openHAB 1, you may use [this fork](https://github.com/paphko/openhab-alexa/tree/oh1_oh2_groups) which uses a group to bind user's devices to Alexa.

# General Installation Instructions

## Requirements

* Amazon AWS account with Alexa and Lambda access
* OAUTH2 Provider (Like Amazon Login)
* A openHAB server that a AWS service endpoint can access

## Skill Configuration

Deployment requires two configuration files, config.js for the application configuration, and .env for the node-lambda deployment app.

### config.js

The app can access a openHAB installation using two different types of authorization, basic auth ("user@password") or with bearer auth (OAUTH2 token).  Uncomment the "userpass" property for basic auth, otherwise a bearer token will be used.

### .env

Enter your AWS credentials, specifically AWS_ACCESS_KEY_ID,
AWS_SECRET_ACCESS_KEY, and AWS_ROLE_ARN.  Other access methods may work as well (AWS_SESSION_TOKEN) but have not been tested.

## Install Steps

### Create Smart Home Skill

Use the following guide to setup amazon, note that the node deployment script publishes to "{AWS_FUNCTION_NAME}-{AWS_ENVIRONMENT}", so you might want to call yours "openhab-development" if your AWS_FUNCTION_NAME = "openhab".  Also choose "nodejs" as the lambda runtime type.  

For more in-depth guides on deploying Smart Home Skills see:

https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/steps-to-create-a-smart-home-skill

https://developer.amazon.com/public/community/post/Tx34M7F8Z8U7U8B/Creating-Your-First-Alexa-Smart-Home-Skill

### Create and Deploy Lambda app

* run `npm install` to install the nodejs dependencies
* copy config_sample.js to config.js
* copy env_sample to .env
* change config files to match your environment.
* run "node-lambda deploy"
* login to the amazon lambda console and select the newly created project,
* Under "Event Sources"  add a "smart home skill" event source, for Application Id, add the Application Id from the Alexa developer portal
* copy the ARN value from the very top of the screen.
* login back to the Alexa console and select "configuration"
* Paste the ARN value from your Lambda into the "Lambda ARN" Field
* Fill out OAUTH2 information (from your oauth server or the Amazon Login service. See [this post](https://developer.amazon.com/public/community/post/Tx3CX1ETRZZ2NPC/Alexa-Account-Linking-5-Steps-to-Seamlessly-Link-Your-Alexa-Skill-with-Login-wit) for step-by-step instructions for _Login with Amazon_.)
* MAKE SURE YOU HAVE VALID SSL CERTS AND CERT CHAINS!!!! I highly recommend using Lets Encrypt.   

## Item configuration

* NEW Alexa Version 3 API syntax (v3)
  * Version 3 of the Alex Skill API introduces a more rich and complex set of features that required a change in how items are configured by using the new metadata feature introduced in openaHAB 2.3 (Currently only available via nightly build).
  * Version 2 tags are still supported and are converted internally to V3 metadata

### Version 3 (v3) Item mapping

The Alexa skill API uses the concept of "endpoints".  Endpoints are addressable entities that expose functionality in the form of capability interfaces.  

#### Single items
Single items in openHAB can be mapped to single endpoint in Alex through the use of the Alexa metadata.

An simple example of this is a light switch. In openHAB a light switch is defined as a "Switch" item and responds to ON or OFF commands.
```
Switch LightSwitch "Light Switch"
```
In the Alexa skill a light switch endpoint implements the "PowerController" interface and exposes a "powerState" property. To map our openHAB switch to a PowerController endpoint we use a Alexa metadata:
```
Switch LightSwitch "Light Switch" {alexa="PowerController.powerState"}
```
Setting this on a single item will create an Alexa endpoint with the spoken addressable name "Light Switch" and map the powerState property to our item. You can ask Alexa to turn "Light Switch" on or off as well as ask for its current state.

A slightly more complex example would be a Light Dimmer.  In openHAB a dimmer object responds to both percentage and ON / OFF commands.  In Alexa this is two different interfaces.  To support both types of commands, we need to add both to the item metadata:
```
Dimmer LightSwitch "Light Switch" {alexa="PowerController.powerState,BrightnessController.brightness"}
```

You can ask Alexa to "Turn Light Switch .." on or off, "Set Light Switch to .." a certain percentage as well as ask for its current state.

NOTE: the Alexa skill has 3 different percentage interfaces, BrightnessController, PowerLevelController and PercentageController.  Your item should only be using one of these that best describes the type of device.  So for lights this would be the BrightnessController, for roller shades this would be PercentageController.   The skill will not prevent adding more then one, but voice control may suffer for that device.

#### Group Items

While single mapping items works for many use cases, occasionally multiple openHAB items need to be mapped to a single endpoint in Alex.

For this example we will use 2 different use cases, a thermostat and a stereo.

In openHAB a thermostat is modeled as many different items, typically there are items for set points (target, heat, cool), modes, and the current temperature. To map these items to a single endpoint in Alexa, we will add them to a group which also uses "Alexa" metadata. When items are alexa-enabled, but are also a member of a group alexa-enabled, they will be added to the group endpoint and not exposed as their own endpoints.

```
  Group  Thermostat    "Bedroom"                                {alexa="Endpoint.Thermostat"}
  Number Temperature   "Temperature [%.0f F]"    (Thermostat)   {alexa="TemperatureSensor.temperature"}
  Number HeatSetpoint  "Heat Setpoint [%.0f F]"  (Thermostat)   {alexa="ThermostatController.upperSetpoint"}
  Number CoolSetpoint  "Cool Setpoint [%.0f F]"  (Thermostat)   {alexa="ThermostatController.lowerSetpoint"}
  Number Mode          "Mode [%s]"               (Thermostat)   {alexa="ThermostatController.thermostatMode"}
  ```

  The group metadata also describes the category for the endpoint, in this case a "Thermostat".  See the section below on Group mapping metadata and categories for a complete list.  In this example a single endpoint is created called "Bedroom", its various interfaces are mapped to different openHAB items.  You can ask Alexa "Set the Bedroom heat to 72" and the 'HeatSetpoint' will receive the command, likewise you can ask Alexa "What's the temperature of the Bedroom" and Alexa will query the 'Temperature' items for its value.

  When mapping items, sometime we need to pass additional parameters to Alexa to set things like what scale to use (Fahrenheit) or what values our items expect for certain states (thermostat modes). These parameters can be passed in the metadata properties, if they are omitted, then reasonable defaults are used.  In our above example we may wish to use Fahrenheit as our temperature scale, and map the mode strings to numbers.  This would look like:

```
  Group  Thermostat    "Thermostat"                             {alexa="Endpoint.Thermostat"}
  Number Temperature   "Temperature [%.0f F]"    (Thermostat)   {alexa="TemperatureSensor.temperature" [scale="Fahrenheit"]}
  Number HeatSetpoint  "Heat Setpoint [%.0f F]"  (Thermostat)   {alexa="ThermostatController.upperSetpoint" [scale="Fahrenheit"]}
  Number CoolSetpoint  "Cool Setpoint [%.0f F]"  (Thermostat)   {alexa="ThermostatController.lowerSetpoint" [scale="Fahrenheit"]}
  Number Mode          "Mode [%s]"               (Thermostat)   {alexa="ThermostatController.thermostatMode" [OFF=0,HEAT=1,COOL=2,AUTO=3"]}
  ```

  A Stereo is another example of a single endpoint that needs many items to function properly.  Power, volume, input, speakers and player controllers are all typical use cases for a stereo that a user may wish to control.

```
Group Stereo    "Stereo"            {alexa="Endpoint.Speaker"}
Number Volume   "Volume"  (Stereo)  {alexa="Speaker.volume"}
Switch Mute     "Mute"    (Stereo)  {alexa="Speaker.muted"}
Switch Power    "Power"   (Stereo)  {alexa="PowerController.powerState"}
String Input    "Input"   (Stereo)  {alexa="InputController.input"}
String Channel  "Channel" (Stereo)  {alexa="ChannelController.channel"}
Player Player   "Player"  (Stereo)  {alexa="PlaybackController.playback"}
```
#### Supported item mapping metadata
* The following are a list of supported metadata.
  * `PowerController.powerState`
    * Items that turn on or off such as light switches, power states, etc..
    * ON, OFF
    * Default category: SWITCH
  * `BrightnessController.brightness`
    * Items which response to percentage level and brightness commands (dim, brighten, percent), typically lights.
    * Numbers
    * Default category: LIGHT
  * `PowerLevelController.powerLevel`
    * Items which respond to a specific number setting
    * Numbers
    * Default category: SWITCH
  * `PercentageController.percentage`
    * Items which respond to percentage commands such as roller shutters.
    * Numbers
    * Default category: OTHER
  * `ThermostatController.targetSetpoint`
    * Items that represent a target set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (default to Celsius).
    * Number or Float values
    * Default category: THERMOSTAT
    * supports additional properties:
      * scale=Fahrenheit
      * scale=Celsius
      * defaults to scale=Celsius if omitted.
  * `ThermostatController.upperSetpoint`
    * Items that represent a upper or HEAT set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (default to Celsius).
    * Number or Float values
    * Default category: THERMOSTAT
    * supports additional properties:
      * scale=Fahrenheit
      * scale=Celsius
      * defaults to scale=Celsius if omitted.
  * `ThermostatController.lowerSetpoint`
    * Items that represent a lower or COOL set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (for example, scale=Fahrenheit, defaults to Celsius if omitted).
    * Number or Float values
    * Default category: THERMOSTAT
    * supports additional properties:
      * scale=...
      * defaults to scale=Celsius if omitted.
  * `ThermostatController.thermostatMode`
    * Items that represent the mode for a thermostat, default string values are "OFF=off,HEAT=heat,COOL=cool,ECO=eco,AUTO=auto", but these can be mapped to other values in the metadata. The mapping can be, in order of precedence, user-defined (AUTO=3,...) or preset-based related to the thermostat binding used (binding=...)
    * String or Number
    * Default category: THERMOSTAT
    * supports additional properties:
      * OFF=...
      * HEAT=...
      * COOL=...
      * ECO=...
      * AUTO=...
      * binding=ecobee [OFF=off, HEAT=heat, COOL=cool, AUTO=auto]
      * binding=nest [OFF=off, HEAT=heat, COOL=cool, ECO=eco, AUTO=heat-cool]
      * binding=zwave [OFF=0, HEAT=1, COOL=2, AUTO=3]
      * defaults to binding=default [OFF=off, HEAT=heat, COOL=cool, ECO=eco, AUTO=auto] if omitted
  * `TemperatureSensor.temperature`
    * Items that represent the current temperature, value may be in Celsius or Fahrenheit depending on how the item is configured (for example, scale=Fahrenheit, defaults to Celsius if omitted).
    * Number or Float values
    * Default category: TEMPERATURE_SENSOR
    * supports additional properties:
      * scale=...
      * defaults to scale=Celsius if omitted.
  * `LockController.lockState`
      * Items that represent the state of a lock (ON locked, OFF unlocked)
      * ON, OFF
      * Default category: SMARTLOCK
  * `ColorController.color`
      * Items that represent a color
      * H,S,B
      * Default category: LIGHT
  * `ColorTemperatureController.colorTemperatureInKelvin`
      * Items that represents a color temperature, default increment value may be specified in metadata parameters. For dimmer typed items adjustments, INCREASE/DECREASE commands will be sent instead if increment value not defined, while number typed items will default to 500K increments.
      * Two item types supported:
        * Dimmer: colder (0%) to warmer (100%) based of Alexa color temperature spectrum [Hue and LIFX support]
        * Number: color temperature value in K [custom integration]
      * Default category: LIGHT
      * supports additional properties:
        * increment=N (in % for dimmer/in K for number)
        * defaults to increment=INCREASE/DECREASE (Dimmer) or increment=500 (Number) if omitted
  * `SceneController.scene`
      * Items that represent a scene or an activity depending on defined category and may be set not to support deactivation requests based on metadata parameters.
      * String
      * Default category: SCENE_TRIGGER
      * supports additional properties:
        * supportsDeactivation=false
        * supportsDeactivation=true
        * defaults to supportsDeactivation=true if omitted
  * `ChannelController.channel`
      * Items that represent a channel
      * String
      * Default category: TV
  * `InputController.input`
      * Items that represent a source input (ex, "HDMI 1", or "MUSIC" on a stereo)
      * String
      * Default category: TV
  * `Speaker.volume`
      * Items that represent a volume level, default increment may be specified in metadata parameters
      * Number
      * Default category: SPEAKER
      * supports additional properties:
        * increment=N
        * defaults to increment=10 (standard value provided by Alexa) if omitted.
  * `Speaker.muted`
      * Items that represent a muted state (ON muted, OFF unmuted)
      * ON, OFF
      * Default category: SPEAKER
  * `StepSpeaker.volume`
      * Items that represent a volume level controlled in steps only (for example IR controlled, ex: +1, -1)
      * String
      * Default category: SPEAKER
  * `StepSpeaker.muted`
      * Items that represent a muted state (ON muted, OFF unmuted)
      * ON, OFF
      * Default category: SPEAKER
  * `PlaybackController.playback`
      * Items that represent the playback of a AV device (mostly compatible with Player Items)
      * "PLAY", "PAUSE", "NEXT", "PREVIOUS", "REWIND", "FASTFORWARD", "STOP"
      * Default category: OTHER
* Item Categories
    * Alexa has certain categories that effect how voice control and their mobile/web UI's display or control endpoints.  An example of this is when you create "Smart Device Groups" in the Alex app and associate a specific Echo or Dot to that Group (typically a room).  When a user asks to turn the lights ON, Alexa looks for devices in that group that have the category "LIGHT" to send the command to.  
    * You can override this default value on items by adding it as a parameter to the metadata, ex: `Switch LightSwitch "Light Switch" {alexa="PowerController.powerState" [category="OTHER"]}`
    * List of Alexa categories currently supported from Alexa Skill API docs:

Category	| Description	| Notes
---------|-------------|-------
ACTIVITY_TRIGGER	| Describes a combination of devices set to a specific state, when the state change must occur in a specific order. |For example, a "watch Netflix" scene might require the: 1. TV to be powered on & 2. Input set to HDMI1.	| Applies to Scenes
CAMERA	| Indicates media devices with video or photo capabilities.	 
DOOR	| Indicates a door.	 
LIGHT	| Indicates light sources or fixtures.
MICROWAVE | Indicates a microwave oven endpoint.	 
OTHER	| An endpoint that cannot be described in on of the other categories.	 
SCENE_TRIGGER	|Describes a combination of devices set to a specific state, when the order of the state change is not important. For example a bedtime scene might include turning off lights and lowering the thermostat, but the order is unimportant.	| Applies to Scenes
SMARTLOCK	| Indicates an endpoint that locks.	 
SMARTPLUG	| Indicates modules that are plugged into an existing electrical outlet.	| Can control a variety of devices.
SPEAKER	| Indicates the endpoint is a speaker or speaker system.	 
SWITCH	| Indicates in-wall switches wired to the electrical system.	| Can control a variety of devices.
TEMPERATURE_SENSOR	| Indicates endpoints that report the temperature only.	 
THERMOSTAT	| Indicates endpoints that control temperature, stand-alone air conditioners, or heaters with direct temperature control.	 
TV	| Indicates the endpoint is a television.	 

#### Supported Group mapping metadata
* Functional groups (no group type) can be labelled with one of Alexa categories listed above. It can be set using one of the two formats: `Endpoint.<category>` or `<category>`
* Example `{alexa="Endpoint.Thermostat"}` or `{alexa="Thermostat"}`
* Child item categories are ignored and only the group category is used on items.
* Case is ignored on the category part of the metadata and any value will be made all uppercase before its passed to the Alexa API.

#### Labels Concept
Metadata labels translate to a set of capabilities. These are the same as v2 tags but provide the ability to add customization through additional properties which take precedence over the default ones. Here are some examples:
```
Switch OutletPlug "Outlet Plug" {alexa="Switchable" [category="SMARTPLUG"]}
Switch TelevisionPower "Television Power" {alexa="Switchable" [category="TV"]}

Color LightColor "Light Color" {alexa="Lighting"}
```

Here are the labels currently supported and what they translate to:
* Switchable (capabilities depending on item type)
```
Switch DeviceSwitch "Device Switch" {alexa="PowerController.powerState" [category="SWITCH"]}
Rollershutter ShutterSwitch "Shutter Switch" {alexa="PowerController.powerState,PercentageController.percentage" [category="SWITCH"]}
```
* Lighting (capabilities depending on item type)
```
Dimmer LightDimmer "Light Dimmer" {alexa="PowerController.powerState,BrightnessController.brightness" [category="LIGHT"]}
Color LightColor "Light Color" {alexa="PowerController.powerState,BrightnessController.brightness,ColorController.color" [category="LIGHT"]}
```
* Lock
```
Switch DoorLock "Door Lock" {alexa="LockController.lockState"}
```
* CurrentTemperature
```
Number CurrentTemperature "Current Temperature" {alexa="TemperatureSensor.temperature" [scale="Celsius"]}
```
* TargetTemperature
```
Number TargetTemperature "Target Temperature" {alexa="ThermostatController.targetSetpoint" [scale="Celsius"]}
```
* LowerTemperature
```
Number LowerTemperature "Lower Temperature" {alexa="ThermostatController.lowerSetpoint" [scale="Celsius"]}
```
* UpperTemperature
```
Number UpperTemperature "Upper Temperature" {alexa="ThermostatController.upperSetpoint" [scale="Celsius"]}
```
* HeatingCoolingMode
```
String HeatingCoolingMode "Thermostat Mode" {alexa="ThermostatController.thermostatMode"}
```
* ColorTemperature
```
Dimmer ColorTemperature "Color Temperature" {alexa="ColorTemperatureController.colorTemperatureInKelvin"}
```
* Activity
```
Switch Activity "Activity" {alexa="SceneController.scene" [category="ACTIVITY_TRIGGER"]}
```
* Scene
```
Switch Scene "Scene" {alexa="SceneController.scene" [category="SCENE_TRIGGER"]}
```
* EntertainmentChannel
```
String EntertainmentChannel "Entertainment Channel" {alexa="ChannelController.channel"}
```
* EntertainmentInput
```
String EntertainmentInput "Entertainment Input" {alexa="InputController.input"}
```
* MediaPlayer
```
Player MediaPlayer "Media Player" {alexa="PlaybackController.playback"}
```
* SpeakerMute
```
Switch SpeakerMute "Speaker Mute" {alexa="Speaker.muted"}
```
* SpeakerVolume
```
Number SpeakerVolume "Speaker Volume" {alexa="Speaker.volume"}
```

### Version 2 Item mapping
  * Items are exposed via Homekit tags, the following is taken from the homekit binding in openHAB2:

  ```
  Switch KitchenLights "Kitchen Lights" <light> (gKitchen) [ "Lighting" ]
  Dimmer BedroomLights "Bedroom Lights" <light> (gBedroom) [ "Lighting" ]
  Number BedroomTemperature "Bedroom Temperature" (gBedroom) [ "CurrentTemperature" ]
  Group gDownstairsThermostat "Downstairs Thermostat" (gFF) [ "Thermostat" ]
  Number DownstairsThermostatCurrentTemp "Downstairs Thermostat Current Temperature" (gDownstairsThermostat) [ "CurrentTemperature" ]
  Number DownstairsThermostatTargetTemperature "Downstairs Thermostat Target Temperature" (gDownstairsThermostat) [ "TargetTemperature" ]
  String DownstairsThermostatHeatingCoolingMode "Downstairs Thermostat Heating/Cooling Mode" (gDownstairsThermostat) [ "homekit:HeatingCooling" ]
  ```

  * Thermostats are created by adding the items of a thermostat to a group which has the tag "Thermostat" which follows the HomeKit binding configuration. See the [HomeKit binding documentation](http://docs.openhab.org/addons/ios/homekit/readme.html) for more information on how to configure thermostats. Thermostats can have their target temperature set as well as be asked what the current temperature is.
  * Channels which are tagged "CurrentTemperature" but NOT part of a thermostat group will be exposed as a Temperature item in Alexa and can be asked what their current value is ("Alex what is the upstairs temperature? ")
  * By default all temperatures are in Celsius, for Fahrenheit add the tag `Fahrenheit` to the thermostat group item (which should also be tagged with `Thermostat`).  For standalone temperature channels, add it directly to the item.
  * In addition you can tag Rollershutter items by `[ "Switchable" ]` and get support for `setPercentage`, `incrementPercentage`and `decrementPercentage` commands. Example:

  ```
  Rollershutter Shutter_GF_Kitchen "Rollershutter Kitchen" [ "Switchable" ]
  ```

  * With commands like `Alexa, set rollershutter kitchen to 100%` you control the rollershutter in the kitchen.
  * If your rollershutters or blinds happen not to support aperture by percentage the following rule helps to achieve opening and closing:

  ```
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

## Example Voice Commands

Here are some example voice commands:

 * Alexa turn on Office Lights
 * Alexa turn off Pool Waterfall
 * Alexa turn on House Fan
 * Alexa turn on Home Theater Scene
 * Alexa dim Kitchen Lights to 30 percent
 * Alexa set house temperature to 70 degrees
