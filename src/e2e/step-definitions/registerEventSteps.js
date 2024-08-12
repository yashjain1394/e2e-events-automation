const { Given, Then } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const page = new EventsHubPage();

Given('I am on the events hub page', function () {
  page.open();
});

Then('I choose the {string} category', async function (categoryName) {
  await page.locator(`button[data-group="${categoryName}"]`).click();  
});
