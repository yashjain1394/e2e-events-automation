const { Before } = require('@cucumber/cucumber');
const testData = require("../config/test-data/eventRegistration.json");

Before(async function () {
  this.credentials = {
    username: process.env.USERNAME || testData.userInfo.username,
    password: process.env.PASSWORD || testData.userInfo.password,
  };
});
