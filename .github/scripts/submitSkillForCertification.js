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

const assert = require('assert');
const { getCommandOuput, loadSchema } = require('./utils');
const { SKILL_MANIFEST_FILE } = require('./constants');

/**
 * Submits skill for certification
 *  https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#submit-skill-for-certification-subcommand
 */
function submitSkillForCertification() {
  const method = 'AUTO_PUBLISHING';
  const message = `Release ${process.env.RELEASE_VERSION}`;
  const command =
    'ask smapi submit-skill-for-certification ' +
    `-s ${process.env.SKILL_ID} --publication-method ${method} --version-message "${message}"`;
  const output = getCommandOuput(command);

  // Log command output
  console.log(output);
}

/**
 * Validates skill
 *  https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#submit-skill-validation-subcommand
 *  https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#get-skill-validations-subcommand
 */
function validateSkill() {
  // Retrieve skill locales from manifest
  const { manifest } = loadSchema(SKILL_MANIFEST_FILE);
  const locales = Object.keys(manifest.publishingInformation.locales).join(',');

  // Request skill validation
  const submitCommand = `ask smapi submit-skill-validation -s ${process.env.SKILL_ID} -l ${locales} -g development`;
  const { id } = getCommandOuput(submitCommand, { json: true });

  // Get skill validations result
  const getCommand = `ask smapi get-skill-validations -s ${process.env.SKILL_ID} -i ${id} -g development`;
  const { result, status } = getCommandOuput(getCommand, { json: true });

  // Log result if provided
  if (result) console.log('Result:', JSON.stringify(result, null, 2));
  // Assert if status is successful
  assert.equal(status, 'SUCCESSFUL', `Skill validation ${status.replace(/_/g, ' ').toLowerCase()}`);
}

if (require.main === module) {
  try {
    // Validate skill
    validateSkill();
    // Submit skill for certification
    submitSkillForCertification();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
