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
const { expect } = require('chai');
const sinon = require('sinon');
const log = require('@root/log');
const skill = require('@root');
const AlexaSmarthome = require('@alexa/smarthome');

describe('Skill Event Tests', () => {
  let smarthome;

  beforeEach(() => {
    // set stub environment
    smarthome = sinon.stub(AlexaSmarthome, 'handleRequest');
  });

  afterEach(() => {
    // restore stub environment
    sinon.restore();
  });

  describe('smarthome', () => {
    it('payload version 3', async () => {
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
      await skill.handler(event);
      expect(smarthome.called).to.be.true;
      expect(smarthome.firstCall.args).to.deep.equal([event]);
    });

    it('payload version 2', async () => {
      // set environment
      const event = {
        header: {
          namespace: 'DiscoverAppliancesRequest',
          name: 'Alexa.ConnectedHome.Discovery',
          payloadVersion: '2'
        }
      };
      const logWarn = sinon.stub(log, 'warn');
      // run test
      await skill.handler(event);
      expect(smarthome.called).to.be.false;
      expect(logWarn.called).to.be.true;
      expect(logWarn.firstCall.args).to.deep.equal(['Unsupported event:', event]);
    });
  });
});
