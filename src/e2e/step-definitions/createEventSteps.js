const { Before, Given, Then, When, And } = require("@cucumber/cucumber");
const { EventsHubPage } = require("../pages/eventsHub.page.js");
const { EventDetailPage } = require("../pages/eventDetails.page.js");
const { RegistrationForm } = require("../pages/registrationForm.page.js");
const { EventsDashboard } = require("../pages/eventsDashboard.page.js");
const { BasicInfo } = require("../pages/createEvent_basicInfo.page.js");
const testData = require("../config/test-data/eventRegistration.json");
const { expect } = require('@playwright/test');
const { AdobeIdSigninPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js');
const Logger = require('../common-utils/logger.js');
const { SpeakersAndHosts } = require("../pages/createEvent_speakersAndHosts.page.js");
const { AdditionalContent } = require("../pages/createEvent_additionalContent.page.js");
const { Rsvp } = require("../pages/createEvent_rsvp.page.js");
const logger = new Logger();
const expectedTableHeaders = ["EVENT NAME","PUBLISH STATUS","DATE RUN","LAST MODIFIED","VENUE NAME","LANGUAGE","RSVP DATA","MANAGE"];
const eventSavedToastTxt = "Edits saved successfully";
const eventPublishedToastTxt = "Success! This event has been published.";
const eventPublishedToastGoToDashboardTxt = "Go to dashboard";

Given('I am on the ECC dashboard page', async function () {
  try {
    this.page = new EventsDashboard();
    await this.page.open();
    logger.logInfo("Navigated to the Events Dashboard page successfully.")
  } catch (error) {
    console.error("Failed to open the Events Dashboard page:", error.message);
    throw new Error("Could not navigate to the Events Dashboard page. Please check the URL or connectivity.");
  }
});

When('I sign-in on the ECC dashboard page', async function () {
  try {
    // await this.page.clickSignIn();
    // logger.logInfo("Sign-in clicked successfully.");

    // this.context(EventDetailPage);
    // await this.page.isElementVisible(this.page.locators.signInEmailForm, timeout = 60000);
    // logger.logInfo("Sign-in required, proceeding with sign-in");

    this.context(EventDetailPage);
    await this.page.isElementVisible(this.page.locators.signInEmailForm, timeout = 45000);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logger.logInfo("Sign-in required, proceeding with sign-in");
    this.context(AdobeIdSigninPage);
    await this.page.signIn(this.credentialsCreateEvent.username, this.credentialsCreateEvent.password);
    logger.logInfo("Sign-in completed");
    
  } catch (signInError) {
    console.error(`Sign-in failed: ${signInError.message}`);
    throw new Error(`Sign-in failed: ${signInError.message}`);
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
    console.error("Error occured while All Events label verification:", error.message);
    throw new Error("Error occured while All Events label verification:", error.message);
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
    console.error("Error occured while Search box verification:", error.message);
    throw new Error("Error occured while Search box verification:", error.message);
  }
});

Then('I should see the table headers on the page', async function () {
  try {
    this.context(EventsDashboard);
    await this.page.verifyTableHeaders(expectedTableHeaders)
  } catch (error) {
    console.error("Error occured while table headers verification:", error.message);
    throw new Error("Error occured while table headers verification:", error.message);
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
    console.error("Error occured while pagination controls verification:", error.message);
    throw new Error("Error occured while pagination controls verification:", error.message);
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
    console.error("Error occured while footer section verification:", error.message);
    throw new Error("Error occured while footer section verification:", error.message);
  }
});

Then('I should see the Create new event button on the page', async function () {
  try {
    const eventDashboard = new EventsDashboard()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(eventDashboard.locators.createNewEventButton, timeout = 30000);
    if (!isAllEventsVisible) {
      logger.logError("Create new event button not displayed on Events Dashboard page.");
    }
    else {
      logger.logInfo("Create new event button is  displayed on Events Dashboard page")
    }

  } catch (error) {
    console.error("Error occured while validating Create new event button:", error.message);
    throw new Error("Error occured while validating Create new event button:", error.message);
  }
});

Then('I should be able to click on Create new event button {string}', async function (eventType) {
  try {
    this.context(EventsDashboard);
    await this.page.clickCreateNewEventButton(eventType);
  } catch (error) {
    logger.logError(`Failed to click Create ${eventType} event button:`, error.message);
    throw new Error(`Failed to click Create ${eventType} event button: ${error.message}`);
  }
});

Then('I am in the create event flow and Basic info page', async function () {
  try {
    const basicInfo = new BasicInfo()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(basicInfo.locators.basicInfoLabel, timeout=30000);
    if (!isAllEventsVisible) {
      logger.logError("Basic info label not displayed on page.");
    }
    else {
      logger.logInfo("Basic info label is  displayed on page")
      this.context(BasicInfo);
      await this.page.validateTextContent(basicInfo.locators.basicInfoLabel, "Basic info");
    }
  } catch (error) {
    console.error("Error occured while Basic info label verification:", error.message);
    throw new Error("Error occured while Basic info label verification:", error.message);
  }
});

Then('I fill out cloud type and series type with {string}', async function(eventDataJson) {
  try {
    const eventData = JSON.parse(eventDataJson);
    console.log('Filling out cloud type and series type with data', eventData);
    this.context(BasicInfo);
    await this.page.selectCloudType(eventData.cloudType);
    await this.page.selectSeriesType(eventData.series);
  } catch (error) {
    console.error("Failed to fill out cloud type and series type:", error.message);
    throw new Error("Failed to fill out cloud type and series type:", error.message);
  }
});

Then('I fill minimum required fields such as event title, event description, date, start time, end time, timezone and venue information with {string}', async function(eventDataJson) {
  try {
    const eventData = JSON.parse(eventDataJson);
    console.log('Filling out minimum required fields with data:', eventData);
    if (this.overrideEventName) {
      logger.logHeading(`Event provided by user: ${this.overrideEventName}`)
      this.eventTitle = this.overrideEventName
    } else {
      this.eventTitle = eventData.title
    }
    console.log('Event Title:', this.eventTitle)
    this.context(BasicInfo);
    await this.page.fillRequiredFields(this.eventTitle, eventData);

  } catch (error) {
    console.error("Failed to fill minimum required fields:", error.message);
    throw new Error("Failed to fill minimum required fields:", error.message);
  }
});

Then('I Select the language for the event with language {string}', async function(language) {
  try {
    this.context(BasicInfo);
    await this.page.selectLanguage(eventData.language);
  }catch (error) {
    console.error("Failed to select language:", error.message);
    throw new Error("Failed to select language:", error.message);
  }
});


Then('I fill out the additional venue with {string}', async function(additionalInfo) {
  try {
    this.context(BasicInfo);
    await this.page.fillAdditionalVenueInfo(additionalInfo);
    logger.logInfo('Filled out additional venue information successfully');
  } catch (error) {
    console.error('Failed to fill out additional venue information:', error.message);
    throw new Error('Failed to fill out additional venue information: ' + error.message);
  }
});

Then('I click Next step multiple times', async function () {
  try {
    
    await this.page.clickNextStepButton();
    await this.page.verifyToastMessage(eventSavedToastTxt);

    const speakersAndHosts = new SpeakersAndHosts()
    this.context(EventDetailPage);
    const isSpeakersAndHostsLabelVisible = await this.page.isElementVisible(speakersAndHosts.locators.speakersAndHostsLabel, timeout=30000);
    this.context(BasicInfo);
    if (!isSpeakersAndHostsLabelVisible) {
      logger.logError("Speakers And Hosts label not displayed on page.");
    }
    else {
      logger.logInfo("Speakers And Hosts label is displayed on page.")
      await this.page.validateTextContent(speakersAndHosts.locators.speakersAndHostsLabel, "Speakers and hosts");
    }
    await this.page.clickNextStepButton();
    await this.page.verifyToastMessage(eventSavedToastTxt);

    const additionalContent = new AdditionalContent()
    this.context(EventDetailPage);
    const isAdditionalContentLabelVisible = await this.page.isElementVisible(additionalContent.locators.additionalContentLabel, timeout=30000);
    this.context(BasicInfo);
    if (!isAdditionalContentLabelVisible) {
      logger.logError("Additional Content label not displayed on page.");
    }
    else {
      logger.logInfo("Additional Content label is displayed on page.")
      await this.page.validateTextContent(additionalContent.locators.additionalContentLabel, "Additional Content");
    }
    await this.page.clickNextStepButton();
    await this.page.verifyToastMessage(eventSavedToastTxt);

    const rsvp = new Rsvp()
    this.context(EventDetailPage);
    const isRsvpLabelVisible = await this.page.isElementVisible(rsvp.locators.rsvpLabel, timeout=30000);
    this.context(BasicInfo);
    if (!isRsvpLabelVisible) {
      logger.logError("Rsvp label not displayed on page.");
    }
    else {
      logger.logInfo("Rsvp label is displayed on page.")
      await this.page.validateTextContent(rsvp.locators.rsvpLabel, "RSVP");
    }
    await this.page.clickNextStepButton();
    await this.page.verifyToastMessage(eventSavedToastTxt);

  } catch (error) {
    console.error('Failed to click Next step button multiple times:', error.message);
    throw new Error('Failed to click Next step button multiple times:', error.message);
  }

});

  Then('I should check that event is created', async function () {
  try {
    const rsvp = new Rsvp()
    this.context(EventDetailPage);
    const isAllEventsVisible = await this.page.isElementVisible(rsvp.locators.eventCreationSuccessToast, timeout=30000);
    if (!isAllEventsVisible) {
      logger.logError("Event creation Success toast is not not displayed on page.");
    }
    else {
      logger.logInfo("Event creation Success toast is displayed on page");
      this.context(Rsvp);
      await this.page.verifyEventCreationSuccessToast(eventPublishedToastTxt, eventPublishedToastGoToDashboardTxt);
    }

  } catch (error) {
    console.error("Error occured while validating created event:", error.message);
  }

  try{
    await this.page.verifyNavigationToECCDashboard();
  }catch (error) {
    logger.logError("Error occured while navigating to ECC dashboard:", error.message);
    throw new Error("Error occured while navigating to ECC dashboard:", error.message);
  }
  });

  Then('I should be able to search & validate the event on ECC dashboard', async function () {
    try {
      this.context(EventsDashboard);
      await this.page.searchEvent(BasicInfo.eventName);
      await this.page.verifyEvent(BasicInfo.eventName, Rsvp.eventId);
    } catch (error) {
      console.error("Error occured while searching for the event:", error.message);
      throw new Error("Error occured while searching for the event:", error.message);
    }
  });

  Then('I should be able to delete the event with {string}', async function(eventTitle) {
    try{
        if (this.overrideEventName) {
          logger.logHeading(`Event provided by user: ${this.overrideEventName}`)
          this.eventTitle = this.overrideEventName
        } else {
          this.eventTitle = eventTitle
        }
      this.context(EventsDashboard);
      await this.page.searchEvent(this.eventTitle);
      this.context(EventDetailPage);
      const eventsDashboard = new EventsDashboard();
      const isEventVisible = await this.page.isElementVisible(eventsDashboard.locators.eventRowByEventName(this.eventTitle));
      this.context(EventsDashboard);
      if(isEventVisible){
      await this.page.deleteEvent(this.eventTitle);
      }else{
        logger.logError("Event not found on ECC dasboard.");
      }
    }catch (error) {
      console.error("Error occured while deleting the event:", error.message);
      throw new Error("Error occured while deleting the event:", error.message);
    }
    });

  Then('I fill out create event Basic info page with {string}', async function(eventDataJson) {
    try {
      const eventData = JSON.parse(eventDataJson);
      logger.logInfo('Filling out cloud type, series type and event topics with data');
      this.context(BasicInfo);
      await this.page.selectCloudType(eventData.cloudType);
      await this.page.selectSeriesType(eventData.series);

      // Check if eventTopics is defined and split it using a comma
      if (eventData.eventTopics) {
        const eventTopics = eventData.eventTopics.split(',').map(topic => topic.trim());
        logger.logInfo('Event Topics:', eventTopics);
        await this.page.selectEventTopics(eventTopics);
      } 
      else {
        logger.logError('eventTopics is not defined in eventData');
      }

      // Handle secondary link if provided
      if (eventData.secondaryLink) {
        // Check the secondary link checkbox
        await this.page.native.locator(this.page.locators.secondaryLinkCheckbox).click();
        logger.logInfo('Clicked secondary link checkbox');

        // Fill in the secondary link label if provided
        if (eventData.secondaryLink.label) {
          await this.page.native.locator(this.page.locators.secondaryLinkLabel).fill(eventData.secondaryLink.label);
          logger.logInfo(`Filled secondary link label: ${eventData.secondaryLink.label}`);
        }

        // Fill in the secondary link URL if provided
        if (eventData.secondaryLink.url) {
          await this.page.native.locator(this.page.locators.secondaryLinkUrl).fill(eventData.secondaryLink.url);
          logger.logInfo(`Filled secondary link URL: ${eventData.secondaryLink.url}`);

          // Verify URL format
          const errorMessage = await this.page.native.locator(this.page.locators.urlErrorMessage).textContent();
          if (errorMessage.includes('Please enter a valid URL')) {
            logger.logError('Invalid URL format provided for secondary link');
            throw new Error('Invalid URL format provided for secondary link');
          }
        }
      }

      // Check if agenda is defined and fill it
      if (eventData.agenda) {
        await this.page.fillAgendaDetails(eventData.agenda);
      } else {
        logger.logWarning('agenda is not defined in eventData');
      }

      // Check if agendaPostEventCheckbox is defined and check/uncheck the checkbox
      if (eventData.agendaPostEventCheckbox) {
        await this.page.checkAgendaPostEventCheckbox(eventData.agendaPostEventCheckbox);
      } else {
        logger.logWarning('agendaPostEventCheckbox is not defined in eventData');
      }

      if (this.overrideEventName) {
        logger.logHeading(`Event provided by user: ${this.overrideEventName}`)
        this.eventTitle = this.overrideEventName
      } else {
        this.eventTitle = eventData.title
      }
      console.log('Event Title:', this.eventTitle)
      await this.page.fillRequiredFields(this.eventTitle, eventData);

    } catch (error) {
      console.error("Failed to fill out create event Basic info page with all fields:", error.message);
      throw new Error("Failed to fill out create event Basic info page with all fields:", error.message);
    }
  });

  Then('I click on Next step button', async function () {
    try {
      this.context(BasicInfo);
      await this.page.clickNextStepButton();
      await this.page.verifyToastMessage(eventSavedToastTxt);
    } catch (error) {
      console.error('Failed to click Next step button:', error.message);
      throw new Error('Failed to click Next step button: ' + error.message);
    }
  });

  Then('I fill out create event Speakers & Hosts page with {string}', async function(eventDataJson) {
    try {
      const eventData = JSON.parse(eventDataJson);
      const speakersAndHosts = new SpeakersAndHosts()
      this.context(EventDetailPage);
      const isSpeakersAndHostsLabelVisible = await this.page.isElementVisible(speakersAndHosts.locators.speakersAndHostsLabel, timeout=30000);
      this.context(BasicInfo);
      if (!isSpeakersAndHostsLabelVisible) {
        logger.logError("Speakers And Hosts label not displayed on page.");
      }
      else {
        logger.logInfo("Speakers And Hosts label is displayed on page.")
        await this.page.validateTextContent(speakersAndHosts.locators.speakersAndHostsLabel, "Speakers and hosts");
      }

      // Check if profile is defined and fill it
      this.context(SpeakersAndHosts);
      if (eventData.profile) {
        await this.page.fillSpeakersAndHostsProfile(eventData.profile);
      } else {
        logger.logWarning('profile is not defined in eventData');
      }
    } catch (error) {
      console.error("Failed to fill out create event Speakers & Hosts page with all fields:", error.message);
      throw new Error("Failed to fill out create event Speakers & Hosts page with all fields:", error.message);
    }
  });

  Then('I fill out create event Additional content page with {string}', async function(eventDataJson) {
    try {
      const eventData = JSON.parse(eventDataJson);
      const additionalContent = new AdditionalContent()
      this.context(EventDetailPage);
      const isAdditionalContentLabelVisible = await this.page.isElementVisible(additionalContent.locators.additionalContentLabel, timeout=30000);
      this.context(BasicInfo);
      if (!isAdditionalContentLabelVisible) {
        logger.logError("Additional content label not displayed on page.");
      }
      else {
        logger.logInfo("Additional content label is displayed on page.")
        await this.page.validateTextContent(additionalContent.locators.additionalContentLabel, "Additional Content");
      }

      // Check if profile is defined and fill it
      this.context(AdditionalContent);
      if (eventData.relatedProducts) {
        await this.page.fillRelatedProducts(eventData.relatedProducts);
      } else {
        logger.logWarning('relatedProducts is not defined in eventData');
      }

      // Check if includePartnersCheckbox is defined and check/uncheck the checkbox
      if (eventData.includePartnersCheckbox) {
        await this.page.checkIncludePartnersCheckbox(eventData.includePartnersCheckbox);
      } else {
        logger.logWarning('includePartnersCheckbox is not defined in eventData');
      }
        
      // Check if partner name is defined and fill it
      if (eventData.partnerName) {
        await this.page.fillPartnerName(eventData.partnerName);
      } else {
        logger.logWarning('partnerName is not defined in eventData');
      }

      // Check if partner URL is defined and fill it
      if (eventData.partnerUrl) {
        await this.page.fillPartnerUrl(eventData.partnerUrl);
      } else {  
        logger.logWarning('partnerUrl is not defined in eventData');  
      }

      // Check if partner image is defined and upload it
      if (eventData.partnerImage) {
        await this.page.uploadPartnerImage(eventData.partnerImage);
      } else {
        logger.logWarning('partnerImage is not defined in eventData');
      }

      // Click Save Partner Button
      await this.page.clickSavePartnerButton();

      // Check if hero image is defined and upload it
      if (eventData.heroImage) {
        await this.page.uploadHeroImage(eventData.heroImage);
      } else {
        logger.logWarning('heroImage is not defined in eventData');
      }

      // Check if thumbnail image is defined and upload it
      if (eventData.thumbnailImage) {
        await this.page.uploadThumbnailImage(eventData.thumbnailImage);
      } else {
        logger.logWarning('thumbnailImage is not defined in eventData');
      }

      // Check if venue image is defined and upload it
      if (eventData.venueImage) {
        await this.page.uploadVenueImage(eventData.venueImage);
      } else {
        logger.logWarning('venueImage is not defined in eventData');
      }

      // Check if venueImageCheckbox is defined and check/uncheck the checkbox
      // if (eventData.venueImageCheckbox) {
      // await this.page.checkVenueImageCheckbox(eventData.venueImageCheckbox);
      //   } else {
      // logger.logWarning('venueImageCheckbox is not defined in eventData');
      // }
    } catch (error) {
      console.error("Failed to fill out create event Additional content page with all fields:", error.message);
      throw new Error("Failed to fill out create event Additional content page with all fields:", error.message);
    }
  });

  Then('I fill out create event RSVP page with {string} and click Publish event', async function(eventDataJson) {
    try {
      const eventData = JSON.parse(eventDataJson);
      const rsvpPage = new Rsvp()
      this.context(EventDetailPage);
      const isRsvpLabelVisible = await this.page.isElementVisible(rsvpPage.locators.rsvpLabel, timeout=30000);
      this.context(BasicInfo);
      if (!isRsvpLabelVisible) {
        logger.logError("Rsvp label not displayed on page.");
      }
      else {
        logger.logInfo("Rsvp label is displayed on page.")
        await this.page.validateTextContent(rsvpPage.locators.rsvpLabel, "RSVP");
      }

      // Check if attendeeLimit is defined and fill it
      this.context(Rsvp);
      if (eventData.attendeeLimit) {
        await this.page.fillAttendeeLimit(eventData.attendeeLimit);
      } else {
        logger.logWarning('attendeeLimit is not defined in eventData');
      }

      // Check if hostEmail is defined and fill it
      if (eventData.hostEmail) {
        await this.page.fillHostEmail(eventData.hostEmail);
      } else {
        logger.logWarning('hostEmail is not defined in eventData');
      }

      // Check if rsvpFormDescription is defined and fill it
      if (eventData.rsvpFormDescription) {
        await this.page.fillRsvpFormDescription(eventData.rsvpFormDescription);
      } else {
        logger.logWarning('rsvpFormDescription is not defined in eventData');
      }

      // Check if includeOnFormFieldCategories is defined and select it
      if (eventData.includeOnFormFieldCategories) {
        await this.page.selectIncludeOnFormFieldCategories(eventData.includeOnFormFieldCategories);
      } else {
        logger.logWarning('includeOnFormFieldCategories is not defined in eventData');
      }

      // Check if makeItRequiredFieldcategories is defined and select it
      if (eventData.makeItRequiredFieldcategories) {
        await this.page.selectMakeItRequiredFieldcategories(eventData.makeItRequiredFieldcategories);
      } else {
        logger.logWarning('makeItRequiredFieldcategories is not defined in eventData');
      }

      //Check Terms and Conditions checkbox
     //await this.page.checkTermsAndConditionsCheckbox();
      
      // Click Publish Event Button
      this.context(BasicInfo);
      await this.page.clickNextStepButton();
      await this.page.verifyToastMessage(eventSavedToastTxt);
      
      } catch (error) {
        console.error("Failed to fill out create event Rsvp page with all fields and click Publish event:", error.message);
        throw new Error("Failed to fill out create event Rsvp page with all fields and click Publish event:", error.message);
      }
  });

  Then('I should get the error toast message', async function () {
    try {
      this.context(Rsvp);
      await this.page.verifyErrorToast();
    } catch (error) {
      console.error("Error occured while searching for the event:", error.message);
      throw new Error("Error occured while searching for the event:", error.message);
    }
  });
