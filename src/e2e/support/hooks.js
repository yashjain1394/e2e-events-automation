const { Before, After } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");
const Logger = require('../common-utils/logger.js'); // Adjust the path to your logger file
const logger = new Logger();

let isScenarioExecuted = false;

Before(async function (scenario) {
  this.credentials = {
    username: process.env.USERNAME || testData.userInfo.username,
    password: process.env.PASSWORD || testData.userInfo.password,
  };

  const scenarioName = scenario.pickle.name; 
  logger.logHeading(`Starting Scenario: ${scenarioName}`);

  if (scenarioName === 'Validate and register events') {
    this.overrideEventName = process.env.EVENT || null;
    if (this.overrideEventName && isScenarioExecuted) {
      return 'skipped';
    }
  }
});

After(function (scenario) {
  const scenarioName = scenario.pickle.name; 
  if (scenarioName === 'Validate and register events') {
    isScenarioExecuted = true;
  }
});
