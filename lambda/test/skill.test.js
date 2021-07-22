/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const { expect } = require('chai');
const sinon = require('sinon');
const log = require('@root/log');
const skill = require('@root');
const AlexaSmarthome = require('@alexa/smarthome');

describe('Skill Event Tests', () => {
  let smarthome, context, callback;

  beforeEach(() => {
    // set stub environment
    smarthome = sinon.stub(AlexaSmarthome, 'handleRequest');
    context = sinon.stub();
    callback = sinon.stub();
  });

  afterEach(() => {
    // restore stub environment
    sinon.restore();
  });

  describe('smarthome', () => {
    it('payload version 3', () => {
      // set environment
      const event = {
        directive: {
          header: {
            namespace: 'Alexa.Discovery',
            name: 'Discover',
            payloadVersion: '3'
          }
        }
      };
      // run test
      skill.handler(event, context, callback);
      expect(smarthome.called).to.be.true;
      expect(smarthome.firstCall.args).to.deep.equal([event, callback]);
      expect(context.called).to.be.false;
      expect(callback.called).to.be.false;
    });

    it('payload version 2', () => {
      // set environment
      const event = {
        header: {
          namespace: 'DiscoverAppliancesRequest',
          name: 'Alexa.ConnectedHome.Discovery',
          payloadVersion: '2'
        }
      };
      sinon.stub(log, 'error');
      // run test
      skill.handler(event, context, callback);
      expect(smarthome.called).to.be.false;
      expect(context.called).to.be.false;
      expect(callback.called).to.be.true;
      expect(callback.firstCall.args[0]).to.equal('Unsupported event');
    });
  });
});
