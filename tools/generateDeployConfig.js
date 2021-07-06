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

const fs = require('fs');
const path = require('path');

/**
 * Defines ask-cli resources file
 * @type {String}
 */
const ASK_CLI_RESOURCES_FILE = path.join('..', 'ask-resources.json');

/**
 * Defines ask-cli states file
 * @type {String}
 */
const ASK_CLI_STATES_FILE = path.join('..', '.ask', 'ask-states.json');

/**
 * Defines skill manifest file
 * @type {String}
 */
const SKILL_MANIFEST_FILE = path.join('..', 'skill-package', 'skill.json');

/**
 * Defines supported deployment regions
 *  https://developer.amazon.com/docs/smapi/skill-manifest.html#regions
 * @type {Array}
 */
const SUPPORTED_DEPLOY_REGIONS = ['NA', 'EU', 'FE'];

/**
 * Defines ask-cli deployment profile name
 *  https://developer.amazon.com/en-US/blogs/alexa/alexa-skills-kit/2020/06/using-the-ask-cli-v2-0-to-continuously-deploy-your-skill
 * @type {String}
 */
const PROFILE_NAME = '__ENVIRONMENT_ASK_PROFILE__';

/**
 * Loads a schema
 * @param  {String} file
 * @return {Object}
 */
function loadSchema(file) {
  try {
    return require(file);
  } catch {
    throw new Error(`Failed to load schema: ${file}`);
  }
}

/**
 * Saves a schema
 * @param  {Object} schema
 * @param  {String} file
 */
function saveSchema(schema, file) {
  try {
    // Create the file's directory recursively in case it doesn't exist
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // Write json formatted schema to file
    fs.writeFileSync(file, JSON.stringify(schema, null, 2));
  } catch {
    throw new Error(`Failed to save schema: ${file}`);
  }
}

/**
 * Updates ask-cli resources
 */
function updateAskCliResources() {
  // Load ask-cli resources schema
  const schema = loadSchema(ASK_CLI_RESOURCES_FILE);
  // Deep clone default profile as deployment profile
  const profile = JSON.parse(JSON.stringify(schema.profiles.default));
  // Define skill infrastructure user config
  const config = profile.skillInfrastructure.userConfig;
  // Set lambda function name
  config.cfn.parameters.LambdaFunctionName = process.env.FUNCTION_NAME || 'openhab-alexa';
  // Set lambda log level to error
  config.cfn.parameters.LambdaLogLevel = process.env.LOG_LEVEL || 'error';
  // Set default s3 artifact bucket name
  config.artifactsS3 = { bucketName: process.env[`S3_BUCKET_${SUPPORTED_DEPLOY_REGIONS[0]}`] };
  // Initialize regional overrides object
  config.regionalOverrides = {};
  // Set regional resources
  for (const region of SUPPORTED_DEPLOY_REGIONS) {
    // Set regional endpoint
    profile.code[region] = profile.code.default;
    // Set regional s3 artifact bucket name
    config.regionalOverrides[region] = { artifactsS3: { bucketName: process.env[`S3_BUCKET_${region}`] } };
  }
  // Add deployment profile to schema
  schema.profiles[PROFILE_NAME] = profile;
  // Save ask-cli resources schema
  saveSchema(schema, ASK_CLI_RESOURCES_FILE);
}

/**
 * Updates ask-cli states
 */
function updateAskCliStates() {
  // Load ask-cli states schema if available
  const schema = fs.existsSync(ASK_CLI_STATES_FILE)
    ? loadSchema(ASK_CLI_STATES_FILE)
    : { askcliStatesVersion: '2020-03-31', profiles: {} };
  // Define deployment profile
  const profile = schema.profiles[PROFILE_NAME] || {};
  // Set skill id
  profile.skillId = process.env.SKILL_ID;
  // Update deployment profile
  schema.profiles[PROFILE_NAME] = profile;
  // Save ask-cli states schema
  saveSchema(schema, ASK_CLI_STATES_FILE);
}

/**
 * Updates skill manifest
 */
function updateSkillManifest() {
  // Load skill manifest schema
  const schema = loadSchema(SKILL_MANIFEST_FILE);
  // Extract publishing information from manifest
  const { publishingInformation } = schema.manifest;
  // Set publishing distribution mode as public
  publishingInformation.distributionMode = 'PUBLIC';
  // Set publishing testing instructions username and passowrd
  publishingInformation.testingInstructions = publishingInformation.testingInstructions
    .replace('%TESTING_USERNAME%', process.env.TESTING_USERNAME || 'N/A')
    .replace('%TESTING_PASSWORD%', process.env.TESTING_PASSWORD || 'N/A');
  // Save skill manifest schema
  saveSchema(schema, SKILL_MANIFEST_FILE);
}

if (require.main === module) {
  try {
    // Change working directory to script location
    process.chdir(__dirname);
    // Update ask-cli resources
    updateAskCliResources();
    // Update ask-cli states
    updateAskCliStates();
    // Update skill manifest
    updateSkillManifest();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
