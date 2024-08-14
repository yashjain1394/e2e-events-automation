const { Given, Then } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const page = new EventsHubPage();

Given('I am on the events hub page', async function () {
  this.page = new EventsHubPage();
  await this.page.open();
});

Then('I choose the {string} category', async function (categoryName) {
  await this.page.selectCategory(categoryName)
});

Then('confirm events are displayed on the page', async function () {
  const areEventsDisplayed = await this.page.areEventCardsVisible();
  if (!areEventsDisplayed) {
    throw new Error("Event cards are not displayed on the page");
  }
  console.log("Event cards are successfully displayed on the page.");
});

Then('view {string} event', async function (eventTitle) {
  await this.page.viewEventByTitle(eventTitle);
});

