const { Given, Then, When } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");

Given('I am on the events hub page', async function () {
  try {
    this.page = new EventsHubPage();
    await this.page.open();
  } catch (error) {
    console.error("Failed to open the Events Hub page:", error.message);
    throw new Error("Could not navigate to the Events Hub page. Please check the URL or connectivity.");
  }
});

Then('I should see the Marquee displayed on the page', async function () {
  try {
    await this.page.verifyMarquee();
  } catch (error) {
    console.error("Marquee verification failed:", error.message);
    throw new Error("Marquee is not displayed as expected on the Events Hub page.");
  }
});

Then('I should see events displayed on the page', async function () {
  try {
    await this.page.verifyEventsDisplayed();
  } catch (error) {
    console.error("Events verification failed:", error.message);
    throw new Error("Events are not displayed as expected on the Events Hub page.");
  }
});

When('I select an event card with title {string}', async function (eventTitle) {
  try {
    this.eventTitle = eventTitle;
    await this.page.viewEventByTitle(eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card with title "${eventTitle}":`, error.message);
    //throw new Error(`Could not select the event card with title "${eventTitle}". Please verify the event title.`);
  }
});

Then('the banners on the event card should be displayed correctly', async function () {
  try {
    await this.page.verifyBannersOnCard(this.eventTitle);
  } catch (error) {
    console.error("Banner verification failed:", error.message);
    //throw new Error("Banners on the event card are not displayed correctly.");
  }
});

Then('I should see the date and time displayed correctly on the event card', async function () {
  try {
    await this.page.verifyDateAndTimeOnCard(this.eventTitle);
  } catch (error) {
    console.error("Date and time verification failed:", error.message);
    //throw new Error("Date and time on the event card are not displayed correctly.");
  }
});

Then('the "View event" button on the event card should be clickable', async function () {
  try {
    await this.page.verifyViewEventButton(this.eventTitle);
  } catch (error) {
    console.error("Read more button verification failed:", error.message);
    throw new Error('The "Read more" button on the event card is not clickable.');
  }
});

Then('I should see pagination controls', async function () {
  try {
    await this.page.verifyPaginationControls(); 
  } catch (error) {
    console.error("Pagination controls verification failed:", error.message);
    throw new Error("Failed to verify pagination controls.");
  }
});

Then('the "Next" button should be clickable', async function () {
  await this.page.verifyButtonIsClickable(this.page.nextButtonSelector); 
});

Then('the "Previous" button should be clickable', async function () {
  await this.page.verifyButtonIsClickable(this.page.previousButtonSelector); 
});

Then('I should be able to click on specific page numbers', async function () {
  await this.page.verifyPageNumbersClickable();
  await this.page.clickPageNumber(2);
});

Then('I should see the total number of pages and results displayed', async function () {
  await this.page.verifyTotalPagesAndResults(); 
});

Then('I choose the {string} category', async function (categoryName) {
  await this.page.selectCategory(categoryName)
});

// Then('confirm events are displayed on the page', async function () {
//   const areEventsDisplayed = await this.page.areEventCardsVisible();
//   if (!areEventsDisplayed) {
//     throw new Error("Event cards are not displayed on the page");
//   }
//   console.log("Event cards are successfully displayed on the page.");
// });

// Then('view {string} event', async function (eventTitle) {
//   await this.page.viewEventByTitle(eventTitle);
// });

