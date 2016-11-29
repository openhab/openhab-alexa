var https = require('https');
var rest = require('./rest.js');
var utils = require('./utils.js');
var oh2 = require('./oh2.js');
var oh1 = require('./oh1.js');

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
exports.handler = function (event, context) {
    // DEBUG
    utils.log('Input', JSON.stringify(event));

    switch (event.header.namespace) {
        /**
         * The namespace of "Discovery" indicates a request is being made to the lambda for
         * discovering all appliances associated with the customer's appliance cloud account.
         * can use the accessToken that is made available as part of the payload to determine
         * the customer.
         */
    case 'Alexa.ConnectedHome.Discovery':
        rest.getOpenhabVersion(event.payload.accessToken, function (version) {
            // DEBUG
            utils.log("Alexa.ConnectedHome.Discovery", "Result " + version);
            switch (version) {
            // OH1 version not working right now
            // case 1:
            //     oh1.handleDiscovery(event, context);
            //     break;
            case 2:
                oh2.handleDiscovery(event, context);
                break;
            default:
                context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Could not connect to system, unknown version!'));
                break;
            }
        });
        break;

        /**
         * The namespace of "Control" indicates a request is being made to us to turn a
         * given device on, off or brighten. This message comes with the "appliance"
         * parameter which indicates the appliance that needs to be acted on.
         */
    case 'Alexa.ConnectedHome.Control':
        {
            switch (event.payload.appliance.additionalApplianceDetails.openhabVersion) {
            case '1':
                oh1.handleControl(event, context);
                break;
            case '2':
                oh2.handleControl(event, context);
                break;
            default:
                // DEBUG
                utils.log('Err', 'No supported version: ' + event.header.namespace);
                context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Missing or invalid OpenHAB version in the request!'));
                break;
            }
            break;
        }
        /**
         *  Requests the availability of the skill adapter. These are periodically sent by
         *  the Smart Home Skill API to the skill adapter.
         */

    case 'Alexa.ConnectedHome.System':
        // TODO - handle unhealthy device responses
        if (event.header.name === "HealthCheckRequest") {
            var headers = {
                messageId: event.header.messageId,
                name: event.header.name.replace("Request", "Response"),
                namespace: event.header.namespace,
                payloadVersion: event.header.payloadVersion
            };
            var payloads = {
                description: "The system is currently healthy",
                isHealthy: true
            };
            var result = {
                header: headers,
                payload: payloads
            };

            context.succeed(result);
        }
        break;

        /**
         * We received an unexpected message
         */
    default:
        // DEBUG
        utils.log('Err', 'No supported namespace: ' + event.header.namespace);
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Something went wrong...'));
        break;
    }
};
