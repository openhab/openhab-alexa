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
const { clamp, decamelize, parseUrl } = require('@root/utils');

describe('Utilities Tests', () => {
  describe('clamp', () => {
    it('within range', () => {
      expect(clamp(42, 0, 100)).to.equal(42);
    });

    it('below range', () => {
      expect(clamp(-42, 0, 100)).to.equal(0);
    });

    it('above range', () => {
      expect(clamp(142, 0, 100)).to.equal(100);
    });
  });

  describe('decamelize', () => {
    it('default separator', () => {
      expect(decamelize('fooBar')).to.equal('foo_bar');
    });

    it('space separator', () => {
      expect(decamelize('FooBar', ' ')).to.equal('foo bar');
    });
  });

  describe('parse url', () => {
    it('url only', () => {
      expect(parseUrl('https://foo/bar'))
        .to.be.instanceof(URL)
        .and.to.have.property('href')
        .that.equals('https://foo/bar');
    });

    it('url with base', () => {
      expect(parseUrl('https://foo/bar', 'https://bar'))
        .to.be.instanceof(URL)
        .and.to.have.property('href')
        .that.equals('https://bar/bar');
    });

    it('url invalid', () => {
      expect(parseUrl('invalid')).to.be.undefined;
    });
  });
});
