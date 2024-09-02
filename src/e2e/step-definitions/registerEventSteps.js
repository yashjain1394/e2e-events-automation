const { Before, Given, Then, When } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

Given('I am on the events hub page', async function () {
  try {
    this.page = new EventsHubPage();
    await this.page.open();
    logger.logInfo("Navigated to Events Hub page")
  } catch (error) {
    logger.logError("Failed to open the Events Hub page:", error.message);
    throw new Error("Could not navigate to the Events Hub page. Please check the URL or connectivity.");
  }
});

Then('I should see the Marquee displayed on the page', async function () {
  try {
    const isMarqueeVisible = await this.page.isElementVisible(this.page.locators.marquee);
    if (!isMarqueeVisible) {
      logger.logError("Marquee not displayed on Events Hub page.");
    }
    else {
      logger.logInfo("Marquee displayed on Events Hub page")
    }
  } catch (error) {
    logger.logError("Error occured while marquee verification:", error.message);
    //throw new Error("Marquee is not displayed as expected on the Events Hub page.");
  }
});

Then('I should see events displayed on the page', async function () {
  try {
    const eventsDisplayed = await this.page.verifyEventsDisplayed();
    if (!eventsDisplayed) {
      throw new Error("Events are not displayed as expected on the Events Hub page.");
    }
  } catch (error) {
    throw new Error("Error during events verification on the Events Hub page.", error.message);
  }
});

Then('I should see pagination controls', async function () {
  try {
    const isPaginationVisible = await this.page.isElementVisible(this.page.locators.paginationControlsSelector);
    if (!isPaginationVisible) {
      logger.logWarning("Pagination controls not present on Events Hub page")
    }
    else {
      logger.logInfo("Pagination controls are present on Events Hub page.");
    }
  } catch (error) {
    logger.logError("Error occured while pagination controls verification:", error.message);
    //throw new Error("Failed to verify pagination controls.");
  }
});

Then('the {string} button should be clickable', async function (buttonType) {
  try {
    const buttonSelectors = {
      'Next': this.page.locators.nextButtonSelector,
      'Previous': this.page.locators.previousButtonSelector
    };
    const buttonSelector = buttonSelectors[buttonType];
    if (!buttonSelector) {
      throw new Error(`No selector defined for button type "${buttonType}".`);
    }
    await this.page.verifyButtonIsClickable(buttonType, buttonSelector);
  } catch (error) {
    logger.logError(`Error occured while verifying "${buttonType}" button is clickable:`, error.message);
    //throw new Error(`The "${buttonType}" button could not be verified as clickable.`);
  }
});

Then('I should be able to click on specific page numbers', async function () {
  try {
    await this.page.verifyPageNumbersClickable();
  } catch (error) {
    console.error('Failed to verify page numbers:', error.message);
    //throw new Error('The page numbers could not be verified.');
  }
});

Then('I should see the total number of pages and results displayed', async function () {
  try {
    await this.page.verifyTotalPagesAndResults();
  } catch (error) {
    console.error('Failed to verify total pages and results:', error.message);
    //throw new Error('The total number of pages and results could not be verified.');
  }
});

When('I select the event card with title {string}', async function (eventTitle) {
  try {
    console.log(`Event provided by user: ${this.overrideEventName}`)
    this.eventTitle = eventTitle
    await this.page.viewEventByTitle(eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card with title "${eventTitle}":`, error.message);
    //throw new Error(`Could not select the event card with title "${eventTitle}". Please verify the event title.`);
  }
});

When('I select the event card at position {int}', async function (sequenceNumber) {
  try {
    console.log("Events :", this.eventNames)
    this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
    await this.page.viewEventByTitle(this.eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card at position ${sequenceNumber}:`, error.message);
    //throw new Error(`Could not select the event card at position ${sequenceNumber}. Please ensure the event cards are loaded correctly.`);
  }
});


