/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { expect } from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';
import log from '#root/log.js';

describe('Skill Event Tests', function () {
  // set default environment
  const context = { awsRequestId: 'request-id' };

  let smarthomeStub, skill;

  beforeEach(async function () {
    // set stub environment
    smarthomeStub = sinon.stub();
    skill = await esmock('#root/index.js', {
      '#alexa/smarthome/index.js': {
        handleRequest: smarthomeStub
      }
    });
  });

  afterEach(function () {
    // restore stub environment
    sinon.restore();
  });

  describe('smarthome', function () {
    it('payload version 3', async function () {
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
      await skill.handler(event, context);
      expect(smarthomeStub.called).to.be.true;
      expect(smarthomeStub.firstCall.args).to.deep.equal([event, context]);
    });

    it('payload version 2', async function () {
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
      await skill.handler(event, context);
      expect(smarthomeStub.called).to.be.false;
      expect(logWarn.called).to.be.true;
      expect(logWarn.firstCall.args).to.deep.equal(['Unsupported event:', event]);
    });
  });
});
