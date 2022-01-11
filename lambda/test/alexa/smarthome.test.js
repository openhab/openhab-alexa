/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

require('module-alias/register');
const { expect, use } = require('chai');
const sinon = require('sinon');
const { decamelize } = require('@root/utils');
const log = require('@root/log');
const OpenHAB = require('@openhab');
const AlexaSmarthome = require('@alexa/smarthome');
const AlexaAssetCatalog = require('@alexa/smarthome/catalog');
const AlexaHandlers = require('@alexa/smarthome/handlers');
const testCases = require('./cases');

// Set chai environment
use(require('chai-subset'));
use(require('./chai'));

describe('Alexa Smart Home Tests', () => {
  let commands, updates;

  beforeEach(() => {
    // set stub environment
    commands = sinon.stub(OpenHAB.prototype, 'sendCommand');
    updates = sinon.stub(OpenHAB.prototype, 'postUpdate');
  });

  afterEach(() => {
    // restore stub environment
    sinon.restore();
  });

  for (const [name, tests] of Object.entries(testCases)) {
    describe(`${decamelize(name, ' ')} request`, () => {
      for (const test of tests.flat()) {
        if (name === 'Discovery') {
          // Discovery Test
          const { description, catalog = {}, items = [], expected = {} } = test;
          const directive = getDirective({ header: { namespace: 'Alexa.Discovery', name: 'Discover' } });
          const settings = { regional: {}, runtime: {}, ...test.settings };

          it(description, async () => {
            // set stub environment
            sinon.stub(AlexaAssetCatalog, 'labelValues').value(catalog);
            sinon.stub(OpenHAB.prototype, 'getAllItems').resolves(items);
            sinon.stub(OpenHAB.prototype, 'getServerSettings').resolves(settings);
            // run test
            const response = await AlexaSmarthome.handleRequest({ directive });
            expect(commands.called).to.be.false;
            expect(updates.called).to.be.false;
            expect(response)
              .to.be.a.validSchema.that.nested.includes({
                'event.header.namespace': 'Alexa.Discovery',
                'event.header.name': 'Discover.Response'
              })
              .and.has.nested.property('event.payload.endpoints')
              .that.has.endpoints(expected);
          });
        } else {
          // Controller Test
          const { description, error, items = [] } = test;
          const directive = getDirective(test.directive);
          const expected = {
            alexa: { ...test.expected.alexa },
            openhab: { commands: [], updates: [], ...test.expected.openhab }
          };

          it(description, async () => {
            // set stub environment
            sinon.stub(OpenHAB.prototype, 'getItem').callsFake(() => items.shift());
            if (error instanceof Error) {
              const { namespace, name } = directive.header;
              const handler = Object.values(AlexaHandlers).find((handler) => handler.namespace === namespace);
              const method = handler.directives[name];
              sinon.stub(handler, method.name).rejects(error);
              sinon.stub(log, 'error');
            }
            // run test
            const response = await AlexaSmarthome.handleRequest({ directive });
            expect(commands.callCount).to.equal(expected.openhab.commands.length);
            expect(commands.args.map(([name, value]) => ({ name, value }))).to.deep.equal(expected.openhab.commands);
            expect(updates.callCount).to.equal(expected.openhab.updates.length);
            expect(updates.args.map(([name, value]) => ({ name, value }))).to.deep.equal(expected.openhab.updates);
            expect(response).to.be.a.validSchema.that.containSubset(expected.alexa);
          });
        }
      }
    });
  }
});

/**
 * Returns formatted directive object
 * @param  {Object} header
 * @param  {Object} endpoint
 * @param  {Object} payload
 * @return {Object}
 */
function getDirective({ header, endpoint, payload = {} }) {
  return {
    header: {
      namespace: header.namespace,
      ...(header.instance && { instance: header.instance }),
      name: header.name,
      payloadVersion: header.payloadVersion || '3',
      messageId: 'message-id',
      // add header correlation token for requests other than discovery
      ...(header.namespace !== 'Alexa.Discovery' && { correlationToken: 'correlation-token' })
    },
    // add endpoint only if provided
    ...(endpoint && {
      endpoint: {
        endpointId: endpoint.endpointId,
        cookie: endpoint.cookie,
        scope: { type: 'BearerToken', token: 'access-token-from-skill' }
      }
    }),
    payload: {
      ...payload,
      // add scope to payload if no endpoint or payload grantee provided
      ...(!endpoint && !payload.grantee && { scope: { type: 'BearerToken', token: 'access-token-from-skill' } })
    }
  };
}
