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

const assert = require('assert');
const { getCommandOuput, loadSchema, sleep } = require('./utils');
const { SKILL_MANIFEST_FILE } = require('./constants');

/**
 * Returns skill validations for a given id
 * @param  {String} id
 * @return {Object}
 */
async function getSkillValidations(id) {
  const command = `ask smapi get-skill-validations -s ${process.env.SKILL_ID} -i ${id} -g development`;
  let validations;

  // Retrieve skill validations up to 10 times every 30 seconds while status is in progress
  for (let tries = 0; (!validations || validations.status === 'IN_PROGRESS') && tries < 10; tries++) {
    // Wait for 30 seconds
    await sleep(30000);
    // Get validations command output
    validations = getCommandOuput(command, { json: true });
  }

  return validations;
}

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
  if (output === 'Command executed successfully!') {
    console.log('The skill has been submitted for certification successfully!');
  } else {
    console.log(output);
  }
}

/**
 * Validates skill
 *  https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#submit-skill-validation-subcommand
 *  https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#get-skill-validations-subcommand
 */
async function validateSkill() {
  // Retrieve skill locales from manifest
  const { manifest } = loadSchema(SKILL_MANIFEST_FILE);
  const locales = Object.keys(manifest.publishingInformation.locales).join(',');

  // Request skill validation
  const command = `ask smapi submit-skill-validation -s ${process.env.SKILL_ID} -l ${locales} -g development`;
  const { id } = getCommandOuput(command, { json: true });

  // Get skill validations
  const { result, status } = await getSkillValidations(id);

  // Log result if provided
  if (result) console.log('Result:', JSON.stringify(result, null, 2));
  // Assert if status is successful
  assert.equal(status, 'SUCCESSFUL', `Skill validation ${status.replace(/_/g, ' ').toLowerCase()}`);
}

/**
 * Main async function
 */
async function main() {
  try {
    // Validate skill
    await validateSkill();
    // Submit skill for certification
    submitSkillForCertification();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
