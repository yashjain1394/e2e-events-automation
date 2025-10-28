const { 
  Before, 
  After, 
  AfterAll, 
  Status, 
  BeforeAll 
} = require('@cucumber/cucumber');

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const argv = require('minimist')(process.argv.slice(2));

const Logger = require('../common-utils/logger.js');
const logger = new Logger();

const registerEventTestData = require("../config/test-data/eventRegistration.json");
const createEventTestData   = require("../config/test-data/eventCreation.json");


let isScenarioExecuted = false; 
let loginScenarioFailed = false;
let bearer = null;

dotenv.config();

Before(async function (scenario) {
  this.env     = process.env.ENV || argv.p || 'stage';
  this.browser = process.env.BROWSER || argv.b || 'chrome';

  this.credentialsRegisterEvent = {
    username: process.env.USERNAME || registerEventTestData.userInfo.username,
    password: process.env.PASSWORD || registerEventTestData.userInfo.password,
  };
  this.credentialsCreateEvent = {
    username: process.env.USERNAME || createEventTestData.eventCreationUserInfo.username,
    password: process.env.PASSWORD || createEventTestData.eventCreationUserInfo.password,
  };

  this.overrideEventName = process.env.EVENT || null;

  const scenarioName = scenario.pickle.name;
  logger.logHeading(`Starting Scenario: ${scenarioName}`);

  if (loginScenarioFailed && scenarioName !== 'Verify ECC dashboard page content') {
    return 'skipped';
  }

  if (scenarioName === 'Validate and register events') {
    if (this.env === 'prod' && !this.overrideEventName) {
      logger.logError("Skipping scenario: EVENT not provided for production");
      throw new Error('Scenario skipped: EVENT not provided for production');
    }

    if (this.overrideEventName && isScenarioExecuted) {
      logger.logError("Skipping scenario: Event already executed.");
      throw new Error('Scenario skipped: Event already executed.');
    }
  }
});

After(function (scenario) {
  const scenarioName = scenario.pickle.name;

  if (scenarioName === 'Validate and register events') {
    isScenarioExecuted = true;
  }

  if (scenarioName === 'Verify ECC dashboard page content' && scenario.result.status === Status.FAILED) {
    loginScenarioFailed = true;
  }
});

AfterAll(async function () {
  try {
    const metadata = {
      browser:     { name: "Browser",     value: this.browser || 'chrome' },
      environment: { name: "Environment", value: this.env     || 'stage'  }
    };
    
    const metadataFilePath = path.join(
      global.config.profile.reportDir, 
      `metadata_${global.config.profile.reportTimestamp}.json`
    );

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata written to: ${metadataFilePath}`);
  } catch (err) {
    console.error(`Error writing metadata in AfterAll hook: ${err.message}`);
  }
});
