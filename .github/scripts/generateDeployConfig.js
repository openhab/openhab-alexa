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

const { getCommandOuput, loadSchema, saveSchema } = require('./utils');
const {
  ASK_CLI_RESOURCES_FILE,
  ASK_CLI_STATES_FILE,
  DEPLOY_PROFILE,
  DEPLOY_REGIONS,
  SKILL_INFRA_TEMPLATE_FILE,
  SKILL_MANIFEST_FILE
} = require('./constants');

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
    s3: { bucket: process.env[`S3_BUCKET_${DEPLOY_REGIONS[0]}`], key: 'endpoint/build.zip' },
    stackId: process.env[`STACK_ID_${DEPLOY_REGIONS[0]}`]
  };
  // Set regional deploy states
  DEPLOY_REGIONS.forEach((region) => deployState[region] = {
    s3: { bucket: process.env[`S3_BUCKET_${region}`], key: 'endpoint/build.zip' },
    stackId: process.env[`STACK_ID_${region}`]
  });
  // Add state profile to schema
  schema.profiles[DEPLOY_PROFILE] = profile;
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
  DEPLOY_REGIONS.forEach((region) => profile.code[region] = profile.code.default);
  // Define skill infrastructure user config
  const userConfig = profile.skillInfrastructure.userConfig;
  // Set lambda function name
  userConfig.cfn.parameters.LambdaFunctionName = process.env.FUNCTION_NAME;
  // Set lambda log level
  userConfig.cfn.parameters.LambdaLogLevel = process.env.LOG_LEVEL;
  // Set openhab base url
  userConfig.cfn.parameters.OpenHABBaseURL = process.env.OPENHAB_BASE_URL;
  // Add deployment profile to schema
  schema.profiles[DEPLOY_PROFILE] = profile;
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
  const revision = getCommandOuput('git rev-parse --short HEAD:lambda');
  // Define skill function version resource name
  const versionResource = `AlexaSkillFunctionVersion${revision}`;
  // Add skill function version resource
  schema.Resources[versionResource] = {
    Type: 'AWS::Lambda::Version',
    DeletionPolicy: 'Retain',
    Properties: {
      FunctionName: { Ref: 'AlexaSkillFunction' },
      Description: `${schema.Resources.AlexaSkillFunction.Properties.Description} (${process.env.RELEASE_VERSION})`
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
    // Update skill manifest
    updateSkillManifest();
    // Update skill infrastructure template for live deployment
    if (process.env.DEPLOY_ENV === 'live') updateSkillInfraTemplate();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
