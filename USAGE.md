# Amazon Alexa Smart Home Skill
<img align="right" width="150px" src="https://images-na.ssl-images-amazon.com/images/I/51-cpfTnBzL._SL210_QL95_BG0,0,0,0_FMpng_.png">

Alexa is an intelligent personal assistant developed by Amazon and designed to run on smart speakers and devices such as the Amazon Echo and Dot.

<p></p>

This certified Amazon Smart Home Skill allows users to naturally control their openHAB powered smart home with natural voice commands.  Lights, locks, thermostats, AV devices, sensors and many other device types can be controled through a user's Alexa powered device like the Echo or Dot.

<p></p>

This page describes how to use the [openHAB Alexa Smart Home Skill](https://www.amazon.com/openHAB-Foundation/dp/B01MTY7Z5L).
The skill connects your openHAB setup through the [myopenHAB.org](http://myopenHAB.org) cloud service to Amazon Alexa.

## Other openHAB Alexa Integrations

openHAB has two other Alexa integrations that can be used in conjunction with or indepently of this skill.

### Amazon Echo Control Binding

Control Amazon Echo devices from your openHAB.  This allows openHAB to send commands to a echo device and control its ability to play music, set alarms, change the volume and use it a Text-To-Speech output device. See the [Amazon Echo Control Binding](https://www.openhab.org/addons/bindings/amazonechocontrol/) for more information..

### Hue Emulation Service

Hue Emulation exposes openHAB items as Hue devices to other Hue HTTP API compatible applications like an Amazon Echo, Google Home or any Hue compatible application. This is done on the local network and does not require the cloud service. See the [Hue Emulation Service](https://www.openhab.org/addons/integrations/hueemulation/) for more information.

## Requirements

* [openHAB Cloud Connector](http://docs.openhab.org/addons/ios/openhabcloud/readme.html) configured using myopenHAB.org
* Amazon account
* Amazon Echo, Amazon Echo Dot or compatible Alexa device

## Setup

* NEW Alexa Version 3 API syntax (v3)
  * Version 3 of the Alex Skill API introduces a more rich and complex set of features that required a change in how items are configured by using the new metadata feature introduced in openaHAB 2.3
  * Version 2 tags are still supported and are converted internally to V3 meta data
  * See [Label Support](#Label-Support) for using labels in item tags and meta data.

### Item Label Recommendation

Matching of voice commands to Items happens based on the Item label (e.g. "Kitchen Light"). It is therefore advisable, to choose labels that can be used to form natural commands. As an example, compare "Alexa, turn on the Kitchen Light" vs. "Alexa, turn on the Ground Floor LEDs Kitchen".

### Item Configuration

The Alexa skill API uses the concept of "endpoints".  Endpoints are addressable entities that expose functionality in the form of capability interfaces.  An example endpoint may be a light switch, which has a single capability called power state (ON/OFF).  A more complex endpoint may be a thermostat which has many capabilities to control and report temperature, setpoints, modes, etc..

### Item State

Item states, reported back to Alexa, are formatted based on their [item state presentation](https://www.openhab.org/docs/configuration/items.html#state-presentation) definition if configured. This means you can control the precision of number values (e.g. `%.1f °C` will limit reported temperature value to one decimal point).

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
Setting this on a single item will create an Alexa endpoint with the spoken addressable name "Light Switch" and map the powerState property to our item. You can ask Alexa to turn "Light Switch" on or off.

A slightly more complex example would be a Light Dimmer.  In openHAB a dimmer object responds to both percentage and ON / OFF commands.  In Alexa this is two different interfaces.  To support both types of commands, we need to add both to the item metadata:
```
Dimmer LightSwitch "Light Switch" {alexa="PowerController.powerState,BrightnessController.brightness"}
```

You can ask Alexa to "Turn Light Switch .." on or off as well as "Set Light Switch to .." a certain percentage.

NOTE: the Alexa skill has 3 different percentage interfaces, BrightnessController, PowerLevelController and PercentageController.  Your item should only be using one of these that best describes the type of device.  So for lights this would be the BrightnessController, for roller shades this would be PercentageController.   The skill will not prevent adding more then one, but voice control may suffer for that device.

#### Group Items

While single mapping items works for many use cases, occasionally multiple openHAB items need to be mapped to a single endpoint in Alexa. When using a group item, keep in mind that there can only be one specific interface capability per group. If you need to have more than one instance of a given capability, you should use the Mode, Range and Toggle controllers that are described at the end of this section.

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
  Number Mode          "Mode [%s]"               (Thermostat)   {alexa="ThermostatController.thermostatMode" [OFF=0,HEAT=1,COOL=2,AUTO=3]}
  ```

  A Stereo is another example of a single endpoint that needs many items to function properly.  Power, volume, input, speakers and player controllers are all typical use cases for a stereo that a user may wish to control.

```
  Group Stereo    "Stereo"            {alexa="Endpoint.Speaker"}
  Number Volume   "Volume"  (Stereo)  {alexa="Speaker.volume"}
  Switch Mute     "Mute"    (Stereo)  {alexa="Speaker.muted"}
  Switch Power    "Power"   (Stereo)  {alexa="PowerController.powerState"}
  String Input    "Input"   (Stereo)  {alexa="InputController.input" [supportedInputs="HDMI1,TV"]}
  String Channel  "Channel" (Stereo)  {alexa="ChannelController.channel"}
  Player Player   "Player"  (Stereo)  {alexa="PlaybackController.playbackState"}
  ```

  For components of a device, which isn't covered by the existing interfaces, that have more than one setting, characterized by a number within a range or just turn on and off, the Mode, Range and Toggle controllers can be used to highly customize how you interact with that device via Alexa. Below are few examples on how these interfaces can be used. Details about to the configuration settings are listed in the next section under the relevant interface.

```
  Group Washer       "Washer"               {alexa="Endpoint.Other"}
  Number Cycle       "Cycle"       (Washer) {alexa="ModeController.mode" [Normal=0,Delicate=1,supportedModes="Normal:Cottons,Value.Delicate:Knites",friendlyNames="Wash Cycle,Wash Setting",ordered=false]}
  Number Temperature "Temperature" (Washer) {alexa="ModeController.mode" [Cold=0,Warm=1,Hot=2,supportedModes="Cold:Cool,Warm,Hot",friendlyNames="Wash Temperature,Setting.WaterTemperature",ordered=true]}  
  Switch Power       "Power"       (Washer) {alexa="ToggleController.toggleState" [friendlyNames="DeviceName.Washer"]}
  ```
```
  Group Fan     "Fan"          {alexa="Endpoint.Other"}
  Number Speed  "Speed"  (Fan) {alexa="RangeController.rangeValue" [supportedRange="1:10:1",presets="1:Value.Minimum:Value.Low:Lowest,10:Value.Maximum:Value.High:Highest",friendlyNames="Setting.FanSpeed,Speed"]}
  Switch Rotate "Rotate" (Fan) {alexa="ToggleController.toggleState" [friendlyNames="Setting.Oscillate,Rotate"]}
  Switch Power  "Power"  (Fan) {alexa="ToggleController.toggleState" [friendlyNames="DeviceName.Fan"]}
  ```

#### Supported item mapping metadata
* The following are a list of supported metadata.
  * `PowerController.powerState`
    * Items that turn on or off such as light switches, power states, etc..
    * Supported item type:
      * Color
      * Dimmer
      * Rollershutter
      * Switch
    * Default category: SWITCH
  * `BrightnessController.brightness`
    * Items which response to percentage level and brightness commands (dim, brighten, percent), typically lights.
    * Supported item type:
      * Color
      * Dimmer
    * Default category: LIGHT
  * `PowerLevelController.powerLevel`
    * Items which respond to a specific number setting
    * Supported item type:
      * Dimmer
    * Default category: SWITCH
  * `PercentageController.percentage`
    * Items which respond to percentage commands such as roller shutters.
    * Supported item type:
      * Dimmer
      * Rollershutter
    * Default category: OTHER
  * `ThermostatController.targetSetpoint`
    * Items that represent a target set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (e.g., scale=Fahrenheit). If omitted, the scale will be determined based on: (1) unit of measurement unit if Number:Temperature item type; (2) your openHAB server regional measurement system or region settings (US=Fahrenheit; SI=Celsius); (3) defaults to Celsius.
    * Supported item type:
      * Number(:Temperature)
    * Default category: THERMOSTAT
    * Supports additional properties:
      * scale=`<scale>`
        * Celsius
        * Fahrenheit
        * Kelvin
  * `ThermostatController.upperSetpoint`
    * Items that represent a upper or HEAT set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (e.g., scale=Fahrenheit). If omitted, the scale will be determined based on: (1) unit of measurement unit if Number:Temperature item type; (2) your openHAB server regional measurement system or region settings (US=Fahrenheit; SI=Celsius); (3) defaults to Celsius.
    * Supported item type:
      * Number(:Temperature)
    * Default category: THERMOSTAT
    * Supports additional properties:
      * scale=`<scale>`
        * Celsius
        * Fahrenheit
        * Kelvin
      * comfortRange=`<number>`
        * When dual setpoints (upper,lower) are used this is the amount over the requested temperature when requesting Alexa to set or adjust the current temperature.  Defaults to comfortRange=1 if using Fahrenheit and comfortRange=.5 if using Celsius. Ignored if a targetSetpoint is included in the thermostat group.
  * `ThermostatController.lowerSetpoint`
    * Items that represent a lower or COOL set point for a thermostat, value may be in Celsius or Fahrenheit depending on how the item is configured (e.g., scale=Fahrenheit). If omitted, the scale will be determined based on: (1) unit of measurement unit if Number:Temperature item type; (2) your openHAB server regional measurement system or region settings (US=Fahrenheit; SI=Celsius); (3) defaults to Celsius.
    * Supported item type:
      * Number(:Temperature)
    * Default category: THERMOSTAT
    * Supports additional properties:
      * scale=`<scale>`
        * Celsius
        * Fahrenheit
        * Kelvin
      * comfortRange=`<number>`
        * When dual setpoints (upper,lower) are used this is the amount under the requested temperature when requesting Alexa to set or adjust the current temperature.  Defaults to comfortRange=1 if using Fahrenheit and comfortRange=.5 if using Celsius.  Ignored if a targetSetpoint is included in the thermostat group.
  * `ThermostatController.thermostatMode`
    * Items that represent the mode for a thermostat, default string values are "OFF=off,HEAT=heat,COOL=cool,ECO=eco,AUTO=auto", but these can be mapped to other values in the metadata. The mapping can be, in order of precedence, user-defined (AUTO=3,...) or preset-based related to the thermostat binding used (binding=`<value>`). If neither of these settings are provided, for thermostats that only support a subset of the standard modes, a comma delimited list of the Alexa supported modes should be set using the supportedModes parameter, otherwise, the supported list will be compiled based of the configured mapping.
    * Supported item type:
      * Number
      * String
      * Switch (Heating only)
    * Default category: THERMOSTAT
    * Supports additional optional properties:
      * OFF=`<state>`
      * HEAT=`<state>`
      * COOL=`<state>`
      * ECO=`<state>`
      * AUTO=`<state>`
      * binding=`<value>`
        * [ecobee1](https://www.openhab.org/addons/bindings/ecobee1/) [OFF=off, HEAT=heat, COOL=cool, AUTO=auto]
        * [max](https://www.openhab.org/addons/bindings/max/) [HEAT=MANUAL, ECO=VACATION, AUTO=AUTOMATIC]
        * [nest](https://www.openhab.org/addons/bindings/nest/) [OFF=OFF, HEAT=HEAT, COOL=COOL, ECO=ECO, AUTO=HEAT_COOL]
        * [nest1](https://www.openhab.org/addons/bindings/nest1/) [OFF=off, HEAT=heat, COOL=cool, ECO=eco, AUTO=heat-cool]
        * [zwave](https://www.openhab.org/addons/bindings/zwave/) [OFF=0, HEAT=1, COOL=2, AUTO=3]
        * [zwave1](https://www.openhab.org/addons/bindings/zwave1/) [OFF=0, HEAT=1, COOL=2, AUTO=3]
        * defaults to [OFF=off, HEAT=heat, COOL=cool, ECO=eco, AUTO=auto] if omitted
      * supportedModes=`<values>`
        * defaults to, depending on the parameters provided, either user-based, preset-based or default mapping.
  * `TemperatureSensor.temperature`
    * Items that represent the current temperature, value may be in Celsius or Fahrenheit depending on how the item is configured (e.g., scale=Fahrenheit). If omitted, the scale will be determined based on: (1) unit of measurement unit if Number:Temperature item type; (2) your openHAB server regional measurement system or region settings (US=Fahrenheit; SI=Celsius); (3) defaults to Celsius.
    * Supported item type:
      * Number(:Temperature)
    * Default category: TEMPERATURE_SENSOR
    * Supports additional properties:
      * scale=`<scale>`
        * Celsius
        * Fahrenheit
        * Kelvin
  * `LockController.lockState`
    * Items that represent the state of a lock (ON lock, OFF unlock). When associated to an [item sensor](#item-sensor), the state of that item will be returned instead of the original actionable item. Additionally, when linking to such item, multiple properties to one state can be mapped with column delimiter (e.g. for a zwave lock: [LOCKED="1:3",UNLOCKED="2:4",JAMMED=11]).
    * Supported item type:
      * Switch
    * Supported sensor type:
      * Contact [LOCKED=CLOSED, UNLOCKED=OPEN]
      * Number [LOCKED=1, UNLOCKED=2, JAMMED=3]
      * String [LOCKED=locked, UNLOCKED=unlocked, JAMMED=jammed]
      * Switch [LOCKED=ON, UNLOCKED=OFF]
    * Default category: SMARTLOCK
    * Supports additional properties:
      * LOCKED=`<state>`
      * UNLOCKED=`<state>`
      * JAMMED=`<state>`
      * defaults based on item sensor type if omitted
  * `ColorController.color`
    * Items that represent a color
    * Supported item type:
      * Color
    * Default category: LIGHT
  * `ColorTemperatureController.colorTemperatureInKelvin`
    * Items that represents a color temperature, default increment value may be specified in metadata parameters. For dimmer typed items adjustments, INCREASE/DECREASE commands will be sent instead if increment value not defined, while number typed items will default to 500K increments.
    * Supported item type:
      * Dimmer: colder (0%) to warmer (100%) based of Alexa color temperature spectrum [Hue and LIFX support]
      * Number: color temperature value in Kelvin [custom integration]
    * Default category: LIGHT
    * Supports additional properties:
      * increment=`<number>`
        * value in % for dimmer item/in Kelvin for number item
        * defaults to increment=INCREASE/DECREASE (Dimmer) or increment=500 (Number) if omitted
  * `SceneController.scene`
    * Items that represent a scene or an activity depending on defined category and may be set not to support deactivation requests based on metadata parameters.
    * Supported item type:
      * Switch
    * Default category: SCENE_TRIGGER
    * Supports additional properties:
      * supportsDeactivation=`<boolean>`
        * true (default if omitted)
        * false
  * `ChannelController.channel`
    * Items that represent a channel. A channel mapping may be specified in metadata parameters allowing channel request by name.
    * Supported item type:
      * Number
      * String
    * Default category: TV
    * Supports additional properties:
      * `<channelName1>`=`<channelNumber1>`
      * `<channelName2>`=`<channelNumber2>`
      * ...
  * `InputController.input`
    * Items that represent a source input (e.g. "HDMI 1", or "TUNER" on a stereo). A list of [supported input values](https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#input-values) needs to be provided using the supportedInputs parameter. The space between the input name and number is not sent to OH (e.g. "HDMI 1" [alexa] => "HDMI1" [OH]). That space can also be omitted in the supported list as well.
    * Supported item type:
      * String
    * Default category: TV
    * supports additional properties:
      * supportedInputs=`<inputs>`
        * required list of supported input values (e.g. "HMDI1,TV,XBOX")
  * `Speaker.volume`
    * Items that represent a volume level, default increment may be specified in metadata parameters
    * Supported item type:
      * Dimmer
      * Number
    * Default category: SPEAKER
    * Supports additional properties:
      * increment=`<number>`
        * defaults to increment=10 (standard value provided by Alexa) if omitted.
  * `Speaker.muted`
    * Items that represent a muted state (ON muted, OFF unmuted)
    * Supported item type:
      * Switch
    * Default category: SPEAKER
  * `StepSpeaker.volume`
    * Items that represent a volume level controlled in steps only (for example IR controlled, ex: +1, -1)
    * Supported item type:
      * Dimmer
      * Number
    * Default category: SPEAKER
  * `StepSpeaker.muted`
    * Items that represent a muted state (ON muted, OFF unmuted)
    * Supported item type:
      * Switch
    * Default category: SPEAKER
  * `PlaybackController.playbackState`
    * Items that represent the playback of a AV device. (Supported commands: Play, Pause, Next, Previous, Rewind, Fast Forward)
    * Supported item type:
      * Player
    * Default category: OTHER
  * `ContactSensor.detectionState`
    * Items that represent a contact sensor that can be used to trigger Alexa routines. (Currently not usable as proactive reporting not supported yet)
    * Supported item type:
      * Contact
      * Switch
    * Default category: CONTACT_SENSOR
  * `MotionSensor.detectionState`
    * Items that represent a motion sensor that can be used to trigger Alexa routines. (Currently not usable as proactive reporting not supported yet)
    * Supported item type:
      * Contact
      * Switch
    * Default category: MOTION_SENSOR
  * `ModeController.mode`
    * Items that represent components of a device that have more than one setting. Multiple instances can be configured in a group endpoint. By default, to ask for a specific mode, the item label will be used as the friendly name. To configure it, use `friendlyNames` parameter and provide a comma delimited list of different labels (Some names are [not allowed](#item-friendly-names-not-allowed)). Additionally, pre-defined [asset ids](#item-asset-catalog) can be used to label a mode as well (e.g. `Setting.WaterTemperature`). In regards to supported modes and their mappings, by default, the item state description options are used to determine these configurations. To configure it, use `supportedModes` parameter and provide a comma delimited list of modes and alternate names/asset ids, for that same mode, separated by column sign (e.g. `Cold:Cool,Warm,Hot`). When specifying alternate mode names, the first item will be used as Alexa state. In the event, the primary mode is an asset id, the last word will be used as mode name (e.g. `Normal:Cottons,Value.Delicate:Knites`; Modes => `[Normal, Delicate]`). For the mapping, add each mode to the parameters similar to how it is done with other interfaces (e.g. `Cold=0,Warm=1,Hot=2`). No need to provide mappings if Alexa and OH states are the same. Additionally, in order to be able to request Alexa to adjust modes incrementally, set parameter `ordered=true`, otherwise requests to only set a specific mode will be accepted.
    * Supported item type:
      * Number
      * String
    * Default category: OTHER
    * Supports additional properties:
      * `<alexaMode1>`=`<stateMap1>`
      * `<alexaMode2>`=`<stateMap2>`
      * ...
      * supportedModes=`<modes>`
        * defaults to item state description options labels, if defined, otherwise no modes
      * ordered=`<boolean>`
        * defaults to false
      * friendlyNames=`<names/assetIds>`
        * defaults to item label name
  * `RangeController.rangeValue`
    * Items that represent components of a device that are characterized by numbers within a minimum and maximum range. Multiple instances can be configured in a group endpoint. By default, to ask for a specific range, the item label will be used as the friendly name. To configure it, use `friendlyNames` parameter and provide a comma delimited list of different labels (Some names are [not allowed](#item-friendly-names-not-allowed)). Additionally, pre-defined [asset ids](#item-asset-catalog) can be used to label a mode as well (e.g. `Setting.FanSpeed`). To set the supported range, provide a column delimited list including minimum, maximum and precision values. The later value will be use as default increment when requesting adjusted range values. Optionally, to name specific presets, like fan speeds low [1] & high value [10], can be added in `presets` parameter and provide a comma delimited list of presets and their names/asset ids delimited by column sign (e.g. `1:Value.Minimum:Value.Low:Lowest,10:Value.Maximum:Value.High:Highest`). Another optional settings is `unitOfMeasure` parameter which gives a unit of measure to the range values. By default it is based on unit of measurement number item type that have a supported unit, otherwise, a [unit id](#item-unit-of-measurement-catalog) can be used. (e.g. `unitOfMeasure=Angle.Degrees`)
    * Supported item type:
      * Dimmer
      * Number
      * Number:Angle
      * Number:Dimensionless
      * Number:Length
      * Number:Mass
      * Number:Temperature
      * Number:Volume
      * Rollershutter
    * Default category: OTHER
    * supports additional properties:
      * supportedRange=`<minValue:maxValue:precision>`
        * defaults to `[0:100:1]` for Dimmer/Rollershutter, `[0:10:1]` for Number* item types
      * unitOfMeasure=`<unitOfMeasureId>` (optional)
        * defaults to item state unit of measurement symbol for Number:* item types
      * presets=`<presets>` (optional)
        * each preset formatted as `<presetValue>:<assetIdOrName1>:<assetIdOrName2>:...`
      * friendlyNames=`<names/assetIds>`
        * defaults to item label name
  * `ToggleController.toggleState`
    * Items that represent components of a device that can be turned on or off. Multiple instances can be configured in a group endpoint. By default, to ask for a specific range, the item label will be used as the friendly name. To configure it, use `friendlyNames` parameter and provide a comma delimited list of different labels (Some names are [not allowed](#item-friendly-names-not-allowed)). Additionally, pre-defined [asset ids](#item-asset-catalog) can be used to label a mode as well (e.g. `Setting.Oscillate`).
    * Supported item type:
      * Color
      * Dimmer
      * Rollershutter
      * Switch
    * Default category: OTHER
    * Supports additional properties:
      * friendlyNames=`<names/assetIds>`
        * defaults to item label name

##### Item Scale
  * With the introduction of the [unit of measurement](https://www.openhab.org/docs/concepts/units-of-measurement.html) concept, the item scale can be automatically determined for thermostat and temperature using that feature, removing the need of having to set a metadata scale parameter for each of the relevant items or groups.
  * Below are two examples; the scale on the first will be set to Fahrenheit based on how it is defined in the item state presentation pattern and the second one will be set based on your openHAB system regional settings (US=Fahrenheit; SI=Celsius).

  `Number:Temperature Temperature1 "Temperature [%.1f °F]" {alexa="TemperatureSensor.temperature"}`
  `Number:Temperature Temperature2 "Temperature"           {alexa="TemperatureSensor.temperature"}`

##### Item Sensor
  * When available, use a specific item (called "sensor") for property state reporting over the actionable item state.
  * Design to bridge channel status items to provide improved reporting state accuracy.
  * Configured by adding the `itemSensor=<itemName>` metadata parameter.
  * Sensor items need to be the same type than their parent item, except for LockController capable items.

##### Item Categories
  * Alexa has certain categories that effect how voice control and their mobile/web UI's display or control endpoints.  An example of this is when you create "Smart Device Groups" in the Alex app and associate a specific Echo or Dot to that Group (typically a room).  When a user asks to turn the lights ON, Alexa looks for devices in that group that have the category "LIGHT" to send the command to.  
  * You can override this default value on items by adding it as a parameter to the metadata, ex:

  `Switch LightSwitch "Light Switch" {alexa="PowerController.powerState" [category="OTHER"]}`
  * List of Alexa categories currently supported from [Alexa Skill API](https://developer.amazon.com/docs/device-apis/alexa-discovery.html#display-categories) docs:

Category | Description | Notes
---------|-------------|-------
ACTIVITY_TRIGGER | Describes a combination of devices set to a specific state, when the state change must occur in a specific order. |For example, a "watch Netflix" scene might require the: 1. TV to be powered on & 2. Input set to HDMI1. | Applies to Scenes
CAMERA | Indicates media devices with video or photo capabilities.  
CONTACT_SENSOR | Indicates an endpoint that detects and reports changes in contact between two surfaces.
DOOR | Indicates a door.  
DOORBELL | Indicates a doorbell.
LIGHT | Indicates light sources or fixtures.
MICROWAVE | Indicates a microwave oven endpoint.  
MOTION_SENSOR | Indicates an endpoint that detects and reports movement in an area.
OTHER | An endpoint that cannot be described in on of the other categories.  
SCENE_TRIGGER | Describes a combination of devices set to a specific state, when the order of the state change is not important. For example a bedtime scene might include turning off lights and lowering the thermostat, but the order is unimportant. | Applies to Scenes
SECURITY_PANEL | Indicates a security panel.
SMARTLOCK | Indicates an endpoint that locks.  
SMARTPLUG | Indicates modules that are plugged into an existing electrical outlet. | Can control a variety of devices.
SPEAKER | Indicates the endpoint is a speaker or speaker system.  
SWITCH | Indicates in-wall switches wired to the electrical system. | Can control a variety of devices.
TEMPERATURE_SENSOR | Indicates endpoints that report the temperature only.  
THERMOSTAT | Indicates endpoints that control temperature, stand-alone air conditioners, or heaters with direct temperature control.  
TV | Indicates the endpoint is a television.  

##### Item Asset Catalog
  * List of Alexa asset catalog from [Alexa Skill API](https://developer.amazon.com/docs/device-apis/resources-and-assets.html#global-alexa-catalog) docs:

Asset Identifier | Supported Friendly Names
-----------------|-------------------------
DeviceName.Shower | Shower
DeviceName.Washer | Washer<br>Washing Machine
DeviceName.Router | Router<br>Internet Router<br>Network Router<br>Wifi Router<br>Net Router
DeviceName.Fan | Fan<br>Blower
DeviceName.AirPurifier | Air Purifier<br>Air Cleaner<br>Clean Air Machine
DeviceName.SpaceHeater | Space Heater<br>Portable Heater
Shower.RainHead | Rain Head<br>Overhead shower<br>Rain Shower<br>Rain Spout<br>Rain Faucet
Shower.HandHeld | Handheld Shower<br>Shower Wand<br>Hand Shower
Setting.WaterTemperature | Water Temperature<br>Water Temp<br>Water Heat
Setting.Temperature | Temperature<br>Temp
Setting.WashCycle | Wash Cycle<br>Wash Preset<br>Wash setting
Setting.2GGuestWiFi | 2.4G Guest Wi-Fi<br>2.4G Guest Network<br>Guest Network 2.4G<br>2G Guest Wifi
Setting.5GGuestWiFi | 5G Guest Wi-Fi<br>5G Guest Network<br>Guest Network 5G<br>5G Guest Wifi
Setting.GuestWiFi | Guest Wi-fi<br>Guest Network<br>Guest Net
Setting.Auto | Auto<br>Automatic<br>Automatic Mode<br>Auto Mode
Setting.Night | Night<br>Night Mode
Setting.Quiet | Quiet<br>Quiet Mode<br>Noiseless<br>Silent
Setting.Oscillate | Oscillate<br>Swivel<br>Oscillation<br>Spin<br>Back and forth
Setting.FanSpeed | Fan Speed<br>Airflow speed<br>Wind Speed<br>Air speed<br>Air velocity<br>
Setting.Preset | Preset<br>Setting
Setting.Mode | Mode
Setting.Direction | Direction
Value.Delicate | Delicates<br>Delicate
Value.QuickWash | Quick Wash<br>Fast Wash<br>Wash Quickly<br>Speed Wash
Value.Maximum | Maximum<br>Max
Value.Minimum | Minimum<br>Min
Value.High | High
Value.Low | Low
Value.Medium | Medium<br>Mid

##### Item Friendly Names Not Allowed
  * List of Alexa friendly names that cannot be used from [Alexa Skill API](https://developer.amazon.com/docs/device-apis/resources-and-assets.html#names-you-cannot-use)

Friendly Names |
---------------|
alarm |
alarms |
all alarms |
away mode |
bass |
camera |
date |
date today |
day |
do not disturb |
drop in |
music |
night light |
notification |
playing |
sleep sounds |
time |
timer |
today in music |
treble |
volume |
way f. m. |

##### Item Unit of Measurement Catalog
  * List of Alexa unit of measurement catalog from [Alexa Skill API](https://developer.amazon.com/docs/device-apis/alexa-rangecontroller.html#supported-values-for-unitofmeasure) docs:

Unit Identifier |
----------------|
Angle.Degrees |
Angle.Radians |
Distance.Yards |
Distance.Inches |
Distance.Meters |
Distance.Feet |
Distance.Miles |
Distance.Kilometers |
Mass.Kilograms |
Mass.Grams |
Percent |
Temperature.Degrees |
Temperature.Celsius |
Temperature.Fahrenheit |
Temperature.Kelvin |
Volume.Gallons |
Volume.Pints |
Volume.Quarts |
Volume.Liters |
Volume.CubicMeters |
Volume.CubicFeet |
Weight.Pounds |
Weight.Ounces |

#### Supported Group mapping metadata
* Functional groups (no group type) can be labelled with one of Alexa categories listed above. It can be set using one of the two formats: `Endpoint.<category>` or `<category>`
* Example `{alexa="Endpoint.Thermostat"}` or `{alexa="Thermostat"}`
* Child item categories are ignored and only the group category is used on items.
* Case is ignored on the category part of the metadata and any value will be made all uppercase before its passed to the Alexa API.

#### Label Support
Item tags and metadata labels translate to a set of capabilities and can be usesd as a convenience to using the longer meta data format configuration.  These are the same as v2 tags but add additional functions and provide the ability to add customization through additional properties which take precedence over the default ones. Here are some examples:
```
Switch OutletPlug "Outlet Plug" {alexa="Switchable" [category="SMARTPLUG"]}
Switch TelevisionPower "Television Power" {alexa="Switchable" [category="TV"]}

Color LightColor "Light Color" {alexa="Lighting"}
```

Here are the labels currently supported and what they translate to. Each example shows using the item label, meta data label and the full translated metadata.

* Switchable (capabilities depending on item type)
```
Switch DeviceSwitch "Device Switch" ["Switchable"]
Rollershutter ShutterSwitch "Shutter Switch" ["Switchable"]

Switch DeviceSwitch "Device Switch" {alexa="Switchable"}
Rollershutter ShutterSwitch "Shutter Switch" {alexa="Switchable"}

Switch DeviceSwitch "Device Switch" {alexa="PowerController.powerState" [category="SWITCH"]}
Rollershutter ShutterSwitch "Shutter Switch" {alexa="PowerController.powerState,PercentageController.percentage" [category="SWITCH"]}
```
* Lighting (capabilities depending on item type)
```
Dimmer LightDimmer "Light Dimmer" ["Lighting"]
Color LightColor "Light Color" ["Lighting"]

Dimmer LightDimmer "Light Dimmer" {alexa="Lighting"}
Color LightColor "Light Color" {alexa="Lighting"}

Dimmer LightDimmer "Light Dimmer" {alexa="PowerController.powerState,BrightnessController.brightness" [category="LIGHT"]}
Color LightColor "Light Color" {alexa="PowerController.powerState,BrightnessController.brightness,ColorController.color" [category="LIGHT"]}
```

* Lock
```
Switch DoorLock "Door Lock" ["Lock"]

Switch DoorLock "Door Lock" {alexa="Lock"}

Switch DoorLock "Door Lock" {alexa="LockController.lockState"}
```
* CurrentTemperature
```
Number CurrentTemperature "Current Temperature" ["CurrentTemperature"]

Number CurrentTemperature "Current Temperature" {alexa="CurrentTemperature"}

Number CurrentTemperature "Current Temperature" {alexa="TemperatureSensor.temperature" [scale="Celsius"]}
```
* TargetTemperature
```
Number TargetTemperature "Target Temperature" ["TargetTemperature]

Number TargetTemperature "Target Temperature" {alexa="TargetTemperature"}

Number TargetTemperature "Target Temperature" {alexa="ThermostatController.targetSetpoint" [scale="Celsius"]}
```
* LowerTemperature
```
Number LowerTemperature "Lower Temperature" ["LowerTemperature"]

Number LowerTemperature "Lower Temperature" {alexa="LowerTemperature"}

Number LowerTemperature "Lower Temperature" {alexa="ThermostatController.lowerSetpoint" [scale="Celsius"]}
```
* UpperTemperature
```
Number UpperTemperature "Upper Temperature" [UpperTemperature"]

Number UpperTemperature "Upper Temperature" alexa="UpperTemperature"}

Number UpperTemperature "Upper Temperature" {alexa="ThermostatController.upperSetpoint" [scale="Celsius"]}
```
* HeatingCoolingMode
```
String HeatingCoolingMode "Thermostat Mode" ["HeatingCoolingMode"]

String HeatingCoolingMode "Thermostat Mode" {alexa="HeatingCoolingMode"}

String HeatingCoolingMode "Thermostat Mode" {alexa="ThermostatController.thermostatMode"}
```
* ColorTemperature
```
Dimmer ColorTemperature "Color Temperature" ["ColorTemperature"]

Dimmer ColorTemperature "Color Temperature" {alexa="ColorTemperature"}

Dimmer ColorTemperature "Color Temperature" {alexa="ColorTemperatureController.colorTemperatureInKelvin"}
```
* Activity
```
Switch Activity "Activity" ["Activity"]

Switch Activity "Activity" {alexa="Activity"}

Switch Activity "Activity" {alexa="SceneController.scene" [category="ACTIVITY_TRIGGER"]}
```
* Scene
```
Switch Scene "Scene" [Scene"]

Switch Scene "Scene" {alexa="Scene"}

Switch Scene "Scene" {alexa="SceneController.scene" [category="SCENE_TRIGGER"]}
```
* EntertainmentChannel
```
String EntertainmentChannel "Entertainment Channel" ["EntertainmentChannel"]

String EntertainmentChannel "Entertainment Channel" {alexa="EntertainmentChannel"}

String EntertainmentChannel "Entertainment Channel" {alexa="ChannelController.channel"}
```
* EntertainmentInput
```
String EntertainmentInput "Entertainment Input" ["EntertainmentInput]

String EntertainmentInput "Entertainment Input" {alexa="EntertainmentInput}

String EntertainmentInput "Entertainment Input" {alexa="InputController.input"}
```
* MediaPlayer
```
Player MediaPlayer "Media Player" ["MediaPlayer"]

Player MediaPlayer "Media Player" {alexa="PlaybackController.playbackState"}
```
* SpeakerMute
```
Switch SpeakerMute "Speaker Mute" ["SpeakerMute"]

Switch SpeakerMute "Speaker Mute" {alexa="SpeakerMute"}

Switch SpeakerMute "Speaker Mute" {alexa="Speaker.muted"}
```
* SpeakerVolume
```
Number SpeakerVolume "Speaker Volume" ["SpeakerVolume"]

Number SpeakerVolume "Speaker Volume" {alexa="SpeakerVolume"}

Number SpeakerVolume "Speaker Volume" {alexa="Speaker.volume"}
```
* ContactSensor
```
Contact ContactSensor "Contact Sensor" ["ContactSensor"]

Contact ContactSensor "Contact Sensor" {alexa="ContactSensor"}

Contact ContactSensor "Contact Sensor" {alexa="ContactSensor.detectionState"}
```
* MotionSensor
```
Contact MotionSensor "Motion Sensor" ["MotionSensor"]

Contact MotionSensor "Motion Sensor" {alexa="MotionSensor"}

Contact MotionSensor "Motion Sensor" {alexa="MotionSensor.detectionState"}
```
* ModeComponent
```
String ModeComponent "Mode Component" ["ModeComponent"]

String ModeComponent "Mode Component" {alexa="ModeComponent"}

String ModeComponent "Mode Component" {alexa="ModeController.range"}
```
* RangeComponent
```
Number RangeComponent "Range Component" ["RangeComponent"]

Number RangeComponent "Range Component" {alexa="RangeComponent"}

Number RangeComponent "Range Component" {alexa="RangeController.rangeValue"}
```
* ToggleComponent
```
Switch ToggleComponent "Toggle Component" ["Toggle Component"]

Switch ToggleComponent "Toggle Component" {alexa="ToggleComponent"}

Switch ToggleComponent "Toggle Component" {alexa="ToggleController.toggleState"}
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
