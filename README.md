# Amazon Alexa Smart Home skill for openHAB 2

[![Build Status](https://travis-ci.org/openhab/openhab-alexa.svg?branch=master)](https://travis-ci.org/openhab/openhab-alexa)
[![Crowdin](https://badges.crowdin.net/openhab-alexa/localized.svg)](https://crowdin.com/project/openhab-alexa)

This is a nodejs / lambda application that connects the Alexa Smart Home API to a user's openHAB instance, either directly or through the openHAB Cloud service (preferred).  The Smart Home API is not a general skill API, it allows the user to bypass using a application wake work and instead ask Alexa to perform a smart home action like "Alexa turn lights on"

# General Deployment Instructions

## Intended Audience

This document describes how to configure and deploy the skill for development or private hosting purposes and it targeted towards developers and not end users of the skill

## Skill Usage

For end-user documentation and general usage, see the [Usage](USAGE.md) page for examples and instructions on configuring items for Alexa within openHAB.

## Requirements

### Alexa Skills Kit CLI with Amazon AWS and Developer Accounts

You need an [AWS account](https://aws.amazon.com) and an [Amazon developer account](https://developer.amazon.com) to create an Alexa Skill.

In order to use the ASK CLI features to automatically deploy and manage your Lambda skill, ensure that you have AWS credentials set up with the appropriate permissions on the computer you are installing ASK CLI, as described in [this documentation](https://developer.amazon.com/docs/smapi/manage-credentials-with-ask-cli.html).

You will have to install the latest [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) v1.x, and then initialize it:
```
$ npm install -g ask-cli@^1.0.0
$ ask init
```

By default, the ASK CLI deploys the lambda function in the `us-east-1` region. You will need to change your [default region](https://docs.aws.amazon.com/general/latest/gr/rande.html#lambda_region) based on the skill language you are planning to use. You should refer to the table below, based on the [smart home multi-languages development guidelines](https://developer.amazon.com/docs/smarthome/develop-smart-home-skills-in-multiple-languages.html#deploy):

| Skill Language | Endpoint Region | Lambda Region |
| -------------- | --------------- | ------------- |
| English (CA), English (US), French (CA), Portuguese (BR),<br>Spanish (MX), Spanish (US) | North America | us-east-1 |
| English (UK), French (FR), German, Italian, Spanish (ES) | Europe | eu-west-1 |
| English (IN), Hindi (IN) | India | eu-west-1 |
| English (AU), Japanese | Far East | us-west-2 |

To change your default region, you will need to add the `region` parameter to the AWS credentials file located in your home directory, under the AWS profile name associated during the ASK CLI profile initialization. The default profile name is `ask_cli_default`.

```
$ cat ~/.aws/credentials
[ask_cli_default]
aws_access_key_id=<accessKeyId>
aws_secret_access_key=<secretAccessKey>
region=us-east-1
```

### OAuth2 Provider

If you aren't using your own OAuth2 server (e.g. private openHAB Cloud Connector), it is highly recommended to use [Login with Amazon](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html). See [this post](https://developer.amazon.com/public/community/post/Tx3CX1ETRZZ2NPC/Alexa-Account-Linking-5-Steps-to-Seamlessly-Link-Your-Alexa-Skill-with-Login-wit) to set it up for your private skill. Doing so allows [other server level authentication methods](#openhab-server) to be used over the Alexa Smart Home skill requirements for OAuth2 authentication.

If using a private openHAB Cloud Connector, in order to setup the OAuth2 server, make sure to create a client profile and scope to use with the skill in the Mango database, and that it is accessible on port 443. It is recommended to use an online random hex number generator to create a unique client secret.

```
$ mongo
> use openhab
> db.oauth2clients.insert({ name: "Alexa", description: "Alexa Voice Control", icon: "alexa.png", clientId: "alexa-skill", clientSecret: "<clientSecret>" })
> db.oauth2scopes.insert({ name: "alexa", description: "Access to openHAB Cloud specific API for Amazon Alexa" })
```

And use the following settings during the skill account linking deployment step instead:

* Authorization URL: `https://openhab.myserver.com/oauth2/authorize`
* Client ID: `alexa-skill`
* Scope: `alexa`
* Access Token URI: `https://openhab.myserver.com/oauth2/token`

### openHAB Server

The openHAB server you are trying to control with the skill needs to be accessible online as an AWS service endpoint. You can either use [myopenHAB.org](http://myopenHAB.org) cloud service or point the skill directly to your server URL. If going with the latter, make sure to use a valid SSL certificate. It is highly recommended to use [Let's Encrypt](https://letsencrypt.org) to validate your certificates.

To configure the server path and credentials, you will need to setup the application configuration in `lambda/smarthome/config.js` using the sample file. Set the server rest path in the `baseURL` property if not using myopenHAB.org cloud service. The app can access an openHAB installation using three different types of authentication: SSL client certificate, basic (user/password) or bearer (OAuth2 token). For certificate authentication, place the client certificate in `lambda/smarthome/ssl/client.pfx` or set the `certFile` property with the certificate path, and optionally, set the `certPass` property with the certificate passphrase. For basic authentication, set the `user` and `pass` properties, otherwise a bearer token will be used.

## Deployment Steps

### Create Smart Home Skill and Lambda Function

1. Clone or download this repository:
    ```
    $ git clone https://github.com/openhab/openhab-alexa.git
    ```

2. Deploy the skill and the lambda function in one step:
    ```
    $ ask deploy
    Profile for the deployment: [default]
    -------------------- Create Skill Project --------------------
    Skill Id: <skillId>
    Skill deployment finished.
    [Warn]: No runtime and handler settings found for alexaUsage "smartHome/default" when creating Lambda function. CLI will use "nodejs10.x" and "index.handler" as the Runtime and Handler to create Lambda. You can update the runtime and handler for the target Lambda in the project config and deploy again if you want to set differently.
    Lambda deployment finished.
    Lambda function(s) created:
      [Lambda ARN] <lambdaArn>
    [Info]: No in-skill product to be deployed.
    [Warn]: Skill api domain "smartHome" can not be enabled. Skipping the enablement.
    ```

3. Setup skill account linking using the skill id displayed in previous step and your OAuth2 provider configuration:
    ```
    $ ask api create-account-linking -s <skillId>
    ? Authorization URL:  https://www.amazon.com/ap/oa
    ? Client ID:  <clientId>
    ? Scopes(separate by comma):  profile
    ? Domains(separate by comma):
    ? Authorization Grant Type:  AUTH_CODE
    ? Access Token URI:  https://api.amazon.com/auth/o2/token
    ? Client Secret:  [hidden]
    ? Client Authentication Scheme:  HTTP_BASIC
    ? Optional* Default Access Token Expiration Time In Seconds:
    ? Optional* Reciprocal Access Token Url:
    ? Optional* RedirectUrls for App-to-App Account Linking (separated by comma):
    Account linking created successfully.
    ```

4. Enable skill with account linking:
    * Go to your [Alexa skill console](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw)
    * Click on the "openHAB" skill under the "Dev Skills" tab
    * Click "Enable" and go through the account linking process

### Update Smart Home Skill and Lambda Function

1. Update the repository to latest commit:
    ```
    $ git pull
    ```

2. If updating from v2 version:
    1. Copy relevant settings from `config.js` (v2) to `lambda/smarthome/config.js` (v3).

    2. Add current skill id to ask config by using the skill id listed under your [Alexa developer console](https://developer.amazon.com/alexa/console/ask).
        ```
        $ cat .ask/config
        {
          "deploy_settings": {
            "default": {
              "skill_id": "<skillId>",
              "was_cloned": false,
              "merge": {}
            }
          }
        }
        ```

3. Deploy the skill and the lambda function in one step:
    ```
    $ ask deploy [--force] (Force deployment if lambda manual configs were applied)
    Profile for the deployment: [default]
    -------------------- Update Skill Project --------------------
    Skill Id: <skillId>
    Skill deployment finished.
    Lambda deployment finished.
    Lambda function(s) updated:
      [Lambda ARN] <lambdaArn>
    [Info]: No in-skill product to be deployed.
    [Warn]: Skill api domain "smartHome" can not be enabled. Skipping the enablement.
    ```
