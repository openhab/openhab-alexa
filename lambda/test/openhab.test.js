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
import nock from 'nock';
import fs from 'node:fs';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import config from '#root/config.js';
import OpenHAB from '#openhab/index.js';

describe('OpenHAB Tests', function () {
  // set default environment
  const baseURL = 'https://foobar';
  const requestId = 'request-id';
  const token = 'token';
  const timeout = 42;

  let openhab, scope;

  beforeEach(function () {
    // set stub environment
    sinon.stub(config.openhab, 'baseURL').value(baseURL);
    // create new openhab instance
    openhab = new OpenHAB(requestId, token, timeout);
    // define nock scope
    scope = nock(baseURL)
      .matchHeader('Cache-Control', 'no-cache')
      .matchHeader('User-Agent', /^openhab-alexa\/\d\.\d\.\d$/)
      .matchHeader('X-Amzn-RequestId', requestId);
  });

  afterEach(function () {
    // restore stub environment
    sinon.restore();
    // clean up nock environment
    nock.cleanAll();
  });

  describe('authentication request', function () {
    it('https oauth2 token', async function () {
      // set environment
      sinon.stub(fs, 'existsSync').returns(false);
      scope.get('/').matchHeader('Authorization', `Bearer ${token}`).reply(200);
      // run test
      await OpenHAB.createClient({ baseURL }, requestId, token, timeout).get('/');
      expect(scope.isDone()).to.be.true;
    });

    it('https basic auth', async function () {
      // set environment
      const user = 'username';
      const pass = 'password';
      sinon.stub(fs, 'existsSync').returns(false);
      scope.get('/').basicAuth({ user, pass }).reply(200);
      // run test
      await OpenHAB.createClient({ baseURL, user, pass }, requestId, token, timeout).get('/');
      expect(scope.isDone()).to.be.true;
    });

    it('https client cert', async function () {
      // set environment
      const certFile = 'cert.pfx';
      const certData = 'data';
      const certPass = 'passphrase';
      sinon.stub(fs, 'existsSync').withArgs(certFile).returns(true);
      sinon.stub(fs, 'readFileSync').withArgs(certFile).returns(certData);
      scope
        .get('/')
        .reply(200)
        .on('request', ({ headers, options, socket }) => {
          expect(headers).to.not.have.property('authorization');
          expect(options).to.nested.include({ 'agent.options.pfx': certData, 'agent.options.passphrase': certPass });
          expect(socket).to.include({ timeout });
        });
      // run test
      await OpenHAB.createClient({ baseURL, certFile, certPass }, requestId, token, timeout).get('/');
      expect(scope.isDone()).to.be.true;
    });

    it('https no auth', async function () {
      // set environment
      sinon.stub(fs, 'existsSync').returns(false);
      scope
        .get('/')
        .reply(200)
        .on('request', ({ headers }) => {
          expect(headers).to.not.have.property('authorization');
        });
      // run test
      await OpenHAB.createClient({ baseURL }, requestId).get('/');
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('get item state', function () {
    it('defined state', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, { name: 'foo', state: '42', type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(scope.isDone()).to.be.true;
    });

    it('defined state with state description but no pattern', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, { name: 'foo', state: '42', stateDescription: {}, type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(scope.isDone()).to.be.true;
    });

    it('undefined state', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, { name: 'foo', state: 'NULL', type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('dimmer state with pattern', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, {
        name: 'foo',
        state: '42.4242',
        stateDescription: { pattern: '%d' },
        type: 'Dimmer'
      });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(scope.isDone()).to.be.true;
    });

    it('number dimensionless group state with pattern', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, {
        name: 'foo',
        state: '42.4242 %',
        stateDescription: { pattern: '%.2f %' },
        type: 'Group',
        groupType: 'Number:Dimensionless'
      });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42.42');
      expect(scope.isDone()).to.be.true;
    });

    it('rollershutter state with pattern', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, {
        name: 'foo',
        state: '42.4242',
        stateDescription: { pattern: '%f' },
        type: 'Rollershutter'
      });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42.4242');
      expect(scope.isDone()).to.be.true;
    });

    it('string state with no state description', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(200, { name: 'foo', state: 'bar', type: 'String' });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('bar');
      expect(scope.isDone()).to.be.true;
    });

    it('item not found error', async function () {
      // set environment
      scope.get('/rest/items/foo').reply(404);
      // run test
      try {
        await openhab.getItemState('foo');
      } catch (error) {
        expect(error).to.be.instanceof(AxiosError).and.nested.include({ 'response.status': 404 });
      }
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('get all items', function () {
    // set default environment
    const qs = {
      fields: 'editable,groupNames,groupType,name,label,metadata,stateDescription,tags,type,unitSymbol',
      metadata: 'alexa,autoupdate,channel,synonyms'
    };

    it('successful', async function () {
      // set environment
      const items = [
        { name: 'foo', type: 'Dimmer' },
        { name: 'bar', type: 'Switch' }
      ];
      scope.get('/rest/items').query(qs).reply(200, items);
      // run test
      expect(await openhab.getAllItems()).to.deep.equal(items);
      expect(scope.isDone()).to.be.true;
    });

    it('type error', async function () {
      // set environment
      scope.get('/rest/items').query(qs).thrice().reply(200, 'invalid');
      // run test
      try {
        await openhab.getAllItems();
      } catch (error) {
        expect(error)
          .to.be.instanceof(TypeError)
          .and.include({ message: 'Failed to retrieve all items formatted array' });
      }
      expect(scope.isDone()).to.be.true;
    });

    it('unauthorized error', async function () {
      // set environment
      scope.get('/rest/items').query(qs).reply(401);
      // run test
      try {
        await openhab.getAllItems();
      } catch (error) {
        expect(error).to.be.instanceof(AxiosError).and.nested.include({ 'response.status': 401 });
      }
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('get server settings', function () {
    // set default environment
    const language = 'en';
    const measurementSystem = 'US';
    const region = 'US';
    const locale = `${language}_${region}`;

    let uuid;

    beforeEach(function () {
      uuid = uuidv4();
    });

    it('oh2.4', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200, { version: '2' })
        // service i18n config
        .get('/rest/services/org.eclipse.smarthome.core.i18nprovider/config')
        .reply(200, { language, measurementSystem, region })
        // uuid
        .get('/rest/uuid')
        .reply(200, uuid);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({
        regional: { language, measurementSystem, region },
        runtime: { uuid, version: '2' }
      });
      expect(scope.isDone()).to.be.true;
    });

    it('oh2.5', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200, { version: '3' })
        // service i18n config
        .get('/rest/services/org.eclipse.smarthome.i18n/config')
        .reply(200, { language, measurementSystem, region })
        // uuid
        .get('/rest/uuid')
        .reply(200, uuid);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({
        regional: { language, measurementSystem, region },
        runtime: { uuid, version: '2' }
      });
      expect(scope.isDone()).to.be.true;
    });

    it('oh3.x', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200, { version: '4', locale, measurementSystem, runtimeInfo: { version: '3.0.0' } })
        // uuid
        .get('/rest/uuid')
        .reply(200, uuid);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({
        regional: { language, measurementSystem, region },
        runtime: { uuid, version: '3.0.0' }
      });
      expect(scope.isDone()).to.be.true;
    });

    it('oh3.x with invalid uuid', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200, { version: '4', locale, measurementSystem, runtimeInfo: { version: '3.0.0' } })
        // uuid
        .get('/rest/uuid')
        .reply(200, 'invalid');
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({
        regional: { language, measurementSystem, region },
        runtime: { version: '3.0.0' }
      });
      expect(scope.isDone()).to.be.true;
    });

    it('oh3.x with unauthorized uuid', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200, { version: '4', locale, measurementSystem, runtimeInfo: { version: '3.0.0' } })
        // uuid
        .get('/rest/uuid')
        .reply(401);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({
        regional: { language, measurementSystem, region },
        runtime: { version: '3.0.0' }
      });
      expect(scope.isDone()).to.be.true;
    });

    it('undefined root resource', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .reply(200)
        // uuid
        .get('/rest/uuid')
        .reply(200, uuid);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({ regional: {}, runtime: { uuid } });
      expect(scope.isDone()).to.be.true;
    });

    it('request error', async function () {
      // set environment
      scope
        // root resource
        .get('/rest/')
        .replyWithError('error');
      // run test
      try {
        await openhab.getServerSettings();
      } catch (error) {
        expect(error).to.be.instanceof(AxiosError).and.include({ message: 'error' });
      }
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('send item command', function () {
    it('successful', async function () {
      // set environment
      scope.post('/rest/items/foo', '42').reply(200);
      // run test
      await openhab.sendCommand('foo', 42);
      expect(scope.isDone()).to.be.true;
    });

    it('item not found error', async function () {
      // set environment
      scope.post('/rest/items/foo', '42').reply(404);
      // run test
      try {
        await openhab.sendCommand('foo', 42);
      } catch (error) {
        expect(error).to.be.instanceof(AxiosError).and.nested.include({ 'response.status': 404 });
      }
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('update item state', function () {
    it('successful', async function () {
      // set environment
      scope.put('/rest/items/foo/state', '42').reply(202);
      // run test
      await openhab.postUpdate('foo', 42);
      expect(scope.isDone()).to.be.true;
    });

    it('item state null error', async function () {
      // set environment
      scope.put('/rest/items/foo/state', 'invalid').reply(400);
      // run test
      try {
        await openhab.postUpdate('foo', 'invalid');
      } catch (error) {
        expect(error).to.be.instanceof(AxiosError).and.nested.include({ 'response.status': 400 });
      }
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('get state presentation precision', function () {
    it('integer', async function () {
      expect(OpenHAB.getStatePresentationPrecision('%d %%')).to.equal(0);
    });

    it('float', async function () {
      expect(OpenHAB.getStatePresentationPrecision('%.1f °F')).to.equal(1);
    });

    it('no precision', async function () {
      expect(OpenHAB.getStatePresentationPrecision('foo')).to.be.NaN;
    });

    it('undefined', async function () {
      expect(OpenHAB.getStatePresentationPrecision(undefined)).to.be.NaN;
    });
  });

  describe('get state presentation unit symbol', function () {
    it('percent', async function () {
      expect(OpenHAB.getStatePresentationUnitSymbol('%d %%')).to.equal('%');
    });

    it('temperature', async function () {
      expect(OpenHAB.getStatePresentationUnitSymbol('%.1f °F')).to.equal('°F');
    });

    it('no symbol', async function () {
      expect(OpenHAB.getStatePresentationUnitSymbol('%.1f')).to.be.undefined;
    });

    it('undefined', async function () {
      expect(OpenHAB.getStatePresentationUnitSymbol(undefined)).to.be.undefined;
    });
  });
});
