# Amazon Alexa Smart Home skill for openHAB 2

This is a nodejs / lambda application that connects the Alexa Smart Home API to to a user's openHAB instance, either directly or through the openHAB Cloud service (preferred).  The Smart Home API is not a general skill API, it allows the user to bypass using a application wake work and instead ask Alexa to perform a smart home action like "Alexa turn lights on"

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
* change config files to match your enviroment.
* run "node-lambda deploy"
* login to the amazon lambda console and select the newly created project,
* Under "Event Sources"  add a "smart home skill" event source, for Application Id, add the Application Id from the Alexa developer portal
* copy the ARN value from the very top of the screen.
* login back to the Alexa console and select "configuration"
* Paste the ARN value from your Lambda into the "Lambda ARN" Field
* Fill out OAUTH2 information (from your oauth server or the Amazon Login service. See [this post](https://developer.amazon.com/public/community/post/Tx3CX1ETRZZ2NPC/Alexa-Account-Linking-5-Steps-to-Seamlessly-Link-Your-Alexa-Skill-with-Login-wit) for step-by-step instructions for _Login with Amazon_.)
* MAKE SURE YOU HAVE VALID SSL CERTS AND CERT CHAINS!!!! I highly recommend using Lets Encrypt.   

## Item configuration

* openHAB 2
  * Items are exposed via Homekit tags, the following is taken from the homekit binding in openHAB2:

  ```
  Switch KitchenLights "Kitchen Lights" <light> (gKitchen) [ "Lighting" ]
  Dimmer BedroomLights "Bedroom Lights" <light> (gBedroom) [ "Lighting" ]
  Number BedroomTemperature "Bedroom Temperature" (gBedroom) [ "CurrentTemperature" ]
  Group gDownstairsThermostat "Downstairs Thermostat" (gFF) [ "Thermostat" ]
  Number DownstairsThermostatCurrentTemp "Downstairs Thermostat Current Temperature" (gDownstairsThermostat) [ "CurrentTemperature" ]
  Number DownstairsThermostatTargetTemperature "Downstairs Thermostat Target Temperature" (gDownstairsThermostat) [ "TargetTemperature" ]
  String DownstairsThermostatHeatingCoolingMode "Downstairs Thermostat Heating/Cooling Mode" (gDownstairsThermostat) [ "homekit:HeatingCooling
  ```

  * Thermostats are created by adding the items of a thermostat to a group which has the tag "Thermostat" which follows the HomeKit binding configuration. See the [HomeKit binding documentation](https://www.openhab.org/addons/integrations/homekit/) for more information on how to configure thermostats. Thermostats can have their target temperature set as well as be asked what the current temperature is.
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
