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

import js from '@eslint/js';
import pluginMocha from 'eslint-plugin-mocha';
import pluginNode from 'eslint-plugin-n';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  pluginMocha.configs.recommended,
  pluginNode.configs['flat/recommended-script'],
  pluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn'
    }
  }
];
