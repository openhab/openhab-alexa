# openHAB Skill for Amazon Alexa

[![CI](https://github.com/openhab/openhab-alexa/actions/workflows/ci.yml/badge.svg)](https://github.com/openhab/openhab-alexa/actions/workflows/ci.yml)
[![Crowdin](https://badges.crowdin.net/openhab-alexa/localized.svg)](https://crowdin.com/project/openhab-alexa)

This is a nodejs / lambda application that connects the Alexa Smart Home API to a user's openHAB instance, either directly or through the openHAB Cloud service (preferred).  The Smart Home API is not a general skill API, it allows the user to bypass using a application wake work and instead ask Alexa to perform a smart home action like "Alexa turn lights on"

# General Deployment Instructions

## Intended Audience

This document describes how to configure and deploy the skill for development or private hosting purposes and it targeted towards developers and not end users of the skill

## Skill Usage

For end-user documentation and general usage, see the [Usage](docs/USAGE.md) page for examples and instructions on configuring items for Amazon Alexa within openHAB.

## Requirements

### Alexa Skills Kit CLI with Amazon AWS and Developer Accounts

You need an [AWS account](https://aws.amazon.com) and an [Amazon developer account](https://developer.amazon.com) to create an Alexa Skill.

In order to use the ASK CLI features to automatically deploy and manage your Lambda skill, ensure that you have AWS credentials set up with the appropriate permissions on the computer you are installing ASK CLI, as described in [this documentation](https://developer.amazon.com/docs/smapi/manage-credentials-with-ask-cli.html).

You will have to install the latest [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html), and then configure it:

```shell
npm install -g ask-cli
ask configure
```

By default, the ASK CLI deploys the skill resources in the `us-east-1` region. You will need to change your deploy region based on the skill language you are planning to use. You should refer to the table below, based on the [smart home multi-languages development guidelines](https://developer.amazon.com/docs/smarthome/develop-smart-home-skills-in-multiple-languages.html#deploy):

| Skill Language | Endpoint Region | Deploy Region |
| -------------- | --------------- | ------------- |
| English (CA), English (US), French (CA), Portuguese (BR),<br>Spanish (MX), Spanish (US) | North America | `us-east-1` |
| English (UK), French (FR), German, Italian, Spanish (ES) | Europe | `eu-west-1` |
| English (IN), Hindi (IN) | India | `eu-west-1` |
| Arabic (SA) | Middle East | `eu-west-1` |
| English (AU), Japanese | Far East | `us-west-2` |

To change your deploy region, update the `awsRegion` skill infrastructure user config parameter in [`ask-resources.json`](ask-resources.json).

### OAuth2 Provider

If you aren't using your own OAuth2 server (e.g. private openHAB Cloud Connector), it is highly recommended to use [Login with Amazon](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html). See [this post](https://developer.amazon.com/public/community/post/Tx3CX1ETRZZ2NPC/Alexa-Account-Linking-5-Steps-to-Seamlessly-Link-Your-Alexa-Skill-with-Login-wit) to set it up for your private skill. Doing so allows [other server level authentication methods](#openhab-server) to be used over the Alexa Smart Home skill requirements for OAuth2 authentication.

If using a private openHAB Cloud Connector, in order to setup the OAuth2 server, make sure it is accessible on port 443, and to create a client profile and scope for Alexa skills in the MongoDB database, by running the below commands with the `mongo` CLI tool. It is recommended to use an online random hex number generator to create a unique client secret.

```shell
use openhab
db.oauth2clients.insert({ name: "Alexa", description: "Alexa Voice Control", icon: "alexa.png", clientId: "alexa-skill", clientSecret: "<clientSecret>" })
db.oauth2scopes.insert({ name: "alexa", description: "Access to openHAB Cloud specific API for Amazon Alexa" })
```

And use the following settings during the skill account linking deployment step instead:

* Authorization URL: `https://openhab.myserver.com/oauth2/authorize`
* Access Token URL: `https://openhab.myserver.com/oauth2/token`
* Client ID: `alexa-skill`
* Scope: `alexa`

### openHAB Server

The openHAB server you are trying to control with the skill needs to be accessible online as an AWS service endpoint. You can either use [myopenHAB.org](http://myopenHAB.org) cloud service or point the skill directly to your server URL. If going with the latter, make sure to use a valid SSL certificate. It is highly recommended to use [Let's Encrypt](https://letsencrypt.org) to validate your certificates.

To configure your server path and credentials, you will need to setup the CloudFormation parameters in [`ask-resources.json`](ask-resources.json). Set your server root level path in the `OpenHABBaseURL` parameter if not using myopenHAB.org cloud service. The Lambda function can access your server using three different types of authentication: SSL client certificate, basic (user/password) or bearer (OAuth2 token). For certificate authentication, place the client certificate in `lambda/ssl/client.pfx` or set the `OpenHABCertFile` parameter with the certificate file relative path to the `lambda` directory, and optionally, set the `OpenHABCertPassphrase` parameter with the certificate passphrase. For basic authentication, set the `OpenHABUsername` and `OpenHABPassword` parameters, otherwise OAuth2 authentication will be used.

## Deployment Steps

### Create Smart Home Skill and Lambda Function

1. Clone or download this repository:

    ```shell
    git clone https://github.com/openhab/openhab-alexa.git
    ```

2. Deploy the skill and the lambda function in one step:

    ```shell
    ask deploy
    ```

3. Setup the skill account linking:
    1. Create the skill account linking request file as `skill-package/accountLinking.json`, adding your [OAuth2 provider](#oauth2-provider) client credentials:

        ```json
        {
          "accountLinkingRequest": {
            "skipOnEnablement": "false",
            "type": "AUTH_CODE",
            "authorizationUrl": "https://www.amazon.com/ap/oa",
            "accessTokenUrl": "https://api.amazon.com/auth/o2/token",
            "accessTokenScheme": "HTTP_BASIC",
            "clientId": "<clientId>",
            "clientSecret": "<clientSecret>",
            "scopes": [
              "profile"
            ],
          }
        }
        ```

    2. Update the skill account linking information, using the skill ID displayed in the deploy step:

        ```shell
        ask smapi update-account-linking-info -s <skillId> --account-linking-request file:skill-package/accountLinking.json
        ```

4. Enable the skill on your Alexa account:
    * Go to your [Alexa skill console](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw)
    * Click on the "openHAB" skill under the "Dev Skills" tab
    * Click "Enable" and go through the account linking process

### Update Smart Home Skill and Lambda Function

1. Update the repository to latest commit:

    ```shell
    git pull
    ```

2. If updating from ASK CLI v1:
    1. Copy relevant settings from `lambda/smarthome/config.js` (ask-cli-v1) to [`ask-resources.json`](ask-resources.json) (ask-cli-v2). If configuring `OpenHABBaseURL`, be aware that it should now point to your server root level and not the rest endpoint. Additionally, move your client certificate to `lambda/ssl` if using that authentication method.

    2. Create the ASK CLI states file as `.ask/ask-states.json`, adding the skill ID listed in your [Alexa developer console](https://developer.amazon.com/alexa/console/ask). This will prevent duplicate skills from being created in your account.

        ```json
        {
          "askcliStatesVersion": "2020-03-31",
          "profiles": {
            "default": {
              "skillId": "<skillId>"
            }
          }
        }
        ```

    3. Delete existing function and logs using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html), or via your [AWS Console](https://console.aws.amazon.com) to prevent conflicts with the CloudFormation stack deployment.

        ```shell
        aws lambda delete-function --function-name alexa-openhab
        aws logs delete-log-group --log-group-name /aws/lambda/alexa-openhab
        ```

    4. Remove old folder environment.

        ```shell
        rm -rf lambda/smarthome
        ```

3. Deploy the skill and the lambda function in one step:

    ```shell
    ask deploy
    ```
