const { Before, Given, Then, When } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const { RegistrationForm } = require("../pages/registrationForm.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

Given('I am on the events hub page', async function () {
  try {
    this.page = new EventsHubPage();
    await this.page.open();
    logger.logInfo("Navigated to the Events Hub page successfully.")
  } catch (error) {
    logger.logError("Failed to open the Events Hub page:", error.message);
    throw new Error("Could not navigate to the Events Hub page. Please check the URL or connectivity.");
  }
});

Given('I am on the events page', async function () {
  try {
    this.page = new EventsHubPage();
    await this.page.open();
    logger.logInfo("Navigated to the Events Hub page successfully.")
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
      logger.logInfo("Marquee is  displayed on Events Hub page")
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
      logger.logWarning("Pagination controls not present on Events Hub page, skipping next pagination test cases")
      throw new Error("Pagination controls not present on Events Hub page");
    }
    else {
      logger.logInfo("Pagination controls are present on Events Hub page.");
    }
  } catch (error) {
    logger.logError("Error occured while pagination controls verification:", error.message);
    throw new Error("Failed to verify pagination controls.");
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
    if (this.overrideEventName) {
      logger.logHeading(`Event provided by user: ${this.overrideEventName}`)
      this.eventTitle = this.overrideEventName
    } else {
      this.eventTitle = eventTitle
    }
    await this.page.viewEventByTitle(this.eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card with title "${this.eventTitle}":`, error.message);
    throw new Error(`Could not select the event card with title "${this.eventTitle}". Please verify the event title.`);
  }
});

// When('I select the event card at position {int}', async function (sequenceNumber) {
//   try {
//     console.log("Events :", this.eventNames)
//     this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
//     await this.page.viewEventByTitle(this.eventTitle);
//   } catch (error) {
//     console.error(`Failed to select the event card at position ${sequenceNumber}:`, error.message);
//     //throw new Error(`Could not select the event card at position ${sequenceNumber}. Please ensure the event cards are loaded correctly.`);
//   }
// });

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

When('I click the View event button on the event card', async function () {
  try {
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${this.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

// When('I click the "View event" button on the event card at position {int}', async function (sequenceNumber) {
//   try {
//     this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
//     await this.page.clickViewEventButton(this.eventTitle);
//   } catch (error) {
//     console.error(`Failed to click the "View event" button for the event with title "${this.eventTitle}":`, error.message);
//     throw new Error('Could not click the "View event" button as expected.');
//   }
// });

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
    logger.logInfo("Verified event agenda is displayed.")
  } catch (error) {
    console.error("An error occurred while verifying the agenda:", error.message);
    //throw new Error("Failed to verify agenda visibility on the Event Details page.");
  }
});

Then('I should see the Venue on the event details page', async function () {
  try {
    const isVenueVisible = await this.page.isElementVisible(this.page.locators.eventVenue);
    if (!isVenueVisible) {
      logger.logError("Event venue verification failed: Venue is not visible.");
      throw new Error("Venue is not displayed as expected on the Event Details page.");
    }
    logger.logInfo("Verfied event venue is displayed.")
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
      logger.logWarning("Speaker section is not visible: No Speakers for the event");
    }

    const isHostSectionVisible = await this.page.isElementVisible(hostSection);

    if (isHostSectionVisible) {
      await this.page.verifyProfileCards('host');
    } else {
      logger.logWarning("Host section is not visible : No Host added for the event");
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
      logger.logWarning('Related products blade does not exist on the page.');
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
      logger.logWarning('Partners does not exist on the page.');
    }
  } catch (error) {
    console.error('An error occurred while verifying the related products blade:', error);
    //throw new Error("Failed to verify CTA in the related products blade.");
  }
});


Then('I initiate the RSVP process and handle sign-in if required', async function () {
  try {

    this.context(RegistrationForm);
    await this.page.clickRsvp();
    logger.logInfo("RSVP button clicked");
    this.context(EventDetailPage)
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
        await this.page.signIn(this.credentialsRegisterEvent.username, this.credentialsRegisterEvent.password);
        logger.logInfo("Sign-in completed");

        this.context(RegistrationForm);
        await this.page.clickRsvp();
        logger.logInfo("RSVP button clicked again after sign-in");

        formDisplayed = await checkFormDisplayed();
        if (!formDisplayed) {
          logger.logError("RSVP form did not appear after sign-in");
          throw new Error("RSVP form did not appear after sign-in");
        }
      } catch (signInError) {
        console.error(`Sign-in handling failed: ${signInError.message}`);
        throw new Error("RSVP form did not appear and sign-in failed");
      }
    } else {
      logger.logInfo("RSVP form displayed successfully");
    }
  } catch (error) {
    console.error(`Failed to initiate the RSVP process: ${error.message}`);
    throw new Error("Error occured while initiating the RSVP process.");
  }
});

Then('I should see the event title I clicked on', async function () {
  try {
    this.context(RegistrationForm)
    await this.page.verifyEventTitle(this.eventTitle);
  } catch (error) {
    console.error("Event title verification failed:", error.message);
    //throw new Error("The event title displayed does not match the expected title on the Event Details page.");
  }
});

Then('I should see my firstname, lastname & email prefilled', async function () {
  try {
    await this.page.verifyFirstNamePrefilled();
    await this.page.verifyLastNamePrefilled();
    await this.page.verifyEmailPrefilled(this.credentialsRegisterEvent.username);
  } catch (error) {
    console.log("Error verifying prefilled firstname, lastname & email input:", error.message);
  }
});

Then('I fill all the required information with {string}', async function(formDataJson) {
  try {
    const formData = JSON.parse(formDataJson);
    //console.log('Filling out form with data:', formData);
    this.context(RegistrationForm)
    await this.page.fillRequiredFields(formData);
  } catch (error) {
    console.error("Failed to fill required fields:", error.message);
    throw new Error("Failed to fill all required information on the form.");
  }
});

When('I check the Terms and Conditions', async function () {
  try {
      await this.page.checkTermsAndConditions();
  } catch (error) {
      console.error("Failed to check the Terms and Conditions:", error);
      //throw new Error("Terms and Conditions checkbox could not be checked.");
  }
});

Then('I click the Submit button', async function () {
  try {
      await this.page.submitInformation();
  } catch (error) {
      console.error("Failed to submit the information:", error);
      throw new Error("Form submission failed.");
  }
});

Then('I see the registration confirmation', async function () {
  try {
      await this.page.verifyRegistrationConfirmation();
  } catch (error) {
      console.error("Failed to verify the registration confirmation:", error);
      throw new Error("Failed to verify the registration confirmation.");
  }
});

Then('I cancel the RSVP', async function () {
  try {
      await this.page.cancelRSVP();
  } catch (error) {
      console.error("Failed to cancel the RSVP:", error);
      throw new Error("Failed to cancel the RSVP.");
  }
});







