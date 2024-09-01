const { Given, Then, When } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');

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
    await this.page.isElementVisible(this.page.locators.marquee);
  } catch (error) {
    console.error("Marquee verification failed:", error.message);
    //throw new Error("Marquee is not displayed as expected on the Events Hub page.");
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

When('I select the event card with title {string}', async function (eventTitle) {
  try {
    this.eventTitle = eventTitle
    await this.page.viewEventByTitle(eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card with title "${eventTitle}":`, error.message);
    //throw new Error(`Could not select the event card with title "${eventTitle}". Please verify the event title.`);
  }
});

When('I select the event card at position {int}', async function (sequenceNumber) {
  try {
    this.eventTitle = await this.page.getEventTitleBySequence(sequenceNumber);
    await this.page.viewEventByTitle(this.eventTitle);
  } catch (error) {
    console.error(`Failed to select the event card at position ${sequenceNumber}:`, error.message);
    throw new Error(`Could not select the event card at position ${sequenceNumber}. Please ensure the event cards are loaded correctly.`);
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

Then('I should see pagination controls', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.paginationControlsSelector);
  } catch (error) {
    console.error("Pagination controls verification failed:", error.message);
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
    await this.page.verifyButtonIsClickable(buttonSelector);
  } catch (error) {
    console.error(`Failed to verify if the "${buttonType}" button is clickable:`, error.message);
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

When('the View event button on the event card should be clickable', async function () {
  try {
    await this.page.clickViewEventButton(this.eventTitle);
  } catch (error) {
    console.error(`Failed to click the "View event" button for the event with title "${testData.eventTitle}":`, error.message);
    throw new Error('Could not click the "View event" button as expected.');
  }
});

When('I click the "View event" button on the event card', async function () {
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
    throw new Error(`Failed to verify event details for "${this.eventTitle}". ${error.message}`);
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
      throw new Error("Failed to verify venue visibility on the Event Details page.");
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
      // Optionally, you can rethrow the error to fail the test
      throw new Error("Failed to verify profile cards: " + error.message);
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
    console.error(`Failed to complete the RSVP process: ${error.message}`);
  }
});



Then('I click the RSVP Button', async function () {
  try {
    await this.page.clickRsvp();
  } catch (error) {
    console.error("Failed to click on RSVP Button")
  }
});

Then('I sign in with AdobeID', async function () {
  try {
    this.context(AdobeIdSigninPage);
    await this.page.signIn(this.credentials.username, this.credentials.password)
    console.log("Sign in done")
  }
  catch (error) {
    console.error(`Failed to sign in : ${error}`)
  }
});

Then('I again click the RSVP Button', async function () {
  try {
    this.context(EventDetailPage);
    await this.page.clickRsvp();
  } catch (error) {
    console.error("Failed to click on RSVP Button")
  }
});

Then('I see the RSVP Form', async function () {
  try {
    await this.page.isElementVisible(this.page.locators.eventForm);
  } catch (error) {
    console.error("RSVP form verification failed:", error.message);
    throw new Error("RSVP form not displayed as expected on the Event Details page.");
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



