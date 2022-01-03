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
const { clamp, decamelize, isMACAddress, parseUrl, stripPunctuation } = require('@root/utils');

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

  describe('is mac address', () => {
    it('eui-48 format with colon separator', () => {
      expect(isMACAddress('00:21:86:B5:6E:10')).to.be.true;
    });

    it('eui-64 format with dash separator', () => {
      expect(isMACAddress('00-21-86-FF-FE-B5-6E-10')).to.be.true;
    });

    it('invalid format', () => {
      expect(isMACAddress('invalid')).to.be.false;
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

  describe('strip punctuation', () => {
    it('no change', () => {
      expect(stripPunctuation('foo bar')).to.equal('foo bar');
    });

    it('with punctuation no extra space', () => {
      expect(stripPunctuation('foo_bar')).to.equal('foo bar');
    });

    it('with punctuation and extra space', () => {
      expect(stripPunctuation('[ foo | bar ]')).to.equal('foo bar');
    });
  });
});
