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
const nock = require('nock');
const fs = require('fs');
const Agent = require('agentkeepalive');
const { v4: uuidv4 } = require('uuid');
const OpenHAB = require('@openhab');

describe('OpenHAB Tests', () => {
  // set default environment
  const baseURL = 'https://foobar';
  const token = 'token';
  const timeout = 42;

  let openhab;

  beforeEach(() => {
    // create new openhab instance
    openhab = new OpenHAB({ baseURL }, token, timeout);
  });

  afterEach(() => {
    // restore stub environment
    sinon.restore();
    // clean up nock environment
    nock.cleanAll();
  });

  describe('authentication request', () => {
    it('https oauth2 token', async () => {
      // set environment
      sinon.stub(fs, 'existsSync').returns(false);
      nock(baseURL).get('/').matchHeader('Authorization', `Bearer ${token}`).reply(200);
      // run test
      await OpenHAB.getRequestDefaults({ baseURL }, token, timeout).get('/');
      expect(nock.isDone()).to.be.true;
    });

    it('https basic auth', async () => {
      // set environment
      const user = 'username';
      const pass = 'password';
      sinon.stub(fs, 'existsSync').returns(false);
      nock(baseURL).get('/').basicAuth({ user, pass }).reply(200);
      // run test
      await OpenHAB.getRequestDefaults({ baseURL, user, pass }, token, timeout).get('/');
      expect(nock.isDone()).to.be.true;
    });

    it('https client cert', async () => {
      // set environment
      const certFile = 'cert.pfx';
      const certPass = 'passphrase';
      sinon.stub(fs, 'existsSync').withArgs(certFile).returns(true);
      sinon.stub(fs, 'readFileSync').withArgs(certFile).returns('pfx');
      nock(baseURL)
        .get('/')
        .reply(200)
        .on('request', ({ headers, options, socket }) => {
          expect(headers).to.not.have.property('authorization');
          expect(options).to.nested.include({
            agentClass: Agent.HttpsAgent,
            'agentOptions.pfx': 'pfx',
            'agentOptions.passphrase': 'passphrase'
          });
          expect(socket).to.include({ timeout });
        });
      // run test
      await OpenHAB.getRequestDefaults({ baseURL, certFile, certPass }, token, timeout).get('/');
      expect(nock.isDone()).to.be.true;
    });

    it('http no auth', async () => {
      // set environment
      const baseURL = 'http://foobar';
      sinon.stub(fs, 'existsSync').returns(false);
      nock(baseURL)
        .get('/')
        .reply(200)
        .on('request', ({ headers, options }) => {
          expect(headers).to.not.have.property('authorization');
          expect(options).to.include({ agentClass: Agent });
        });
      // run test
      await OpenHAB.getRequestDefaults({ baseURL }).get('/');
      expect(nock.isDone()).to.be.true;
    });
  });

  describe('get item state', () => {
    it('defined state', async () => {
      // set environment
      nock(baseURL).get('/rest/items/foo').reply(200, { name: 'foo', state: '42', type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(nock.isDone()).to.be.true;
    });

    it('defined state with state description but no pattern', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items/foo')
        .reply(200, { name: 'foo', state: '42', stateDescription: {}, type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(nock.isDone()).to.be.true;
    });

    it('undefined state', async () => {
      // set environment
      nock(baseURL).get('/rest/items/foo').reply(200, { name: 'foo', state: 'NULL', type: 'Dimmer' });
      // run test
      expect(await openhab.getItemState('foo')).to.be.undefined;
      expect(nock.isDone()).to.be.true;
    });

    it('dimmer state with pattern', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items/foo')
        .reply(200, {
          name: 'foo',
          state: '42.4242',
          stateDescription: { pattern: '%d' },
          type: 'Dimmer'
        });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42');
      expect(nock.isDone()).to.be.true;
    });

    it('number dimensionless group state with pattern', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items/foo')
        .reply(200, {
          name: 'foo',
          state: '42.4242 %',
          stateDescription: { pattern: '%.2f %' },
          type: 'Group',
          groupType: 'Number:Dimensionless'
        });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42.42');
      expect(nock.isDone()).to.be.true;
    });

    it('rollershutter state with pattern', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items/foo')
        .reply(200, {
          name: 'foo',
          state: '42.4242',
          stateDescription: { pattern: '%f' },
          type: 'Rollershutter'
        });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('42.4242');
      expect(nock.isDone()).to.be.true;
    });

    it('string state with pattern', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items/foo')
        .reply(200, {
          name: 'foo',
          state: 'bar',
          stateDescription: { pattern: '%s' },
          type: 'String'
        });
      // run test
      expect(await openhab.getItemState('foo')).to.equal('bar');
      expect(nock.isDone()).to.be.true;
    });

    it('item not found error', async () => {
      // set environment
      nock(baseURL).get('/rest/items/foo').reply(404);
      // run test
      try {
        await openhab.getItemState('foo');
      } catch (error) {
        expect(error).to.include({ name: 'StatusCodeError', statusCode: 404 });
      }
      expect(nock.isDone()).to.be.true;
    });
  });

  describe('get all items', () => {
    // set default environment
    const qs = {
      fields: 'editable,groupNames,groupType,name,label,metadata,stateDescription,tags,type',
      metadata: 'alexa,autoupdate,channel,synonyms'
    };

    it('successful', async () => {
      // set environment
      const items = [
        { name: 'foo', type: 'Dimmer' },
        { name: 'bar', type: 'Switch' }
      ];
      nock(baseURL).get('/rest/items').query(qs).reply(200, items);
      // run test
      expect(await openhab.getAllItems()).to.deep.equal(items);
      expect(nock.isDone()).to.be.true;
    });

    it('type error', async () => {
      // set environment
      nock(baseURL)
        .get('/rest/items')
        .query(qs)
        .reply(200, 'invalid 1')
        .get('/rest/items')
        .query(qs)
        .reply(200, 'invalid 2')
        .get('/rest/items')
        .query(qs)
        .reply(200, 'invalid 3');
      // run test
      try {
        await openhab.getAllItems();
      } catch (error) {
        expect(error).to.include({ name: 'TypeError', message: 'Failed to retrieve all items formatted array' });
      }
      expect(nock.isDone()).to.be.true;
    });

    it('unauthorized error', async () => {
      // set environment
      nock(baseURL).get('/rest/items').query(qs).reply(401);
      // run test
      try {
        await openhab.getAllItems();
      } catch (error) {
        expect(error).to.include({ name: 'StatusCodeError', statusCode: 401 });
      }
      expect(nock.isDone()).to.be.true;
    });
  });

  describe('get server settings', () => {
    // set default environment
    const language = 'en';
    const measurementSystem = 'US';
    const region = 'US';
    const locale = `${language}_${region}`;
    const uuid = uuidv4();

    it('oh2.4', async () => {
      // set environment
      nock(baseURL)
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
      expect(nock.isDone()).to.be.true;
    });

    it('oh2.5', async () => {
      // set environment
      nock(baseURL)
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
      expect(nock.isDone()).to.be.true;
    });

    it('oh3.x', async () => {
      // set environment
      nock(baseURL)
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
      expect(nock.isDone()).to.be.true;
    });

    it('oh3.x with invalid uuid', async () => {
      // set environment
      nock(baseURL)
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
      expect(nock.isDone()).to.be.true;
    });

    it('oh3.x with unauthorized uuid', async () => {
      // set environment
      nock(baseURL)
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
      expect(nock.isDone()).to.be.true;
    });

    it('undefined root resource', async () => {
      // set environment
      nock(baseURL)
        // root resource
        .get('/rest/')
        .reply(200)
        // uuid
        .get('/rest/uuid')
        .reply(200, uuid);
      // run test
      expect(await openhab.getServerSettings()).to.deep.equal({ regional: {}, runtime: { uuid } });
      expect(nock.isDone()).to.be.true;
    });

    it('request error', async () => {
      // set environment
      nock(baseURL)
        // root resource
        .get('/rest/')
        .replyWithError('error');
      // run test
      try {
        await openhab.getServerSettings();
      } catch (error) {
        expect(error).to.include({ name: 'RequestError' });
      }
      expect(nock.isDone()).to.be.true;
    });
  });

  describe('send item command', () => {
    it('successful', async () => {
      // set environment
      nock(baseURL).post('/rest/items/foo', '42').reply(200);
      // run test
      await openhab.sendCommand('foo', 42);
      expect(nock.isDone()).to.be.true;
    });

    it('item not found error', async () => {
      // set environment
      nock(baseURL).post('/rest/items/foo', '42').reply(404);
      // run test
      try {
        await openhab.sendCommand('foo', 42);
      } catch (error) {
        expect(error).to.include({ name: 'StatusCodeError', statusCode: 404 });
      }
      expect(nock.isDone()).to.be.true;
    });
  });

  describe('update item state', () => {
    it('successful', async () => {
      // set environment
      nock(baseURL).put('/rest/items/foo/state', '42').reply(202);
      // run test
      await openhab.postUpdate('foo', 42);
      expect(nock.isDone()).to.be.true;
    });

    it('item state null error', async () => {
      // set environment
      nock(baseURL).put('/rest/items/foo/state', 'invalid').reply(400);
      // run test
      try {
        await openhab.postUpdate('foo', 'invalid');
      } catch (error) {
        expect(error).to.include({ name: 'StatusCodeError', statusCode: 400 });
      }
      expect(nock.isDone()).to.be.true;
    });
  });
});
