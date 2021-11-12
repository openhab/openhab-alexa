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
const path = require('path');

/**
 * Defines ask-cli resources file path
 * @type {String}
 */
const ASK_CLI_RESOURCES_FILE = path.resolve('ask-resources.json');

/**
 * Defines ask-cli states file path
 * @type {String}
 */
const ASK_CLI_STATES_FILE = path.resolve('.ask', 'ask-states.json');

/**
 * Defines skill infrastructure template file path
 * @type {String}
 */
const SKILL_INFRA_TEMPLATE_FILE = path.resolve('infrastructure', 'cfn-deployer', 'skill-stack.json');

/**
 * Defines skill manifest file path
 * @type {String}
 */
const SKILL_MANIFEST_FILE = path.resolve('skill-package', 'skill.json');

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
 * Creates ask-cli states
 */
function createAskCliStates() {
  // Initialize ask-cli states schema
  const schema = { askcliStatesVersion: '2020-03-31', profiles: {} };
  // Define state profile
  const profile = {
    skillId: process.env.SKILL_ID,
    skillInfrastructure: { '@ask-cli/cfn-deployer': { deployState: {} } }
  };
  // Define skill infrastructure deploy state
  const deployState = profile.skillInfrastructure['@ask-cli/cfn-deployer'].deployState;
  // Set default deploy state
  deployState.default = {
    s3: { bucket: process.env[`S3_BUCKET_${SUPPORTED_DEPLOY_REGIONS[0]}`], key: 'endpoint/build.zip' },
    stackId: process.env[`STACK_ID_${SUPPORTED_DEPLOY_REGIONS[0]}`]
  };
  // Set regional deploy states
  SUPPORTED_DEPLOY_REGIONS.forEach((region) => deployState[region] = {
    s3: { bucket: process.env[`S3_BUCKET_${region}`], key: 'endpoint/build.zip' },
    stackId: process.env[`STACK_ID_${region}`]
  });
  // Add state profile to schema
  schema.profiles[PROFILE_NAME] = profile;
  // Save ask-cli states schema
  saveSchema(schema, ASK_CLI_STATES_FILE);
}

/**
 * Updates ask-cli resources
 */
function updateAskCliResources() {
  // Load ask-cli resources schema
  const schema = loadSchema(ASK_CLI_RESOURCES_FILE);
  // Deep clone default profile as deployment profile
  const profile = JSON.parse(JSON.stringify(schema.profiles.default));
  // Set regional endpoints
  SUPPORTED_DEPLOY_REGIONS.forEach((region) => profile.code[region] = profile.code.default);
  // Define skill infrastructure user config
  const userConfig = profile.skillInfrastructure.userConfig;
  // Set lambda function name
  userConfig.cfn.parameters.LambdaFunctionName = process.env.FUNCTION_NAME;
  // Set lambda log level
  userConfig.cfn.parameters.LambdaLogLevel = process.env.LOG_LEVEL;
  // Set openhab base url
  userConfig.cfn.parameters.OpenHABBaseURL = process.env.OPENHAB_BASE_URL;
  // Add deployment profile to schema
  schema.profiles[PROFILE_NAME] = profile;
  // Save ask-cli resources schema
  saveSchema(schema, ASK_CLI_RESOURCES_FILE);
}

/**
 * Updates skill infrastructure template
 */
function updateSkillInfraTemplate() {
  // Load skill infrastructure template schema
  const schema = loadSchema(SKILL_INFRA_TEMPLATE_FILE);
  // Get skill function revision
  const revision = execSync('git rev-parse --short HEAD:lambda').toString().trim();
  // Define skill function version resource name
  const versionResource = `AlexaSkillFunctionVersion${revision}`;
  // Add skill function version resource
  schema.Resources[versionResource] = {
    Type: 'AWS::Lambda::Version',
    DeletionPolicy: 'Retain',
    Properties: {
      FunctionName: { Ref: 'AlexaSkillFunction' }
    }
  };
  // Define skill function version permission resource name
  const permissionResource = `AlexaSkillFunctionPermission${revision}`;
  // Add skill function version permission resource
  schema.Resources[permissionResource] = {
    Type: 'AWS::Lambda::Permission',
    DeletionPolicy: 'Retain',
    Properties: {
      ...schema.Resources.AlexaSkillFunctionPermission.Properties,
      FunctionName: { Ref: versionResource }
    }
  };
  // Update skill endpoint output value
  schema.Outputs.SkillEndpoint.Value = { Ref: versionResource };
  // Save skill infrastructure template schema
  saveSchema(schema, SKILL_INFRA_TEMPLATE_FILE);
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
    .replace('%TESTING_USERNAME%', process.env.TESTING_USERNAME)
    .replace('%TESTING_PASSWORD%', process.env.TESTING_PASSWORD);
  // Save skill manifest schema
  saveSchema(schema, SKILL_MANIFEST_FILE);
}

if (require.main === module) {
  try {
    // Create ask-cli states
    createAskCliStates();
    // Update ask-cli resources
    updateAskCliResources();
    // Update skill config for live deployment
    if (process.env.DEPLOY_ENV === 'live') {
      // Update skill infrastructure template
      updateSkillInfraTemplate();
      // Update skill manifest
      updateSkillManifest();
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
