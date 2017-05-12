/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var log = require('./log.js');
var utils = require('./utils.js');
var oh2 = require('./oh2.js');

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
exports.handler = function (event, context) {
  log.debug('Input: ' + JSON.stringify(event));

    switch (event.header.namespace) {
        /**
         * The namespace of 'Discovery' indicates a request is being made to the lambda for
         * discovering all appliances associated with the customer's appliance cloud account.
         * can use the accessToken that is made available as part of the payload to determine
         * the customer.
         */
    case 'Alexa.ConnectedHome.Discovery':
        oh2.handleDiscovery(event, context);
        break;

        /**
         * The namespace of 'Control' indicates a request is being made to us to turn a
         * given device on, off or brighten. This message comes with the 'appliance'
         * parameter which indicates the appliance that needs to be acted on.
         */
    case 'Alexa.ConnectedHome.Control':
    case 'Alexa.ConnectedHome.Query':
        oh2.handleControl(event, context);
        break;

        /**
         *  Requests the availability of the skill adapter. These are periodically sent by
         *  the Smart Home Skill API to the skill adapter.
         */
    case 'Alexa.ConnectedHome.System':
        // TODO - handle unhealthy device responses
        if (event.header.name === 'HealthCheckRequest') {
            var headers = {
                messageId: event.header.messageId,
                name: event.header.name.replace('Request', 'Response'),
                namespace: event.header.namespace,
                payloadVersion: event.header.payloadVersion
            };
            var payloads = {
                description: 'The system is currently healthy',
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
        log.error('No supported namespace: ' + event.header.namespace);
        context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Something went wrong...'));
        break;
    }
};
