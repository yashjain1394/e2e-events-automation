const { Before, After, AfterAll } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");
const Logger = require('../common-utils/logger.js'); // Adjust the path to your logger file
const logger = new Logger();
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

let isScenarioExecuted = false;

Before(async function (scenario) {
  this.env = process.env.ENV || argv.p;
  this.browser = process.env.BROWSER || arguments.b
  this.credentials = {
    username: testData.userInfo.username || process.env.USERNAME,
    password: testData.userInfo.password || process.env.PASSWORD,
  };
  this.overrideEventName = process.env.EVENT || null;

  const scenarioName = scenario.pickle.name;
  logger.logHeading(`Starting Scenario: ${scenarioName}`);

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
});

AfterAll(async function () {
  try {
    this.env = process.env.ENV || argv.p;
    this.browser = process.env.BROWSER || argv.b
    const metadata = {
      browser: { name: "Browser", value: this.browser || 'chrome' },
      environment: { name: "Environment", value: this.env || 'stage' }
    }
    const metadataFilePath = path.join(global.config.profile.reportDir, `metadata_${global.config.profile.reportTimestamp}.json`);

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata written to: ${metadataFilePath}`);
  }

  catch (err) {
    console.error(`Error in AfterAll hook: ${err.message}`);
  }
});