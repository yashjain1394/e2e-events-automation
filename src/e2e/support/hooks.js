const { Before } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");
const { getDynamicEventNames } = require('../common-utils/helper.js');

Before(async function (testCase) {
  this.credentials = {
    username: process.env.USERNAME || testData.userInfo.username,
    password: process.env.PASSWORD || testData.userInfo.password,
  };

  const scenarioName = testCase.pickle.name; 

  if (scenarioName === 'Validate event cards') {
    const dynamicEventNames = getDynamicEventNames();
    this.eventNames = dynamicEventNames;
  }
});
