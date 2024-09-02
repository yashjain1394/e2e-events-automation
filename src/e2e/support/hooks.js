const { Before } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");
const { getDynamicEventName } = require('../common-utils/helper.js');

Before(async function (testCase) {
  this.credentials = {
    username: process.env.USERNAME || testData.userInfo.username,
    password: process.env.PASSWORD || testData.userInfo.password,
  };

  const scenarioName = testCase.pickle.name; 

  if (scenarioName === 'Validate and register events') {
    this.overrideEventName = process.env.EVENT || null;
  }
});
