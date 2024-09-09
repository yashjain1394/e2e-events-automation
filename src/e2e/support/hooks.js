const { Before, After } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");
const Logger = require('../common-utils/logger.js'); // Adjust the path to your logger file
const logger = new Logger();

let isScenarioExecuted = false;

Before(async function (scenario) {
  const env = process.env.ENV || null
  this.credentials = {
    username: process.env.USERNAME || testData.userInfo.username,
    password: process.env.PASSWORD || testData.userInfo.password,
  };

  const scenarioName = scenario.pickle.name;
  logger.logHeading(`Starting Scenario: ${scenarioName}`);

  if (scenarioName === 'Validate and register events') {
    this.overrideEventName = process.env.EVENT || null;
    if (env && env === 'prod' && !this.overrideEventName) {
      logger.logError("Skipping scenario: EVENT not provided for production");
      this.skip();
    }
    if (this.overrideEventName && isScenarioExecuted) {
      console.log("Skipping scenario: Event already executed.");
      this.skip();
    }
  }
});

After(function (scenario) {
  const scenarioName = scenario.pickle.name;
  if (scenarioName === 'Validate and register events') {
    isScenarioExecuted = true;
  }
});
