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

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

/**
 * Defines ask-cli config schema path
 * @type {String}
 */
const ASK_CLI_CONFIG_SCHEMA_PATH = path.join(os.homedir(), '.ask', 'cli_config');

/**
 * Defines ask-cli resources schema path
 * @type {String}
 */
const ASK_CLI_RESOURCES_SCHEMA_PATH = path.join('..', 'ask-resources.json');

/**
 * Skill manifest schema path
 * @type {String}
 */
const SKILL_MANIFEST_SCHEMA_PATH = path.join('..', 'skill-package', 'skill.json');

/**
 * Defines supported deployment regions
 *  https://developer.amazon.com/docs/smapi/skill-manifest.html#regions
 * @type {Array}
 */
const SUPPORTED_DEPLOY_REGIONS = ['NA', 'EU', 'FE'];

/**
 * Defines default deployment lambda function name
 * @type {String}
 */
const DEFAULT_FUNCTION_NAME = 'alexa-openhab';

/**
 * Defines default deployment esting demo account username
 * @type {String}
 */
const DEFAULT_TESTING_USERNAME = 'demo@openhab.org';

/**
 * Returns ask-cli config profiles
 * @return {Array}
 */
function getAskCliConfigProfiles() {
  try {
    const data = fs.readFileSync(ASK_CLI_CONFIG_SCHEMA_PATH);
    const config = JSON.parse(data);
    return Object.keys(config.profiles);
  } catch {
    throw new Error(`Failed to load ask-cli config: ${ASK_CLI_CONFIG_SCHEMA_PATH}`);
  }
}

/**
 * Returns user input response
 * @param  {String} prompt
 * @return {Promise}
 */
function getUserInput(prompt) {
  const rl = readline.createInterface(process.stdin, process.stdout);

  rl.setPrompt(prompt);
  rl.prompt();

  return new Promise((resolve, reject) => {
    let response;
    rl.on('line', (input) => {
      response = input;
      rl.close();
    });

    rl.on('close', () => {
      resolve(response);
    });
  });
}

/**
 * Load a schema
 * @param  {String} path
 * @return {Object}
 */
function loadSchema(path) {
  try {
    return require(path);
  } catch {
    throw new Error(`Failed to load schema: ${path}`);
  }
}

/**
 * Save a schema
 * @param  {Object} schema
 * @param  {String} path
 */
function saveSchema(schema, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(schema, null, 2));
  } catch {
    throw new Error(`Failed to save schema: ${path}`);
  }
}

/**
 * Returns user input configuration
 * @return {Promise}
 */
async function getUserConfig() {
  // Get ask-cli config profile names
  const profileNames = getAskCliConfigProfiles();
  // Throw error if no profile configured
  if (profileNames.length === 0) throw new Error('No AWS CLI profile configured.');

  // Define profile prompt based on config profiles
  const profilePrompt =
    'List of ASK CLI profiles:\n' +
    profileNames.map((name, index) => ` ${index}) ${name}`).join('\n') +
    '\nWhich production profile to use? [0] ';
  // Ask user to input production profile index
  const index = await getUserInput(profilePrompt);
  // Determine profile name, defaulting to first one
  const profileName = profileNames[index || 0];
  // Throw error if selected profile not defined
  if (typeof profileName === 'undefined') throw new Error('Invalid AWS CLI profile selected.');

  // Define function name prompt
  const functionNamePrompt = `What Lambda function name to use? [${DEFAULT_FUNCTION_NAME}] `;
  // Ask user to input function name
  const functionName = await getUserInput(functionNamePrompt);

  // Define testing username prompt
  const testingUsernamePrompt = `What openHAB demo account username to use? [${DEFAULT_TESTING_USERNAME}] `;
  // Ask user to input testing username
  const testingUsername = await getUserInput(testingUsernamePrompt);
  // Define testing password prompt
  const testingPasswordPrompt = 'What openHAB demo account password to use? ';
  // Ask user to input testing password
  const testingPassword = await getUserInput(testingPasswordPrompt);

  // Return user config
  return {
    profileName,
    functionName: functionName || DEFAULT_FUNCTION_NAME,
    testing: {
      username: testingUsername || DEFAULT_TESTING_USERNAME,
      password: testingPassword || ''
    }
  };
}

/**
 * Update ask-cli resources schema
 * @param  {String} profileName
 * @param  {String} functionName
 */
async function updateAskCliResourcesSchema({ profileName, functionName }) {
  // Load ask-cli resources schema
  const schema = loadSchema(ASK_CLI_RESOURCES_SCHEMA_PATH);
  // Deep clone default profile as production profile
  const profile = JSON.parse(JSON.stringify(schema.profiles.default));
  // Set regional endpoints for production deployment
  SUPPORTED_DEPLOY_REGIONS.forEach((region) => profile.code[region] = profile.code.default);
  // Set lambda function name
  profile.skillInfrastructure.userConfig.cfn.parameters.LambdaFunctionName = functionName;
  // Set lambda log level to error
  profile.skillInfrastructure.userConfig.cfn.parameters.LambdaLogLevel = 'error';
  // Add production profile to schema
  schema.profiles[profileName] = profile;
  // Save ask-cli resources schema
  saveSchema(schema, ASK_CLI_RESOURCES_SCHEMA_PATH);
}

/**
 * Update skill manifest schema
 * @param  {Object} testing
 */
function updateSkillManifestSchema({ testing }) {
  // Load skill manifest schema
  const schema = loadSchema(SKILL_MANIFEST_SCHEMA_PATH);
  // Extract publishing information from manifest
  const { publishingInformation } = schema.manifest;
  // Set publishing distribution mode as public for production deployment
  publishingInformation.distributionMode = 'PUBLIC';
  // Set publishing testing instructions username and passowrd
  publishingInformation.testingInstructions = publishingInformation.testingInstructions
    .replace('%TESTING_USER%', testing.username)
    .replace('%TESTING_PASS%', testing.password);
  // Save skill manifest schema
  saveSchema(schema, SKILL_MANIFEST_SCHEMA_PATH);
}

/**
 * Main async function
 */
async function main() {
  try {
    // Change working directory to script location
    process.chdir(__dirname);
    // Get user input configuration
    const config = await getUserConfig();
    // Reset schema configuration
    execSync(`git checkout -- ${ASK_CLI_RESOURCES_SCHEMA_PATH} ${SKILL_MANIFEST_SCHEMA_PATH}`);
    // Update ask-cli resources schema
    updateAskCliResourcesSchema(config);
    // Update skill manifest schema
    updateSkillManifestSchema(config);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
