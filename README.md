# An Alexa Smart Home App for openHAB 2

This is a Amazon Alexa Smarthome skill for openHAB 2.    

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
* Fill out OAUTH2 information (from your oauth server or the Amazon Login service)
* MAKE SURE YOU HAVE VALID SSL CERTS AND CERT CHAINS!!!!

## Item configuration
* openHAB 2
  * Items are exposed via Homekit tags, the following is taken from the homekit binding in openHAB2:
  ```
Switch KitchenLights "Kitchen Lights" <light> (gKitchen) [ "homekit:Lightbulb" ]
Dimmer BedroomLights "Bedroom Lights" <light> (gBedroom) [ "homekit:DimmableLightbulb" ]
Number BedroomTemperature "Bedroom Temperature" (gBedroom) [ "homekit:TemperatureSensor" ]
Group gDownstairsThermostat "Downstairs Thermostat" (gFF) [ "homekit:Thermostat","temperatureFormat:fahrenheit" ]
Number DownstairsThermostatCurrentTemp "Downstairs Thermostat Current Temperature" (gDownstairsThermostat) [ "homekit:currentTemperature" ]
Number DownstairsThermostatTargetTemperature "Downstairs Thermostat Target Temperature" (gDownstairsThermostat) [ "homekit:targetTemperature" ]
String DownstairsThermostatHeatingCoolingMode "Downstairs Thermostat Heating/Cooling Mode" (gDownstairsThermostat) [ "homekit:heatingCoolingMode" ]
```
  * By default all temperatures are in Celsius, for Fahrenheit add the tag `temperatureFormat:fahrenheit` to the thermostat group item (which should also be tagged with `homekit:Temperature`)


## Example Voice Commands
Here are some example voice commands:

 * Turn on Office Lights
 * Turn off Pool Waterfall
 * Turn on House Fan
 * Turn on Home Theater Scene
 * Dim Kitchen Lights to 30 percent
 * Set house temperature to 70 degrees