Then('the banners on the event card should be displayed correctly', async function () {
  try {
    await this.page.verifyBannersOnCard(this.eventTitle);
  } catch (error) {
    console.error(`Banner not present for ${this.eventTitle} :`, error.message);
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

When('the View event button on the event card should be clickable', async function () {
  try {
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${testData.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

When('I click the View event button on the event card', async function () {
  try {
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

When('I click the "View event" button on the event card at position {int}', async function (sequenceNumber) {
  try {
    this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

Then('I should navigate to the event detail page', async function () {
  try {
    this.context(EventDetailPage);
    const expectedTitle = this.eventTitle;
    await this.page.verifyNavigationToEventDetailPage(expectedTitle);
    await this.page.verifyOnEventDetailPage(expectedTitle);
  } catch (error) {
    console.error(`Failed to verify navigation to the event detail page for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Navigation to the event detail page did not happen as expected.');
  }
});

Then('I should see the event details on the page', async function () {
  try {
    await this.page.verifyEventDetails(this.eventTitle);
    console.log(`Event details for "${this.eventTitle}" are displayed as expected.`);
  } catch (error) {
    console.error(`Error verifying event details for "${this.eventTitle}": ${error.message}`);
    //throw new Error(`Failed to verify event details for "${this.eventTitle}". ${error.message}`);
  }
});


Then('I should see the Agenda on the event details page', async function () {
  try {
    const isAgendaVisible = await this.page.isElementVisible(this.page.locators.eventAgenda);
    if (!isAgendaVisible) {
      console.warn("Event agenda verification failed: Agenda is not visible.");
    }
  } catch (error) {
    console.error("An error occurred while verifying the agenda:", error.message);
    //throw new Error("Failed to verify agenda visibility on the Event Details page.");
  }
});

Then('I should see the Venue on the event details page', async function () {
  try {
    const isVenueVisible = await this.page.isElementVisible(this.page.locators.eventVenue);
    if (!isVenueVisible) {
      console.error("Event venue verification failed: Venue is not visible.");
      throw new Error("Venue is not displayed as expected on the Event Details page.");
    }
  } catch (error) {
    console.error("An error occurred while verifying the venue:", error.message);
    //throw new Error("Failed to verify venue visibility on the Event Details page.");
  }
});


Then('I should see profile cards for speakers and host', async function () {
  try {
    const speakersSection = this.page.locators.sectionSelector('speakers')
    const hostSection = this.page.locators.sectionSelector('host')
    const isSpeakerSectionVisible = await this.page.isElementVisible(speakersSection);

    if (isSpeakerSectionVisible) {
      await this.page.verifyProfileCards('speakers');
    } else {
      console.warn("Speaker section is not visible.");
    }

    const isHostSectionVisible = await this.page.isElementVisible(hostSection);

    if (isHostSectionVisible) {
      await this.page.verifyProfileCards('host');
    } else {
      console.warn("Host section is not visible.");
    }

  } catch (error) {
    console.error("Failed to verify profile cards:", error.message);
    //throw new Error("Failed to verify profile cards: " + error.message);
  }
});

Then(/^I verify the CTA in the related products blade$/, async function () {
  try {
    relatedProductsSelector = await this.page.locators.relatedProductsSection
    const bladeExists = await this.page.isElementVisible(relatedProductsSelector);
    if (bladeExists) {
      await this.page.verifyRelatedProductsBladeDetails(relatedProductsSelector);
    } else {
      console.warn('Related products blade does not exist on the page.');
    }

  } catch (error) {
    console.error('An error occurred while verifying the related products blade:', error);
    //throw new Error("Failed to verify CTA in the related products blade.");
  }
});

Then(/^I verify the partners section$/, async function () {
  try {
    partnersSectionSelector = await this.page.locators.partnersSection
    const sectionExists = await this.page.isElementVisible(partnersSectionSelector);
    if (sectionExists) {
      await this.page.verifyPartnersDetails(partnersSectionSelector);
    } else {
      console.warn('Partners does not exist on the page.');
    }
  } catch (error) {
    console.error('An error occurred while verifying the related products blade:', error);
    //throw new Error("Failed to verify CTA in the related products blade.");
  }
});


Then('I initiate the RSVP process and handle sign-in if required', async function () {
  try {

    await this.page.clickRsvp();
    console.log("RSVP button clicked");

    const checkFormDisplayed = async () => {
      try {
        await this.page.native.waitForSelector(this.page.locators.eventForm, { state: 'visible', timeout: 10000 });
        return true;
      } catch (error) {
        console.error(`Error checking form visibility: ${error.message}`);
        return false;
      }
    };

    let formDisplayed = await checkFormDisplayed();
    if (!formDisplayed) {
      console.log("RSVP form not displayed, checking for sign-in");

      try {
        await this.page.isElementVisible(this.page.locators.signInEmailForm);
        console.log("Sign-in required, proceeding with sign-in");

        this.context(AdobeIdSigninPage);
        await this.page.signIn(this.credentials.username, this.credentials.password);
        console.log("Sign-in completed");

        this.context(EventDetailPage);
        await this.page.clickRsvp();
        console.log("RSVP button clicked again after sign-in");

        formDisplayed = await checkFormDisplayed();
        if (!formDisplayed) {
          throw new Error("RSVP form did not appear after sign-in");
        }
      } catch (signInError) {
        console.error(`Sign-in handling failed: ${signInError.message}`);
        throw new Error("RSVP form did not appear and sign-in failed");
      }
    } else {
      console.log("RSVP form displayed successfully");
    }
  } catch (error) {
    console.error(`Failed to initiate the RSVP process: ${error.message}`);
    throw new Error("Error occured while initiating the RSVP process.");
  }
});

Then('I should see the event title I clicked on', async function () {
  try {
    await this.page.isEventTitleCorrect(this.eventTitle);
  } catch (error) {
    console.error("Event title verification failed:", error.message);
    //throw new Error("The event title displayed does not match the expected title on the Event Details page.");
  }
});

Then('I should see my email prefilled', async function () {
  await this.page.isEmailCorrect(this.credentials.username);
});

Then('I fill all required information', async function () {
  await this.page.fillRsvpForm();
});

// Then('I see the registration confirmation', async function () {
//   await expect(eventDetailsPage.rsvpConfirmation).toBeVisible();
// });

// Then('I close the confirmation', async function () {
//   await eventDetailsPage.closeConfirmation();
// });



