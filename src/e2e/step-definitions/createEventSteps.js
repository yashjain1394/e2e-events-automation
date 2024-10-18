const { Before, Given, Then, When, And } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const { RegistrationForm } = require("../pages/registrationForm.page.js");
const { EventsDashboard } = require("../pages/eventsDashboard.page.js");
const { BasicInfo } = require("../pages/basicInfo.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const constants = require("../config/test-data/constants.js");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');
const Logger = require('../common-utils/logger.js');
const { SpeakersAndHosts } = require("../pages/speakersAndHosts.page.js");
const logger = new Logger();

Given('I am on the ECC dashboard page', async function () {
  try {
    this.page = new EventsDashboard();
    await this.page.open();
    logger.logInfo("Navigated to the Events Dashboard page successfully.")
  } catch (error) {
    logger.logError("Failed to open the Events Dashboard page:", error.message);
    throw new Error("Could not navigate to the Events Dashboard page. Please check the URL or connectivity.");
  }

  try {
    await this.page.clickSignIn();
    logger.logInfo("Sign-in clicked successfully.");

    this.context(EventDetailPage);
    await this.page.isElementVisible(this.page.locators.signInEmailForm, timeout = 60000);
    logger.logInfo("Sign-in required, proceeding with sign-in");

    this.context(AdobeIdSigninPage);
    await this.page.signIn(this.credentials.username, this.credentials.password);
    logger.logInfo("Sign-in completed");

  } catch (signInError) {
    console.error(`Sign-in handling failed: ${signInError.message}`);
  }
});

Then('I should see the All Events label on the page', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.dashboardHeading, timeout = 30000);
    if (!isAllEventsVisible) {
      logger.logError("All Events not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("All Events is  displayed on Events Dashboard page")
    }
  } catch (error) {
    logger.logError("Error occured while All Events label verification:", error.message);
    console.error("Error occured while All Events label verification:", error.message);
  }
});

Then('I should see the Search box on the page', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.searchBox);
    if (!isAllEventsVisible) {
      logger.logError("Search box not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("Search box is  displayed on Events Dashboard page")
    }
  } catch (error) {
    logger.logError("Error occured while Search box verification:", error.message);
  }
});

Then('I should see the table headers on the page', async function () {
  try {
    this.context(EventsDashboard);
    await this.page.verifyTableHeaders(constants.expectedTableHeaders)
  } catch (error) {
    logger.logError("Error occured while table headers verification:", error.message);
  }
});

Then('I should see pagination container', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.paginationContainer);
    if (!isAllEventsVisible) {
      logger.logError("Pagination controls not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("Pagination controls is  displayed on Events Dashboard page")
    }
  } catch (error) {
    logger.logError("Error occured while pagination controls verification:", error.message);
  }
});

Then('I should see the footer section on the page', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.footerSection);
    if (!isAllEventsVisible) {
      logger.logError("Footer section not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("Footer section is  displayed on Events Dashboard page")
    }
  } catch (error) {
    logger.logError("Error occured while footer section verification:", error.message);
  }
});

Then('I should see the Create new event button on the page', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.createNewEventButton);
    if (!isAllEventsVisible) {
      logger.logError("Create new event button not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("Create new event button is  displayed on Events Dashboard page")
    }

  } catch (error) {
    logger.logError("Error occured while validating Create new event button:", error.message);
  }
});

Then('I should be able to click on Create new event button', async function () {
  try {
    this.context(EventsDashboard);
    await this.page.clickCreateNewEventButton();
  } catch (error) {
    logger.logError('Failed to click Create new event button:', error.message);
  }
});

Then('I am in the create event flow and Basic info page', async function () {
  try {
    const basicInfo = new BasicInfo()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(basicInfo.locators.basicInfoLabel, timeout=30000);
    if (!isAllEventsVisible) {
      logger.logError("Basic info not displayed on page.");
    }
    else {
      logger.logInfo("Basic info is  displayed on page")
    }
  } catch (error) {
    logger.logError("Error occured while Basic info label verification:", error.message);
  }
});

Then('I fill out cloud type and series type with {string}', async function(eventDataJson) {
  try {
    const eventData = JSON.parse(eventDataJson);
    console.log('Filling out cloud type and series type with data:', eventData);
    this.context(BasicInfo);
    await this.page.selectCloudType(eventData.cloudType);
    await this.page.selectSeriesType(eventData.series);
  } catch (error) {
    logger.logError("Failed to fill out cloud type and series type:", error.message);
  }
});

Then('I fill minimum required fields such as event title, event description, date, start time, end time, timezone and venue information with {string}', async function(eventDataJson) {
  try {
    const eventData = JSON.parse(eventDataJson);
    console.log('Filling out minimum required fields with data:', eventData);
    this.context(BasicInfo);
    await this.page.fillMinimumRequiredFields(eventData);

  } catch (error) {
    logger.logError("Failed to fill minimum required fields:", error.message);
  }
});

Then('I click Next step multiple times', async function () {
  try {
    await this.page.clickCreateNextStepButton();

  } catch (error) {
    logger.logError('Failed to click Next step button:', error.message);
  }

  
});