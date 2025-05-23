const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const { EventDetailPage } = require('./eventDetails.page.js');
const logger = new Logger();
const { getTimeWithoutPeriod, getPeriodFromTime, getFilePath } = require('../common-utils/helper.js');
const { timeout } = require('puppeteer');

class BasicInfo extends EventsBasePage {
    static eventName = null; // Static variable to store eventTitle

    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            basicInfoLabel: '//*[@id="basic-info"]',
            cloudTypeDropdown: '//*[@id="bu-select-input"]',
            seriesTypeDropdown: '//*[@id="series-select-input"]',
            cloudTypeOption: (value) => `//sp-picker[@id='bu-select-input']//sp-menu-item[text()='${value}']`,
            seriesTypeOption: (value) => `//sp-picker[@id='series-select-input']//sp-menu-item[text()='${value}']`,
            eventTitle: 'sp-textfield[placeholder="Event title"] input[placeholder="Event title"]',
            eventDescription: 'sp-textfield[placeholder="Event description"] textarea[placeholder="Event description"]',
            eventDate: '//*[@name="event-date"]',
            enabledDatesClass: '.calendar-day:not(.disabled):not(.empty)',
            iconCalendar: '//*[@class="icon icon-calendar-add"]',
            startTime: '//*[@id="time-picker-start-time"]',
            endTime: '//*[@id="time-picker-end-time"]',
            startTimePeriod: '//*[@id="ampm-picker-start-time"]',
            endTimePeriod: '//*[@id="ampm-picker-end-time"]',
            timezone: '//*[@id="time-zone-select-input"]',
            startTimeOption: (time) => `//sp-picker[@id='time-picker-start-time']//sp-menu-item[text()='${getTimeWithoutPeriod(time)}']`,
            startTimePeriodOption: (time) => `//sp-picker[@id='ampm-picker-start-time']//sp-menu-item[text()='${getPeriodFromTime(time)}']`,
            endTimeOption: (time) => `//sp-picker[@id='time-picker-end-time']//sp-menu-item[text()='${getTimeWithoutPeriod(time)}']`,
            endTimePeriodOption: (time) => `//sp-picker[@id='ampm-picker-end-time']//sp-menu-item[text()='${getPeriodFromTime(time)}']`,
            timezoneOption: (timezone) => `//sp-picker[@id='time-zone-select-input']//sp-menu-item[text()='${timezone}']`,
            venueName: 'sp-textfield[placeholder="Venue name"] input[placeholder="Venue name"]',
            firstVenueNameOption: '.pac-item:first-child',
            venueInfoWillAppearPostEventCheckbox: 'sp-checkbox[id="checkbox-venue-info-visible"]',
            nextStepButtonEnabled: '//a[contains(@class, "next-button") and not(contains(@class, "disabled"))]',
            eventTopicsCheckbox: (name) => `//*[@id="form-step-basic-info"]//sp-action-button[@name="${name}"]`,
            communityLinkCheckbox: 'sp-checkbox[name="checkbox-community"] input[name="checkbox-community"]',
            communityUrlField: 'sp-textfield[placeholder="Add Community URL"] input[placeholder="Add Community URL"]',
            addAgendaTimeAndDetailsPanel: 'agenda-fieldset-group repeater-element[text="Add agenda time and details"]',
            agendaFieldsetGroup: 'agenda-fieldset-group',
            agendaFieldset: 'agenda-fieldset',
            agendaTimePicker: 'sp-picker.time-picker-input',
            agendaTimePeriod: 'sp-picker[label="AM/PM"]',
            agendaTitle: 'sp-textfield[placeholder="Add agenda title"] input[placeholder="Add agenda title"]',
            agendaDetails: 'div.agenda-container div[contenteditable="true"].tiptap.ProseMirrors',
            agendaTimeOption: (time) => `sp-menu-item[value="${getTimeWithoutPeriod(time)}"]`,
            agendaTimePeriodOption: (time) => `sp-menu-item[value="${getPeriodFromTime(time)}"]`,
            agendaPostEventCheckbox: 'sp-checkbox[id="checkbox-agenda-info"] input[name="checkbox-agenda-info-name"]',
            failureToast: 'sp-toast[variant="negative"]',
            toastDismiss: 'sp-close-button[label="Close"]',
            successToast: 'sp-toast.save-success-msg[variant="positive"]',
            languageDropdown: '//*[@id="language-picker"]',
            languageOption: (language) => `//sp-menu-item[@value='${language}' and @role='option']`,
            venueAdditionalInfoImageDropzone: 'image-dropzone[id="add-imagefile-dimensions-1920px-wide."] input.img-file-input',
            venueAdditionalInfoRTE: 'input[id="venue-additional-info-rte-output"]',
            venueAdditionalInfoCheckbox: 'sp-checkbox[id="checkbox-venue-additional-info-visible"]',
            
        };
    }

    async isElementVisible(elementLocator, timeout = 2000) {
        try {
            const element = await this.native.waitForSelector(elementLocator, { timeout });
            const isVisible = await element.isVisible();
            expect(isVisible).toBe(true);
            return true;
        } catch (error) {
            console.error(`Element located by ${elementLocator} was not visible within ${timeout} ms: ${error.message}`);
            return false;
        }
    }

    async selectCloudType(cloudType) {
        try{
            await this.native.locator(this.locators.cloudTypeDropdown).click()
            await this.native.locator(this.locators.cloudTypeOption(cloudType)).click()
            
            // Wait for series dropdown to be visible after cloud type selection
            await this.native.locator(this.locators.seriesTypeDropdown).waitFor({ state: 'visible', timeout: 5000 });
            // Add a small pause to ensure the dropdown is fully interactive
            await this.native.waitForTimeout(1000);
            
        } catch (error) {
            console.error(`Error in selecting Cloud Type: ${error.message}`);
            throw new Error(`Error in selecting Cloud Type: ${error.message}`);
        }
    }

    async selectSeriesType(seriesType) {
        try{
        await this.native.locator(this.locators.seriesTypeDropdown).click()
        await this.native.locator(this.locators.seriesTypeOption(seriesType)).click()
        
    } catch (error) {
        console.error(`Error in selecting Series Type: ${error.message}`);
        throw new Error(`Error in selecting Series Type: ${error.message}`);
    }
    }

    async selectEventTopics(eventTopics) {
        try {
            // Find all topic buttons within the checkbox-wrapper
            const topicButtons = this.native.locator('.checkbox-wrapper sp-action-button');
            
            // Get count of topic buttons
            const count = await topicButtons.count();
            
            // If no topics found, log and return
            if (count === 0) {
                logger.logInfo('No event topics found on the page');
                return;
            }

            // Click each topic button
            for (let i = 0; i < count; i++) {
                const button = topicButtons.nth(i);
                const topicName = await button.getAttribute('name');
                
                await button.click();
                logger.logInfo(`Selected topic: ${topicName}`);
            }

            logger.logInfo(`Successfully selected all ${count} event topics`);
        } catch (error) {
            logger.logError(`Error in selecting event topics: ${error.message}`);
            throw new Error(`Error in selecting event topics: ${error.message}`);
        }
    }


    async selectDate(startDate, endDate) {
        try {
            // Open the date picker
            await this.openDatePicker();
    
            // Locator for enabled dates
            const enabledDatesLocator = this.native.locator(this.locators.enabledDatesClass);
    
            // Get all enabled date elements
            const enabledDatesElements = await enabledDatesLocator.elementHandles();
    
            // Get all enabled dates as an array of strings
            const enabledDates = await Promise.all(enabledDatesElements.map(async (el) => {
                const date = await el.getAttribute('data-date');
                return date ? date : '';
            }));
    
            console.log(`Enabled dates: ${enabledDates.join(', ')}`);
    
            // Check if the provided startDate or endDate is enabled
            if(enabledDates.includes(startDate)==false || enabledDates.includes(endDate)==false){
                startDate=enabledDates[0]
                endDate=enabledDates[0]
                logger.logWarning(`Start date or end date is not enabled, selecting the first available date: ${startDate}.`);
            }
    
            // Log selected dates
            logger.logInfo(`Selected start date: ${startDate}, Selected end date: ${endDate}`);
    
            // Click on the selected start date
            const enabledStartDate = await this.native.locator(`.calendar-day:not(.disabled):not(.empty)[data-date="${startDate}"]`);
            await enabledStartDate.click();
    
            // Click on the selected end date
            const enabledEndDate = await this.native.locator(`.calendar-day:not(.disabled):not(.empty)[data-date="${endDate}"]`);
            await enabledEndDate.click();
    
        } catch (error) {
            console.error(`Error selecting date: ${error.message}`);
            throw new Error(`Error selecting date: ${error.message}`);
        }
    }
    

    async openDatePicker() {
        try {
            await this.native.locator(this.locators.iconCalendar).click();
            // Optionally, wait for the date picker to be visible after clicking the icon
            await this.native.waitForSelector('.calendar-day', { state: 'visible' });
        } catch (error) {
            console.error(`Error opening date picker: ${error.message}`);
            throw new Error(`Error opening date picker: ${error.message}`);
        }
    }
   async selectLanguage(language) {
    try {
        await this.native.locator(this.locators.languageDropdown).click();
        await this.native.locator(this.locators.languageOption(language)).click();
    } catch (error) {
        console.error(`Error selecting language: ${error.message}`);
   }
    }
    async fillRequiredFields(eventTitleName, eventData) {
        try{
            const titleInput = this.native.locator(this.locators.eventTitle);
            await titleInput.type(eventTitleName);

            BasicInfo.eventName = eventTitleName;

            const descriptionInput = this.native.locator(this.locators.eventDescription);
            await descriptionInput.type(eventData.description);

            await this.selectDate(eventData.startDate, eventData.endDate);

            await this.native.locator(this.locators.startTime).click()
            await this.native.locator(this.locators.startTimeOption(eventData.startTime)).click()
            await this.native.locator(this.locators.startTimePeriod).click()
            await this.native.locator(this.locators.startTimePeriodOption(eventData.startTime)).click()

            await this.native.locator(this.locators.endTime).click()
            await this.native.locator(this.locators.endTimeOption(eventData.endTime)).click()
            await this.native.locator(this.locators.endTimePeriod).click()
            await this.native.locator(this.locators.endTimePeriodOption(eventData.endTime)).click()

            await this.native.locator(this.locators.timezone).click()
            await this.native.locator(this.locators.timezoneOption(eventData.timezone)).click()

            // Select language if provided
            if (eventData.language) {
                await this.selectLanguage(eventData.language);
                logger.logInfo(`Language ${eventData.language} selected successfully`);
            }

            const venueInput = await this.native.locator(this.locators.venueName);
            await venueInput.click();
            await venueInput.type(eventData.venue);

            await this.native.locator(this.locators.firstVenueNameOption).waitFor({ state: 'visible' });

            await this.native.locator(this.locators.firstVenueNameOption).click();

            if(eventData.venueInfoWillAppearPostEventCheckbox && eventData.venueInfoWillAppearPostEventCheckbox.toLowerCase() === "checked"){
                await this.native.locator(this.locators.venueInfoWillAppearPostEventCheckbox).click();
                logger.logInfo('Checked checkbox and Venue info will appear post event');
            }else{
                logger.logInfo('Checkbox not checked and Venue info will not appear post event');
            }
        
    } catch (error) {
        console.error(`Error in filling Minimum Required Fields: ${error.message}`);
        throw new Error(`Error in filling Minimum Required Fields: ${error.message}`);
    }
    }

    async clickNextStepButton() {
        try {
            const nextButton = this.native.locator(this.locators.nextStepButtonEnabled);
            await nextButton.waitFor({ state: 'visible', timeout: 10000 });
            await nextButton.click();
            logger.logInfo('Next Step button clicked successfully.');
        } catch (error) {
            logger.logError(`Failed to click the Next Step button: ${error.message}`);
            throw new Error(`Failed to click the Next Step button: ${error.message}`);
        }
    }

    async verifyToastMessage(eventSavedToastTxt) {
        // Check if success or failure toast appears
        try{
            logger.logInfo('Checking for success toast...');
            const successToastLocator = this.native.locator(this.locators.successToast);
            const isSucessToastVisible = await this.isElementVisible(this.locators.successToast, 10000);
            if (isSucessToastVisible) {
                const confirmationMessage = await successToastLocator.textContent();
                logger.logInfo(`Sucess toast message: ${confirmationMessage}`);
                if (confirmationMessage.includes(eventSavedToastTxt)) {
                logger.logInfo('Success toast appeared with correct message.');
                } else {
                logger.logWarning('Success toast message is incorrect.');
                }
             }
             else{
                const failureToastLocator = this.native.locator(this.locators.failureToast);
                const isFailureToastVisible = await this.isElementVisible(this.locators.failureToast, 10000);
                if(isFailureToastVisible){
                const failureMessage = await failureToastLocator.textContent();
                logger.logWarning(`Failure toast message: ${failureMessage}`); 
                // Dismiss the failure toast
                await this.native.locator(this.locators.toastDismiss).click();
                logger.logWarning('Failure toast dismissed');
                // Click the Next Step button again
                await this.native.locator(this.locators.nextStepButtonEnabled).click();
                logger.logWarning('Next Step button clicked successfully after dismissing the failure toast');
                }
                else{
                // Click the Next Step button again
                await this.native.locator(this.locators.nextStepButtonEnabled).click();
                logger.logWarning('Sucess & Failure toast does not appear. Therefore, Next Step button clicked again');
                }
             } 
        }catch (error) {
            logger.logError(`Failed to get the success/failure toast message: ${error.message}`);
            throw new Error(`Failed to get the sucess/failure toast message: ${error.message}`);
        }
    }

    async checkCommunityLinkCheckbox(communityLink) {
        try {

            if(communityLink.toLowerCase() === "checked"){
            const checkboxLocator = this.native.locator(this.locators.communityLinkCheckbox);
            logger.logInfo('Checking the community link checkbox');

            // Click the checkbox
            await checkboxLocator.click();

            logger.logInfo('Community link checkbox checked successfully');
            }else{
                logger.logInfo('Community link checkbox is not checked');
            }
        } catch (error) {
            logger.logError(`Error in checking the community link checkbox: ${error.message}`);
            throw new Error(`Error in checking the community link checkbox: ${error.message}`);
        }
    }

    async fillCommunityUrl(communityUrl) {
        try {
            const urlFieldLocator = this.native.locator(this.locators.communityUrlField);
            logger.logInfo('Filling the community URL field');

            // Fill the URL field
            await urlFieldLocator.fill(communityUrl);

            logger.logInfo('Community URL field filled successfully');
        } catch (error) {
            logger.logError(`Error in filling the community URL field: ${error.message}`);
            throw new Error(`Error in filling the community URL field: ${error.message}`);
        }
    }

    async fillAgendaDetails(agenda) {
        try {
            // Wait for the agenda component to be present
            const agendaGroup = this.native.locator(this.locators.agendaFieldsetGroup);
            await agendaGroup.waitFor({ state: 'visible' });

            for (let i = 0; i < agenda.length; i++) {
                const item = agenda[i];

                // If this isn't the first item, we need to add a new agenda section
                if (i > 0) {
                    logger.logInfo('Adding new agenda item');
                    await this.native.locator(this.locators.addAgendaTimeAndDetailsPanel).click();
                    // Wait for the new agenda section to be added
                    await this.native.waitForTimeout(500);
                }

                // Get the current agenda fieldset
                const currentFieldset = agendaGroup.locator(this.locators.agendaFieldset).nth(i);
                
                // Handle Time Selection - similar to fillRequiredFields method
                const timePicker = currentFieldset.locator(this.locators.agendaTimePicker);
                await timePicker.waitFor({ state: 'visible' });
                await timePicker.click();
                
                // Select time using the same pattern as event time selection
                const timeLocator = currentFieldset.locator(this.locators.agendaTimeOption(item.startTime));
                await timeLocator.waitFor({ state: 'visible' });
                await timeLocator.click();
                
                // Handle AM/PM Selection - similar to event time AM/PM selection
                const periodPicker = currentFieldset.locator(this.locators.agendaTimePeriod);
                await periodPicker.waitFor({ state: 'visible' });
                await periodPicker.click();
                
                const periodLocator = currentFieldset.locator(this.locators.agendaTimePeriodOption(item.startTime));
                await periodLocator.waitFor({ state: 'visible' });
                await periodLocator.click();
                
                const title = this.native.locator(this.locators.agendaTitle).nth(i);
                await title.waitFor({ state: 'visible' });
                await title.fill(item.title);

                const details = this.native.locator(this.locators.agendaDetails).nth(i);
                await details.waitFor({ state: 'visible' });
                await details.fill(item.details);


                logger.logInfo(`Set time for agenda item ${i + 1} to ${item.startTime}`);
            }

            logger.logInfo(`Successfully filled all ${agenda.length} agenda items`);
        } catch (error) {
            logger.logError(`Error in filling the agenda details: ${error.message}`);
            throw new Error(`Error in filling the agenda details: ${error.message}`);
        }
    }

    async checkAgendaPostEventCheckbox(agendaPostEvent) {
        try {
            if(agendaPostEvent.toLowerCase() === "checked"){
            const agendaPostEventCheckboxLocator = this.native.locator(this.locators.agendaPostEventCheckbox);
            logger.logInfo('Checking the agenda post event checkbox');

            // Click the checkbox
            await agendaPostEventCheckboxLocator.click();

            logger.logInfo('Agenda post event checkbox checked successfully');
            }else{
                logger.logInfo('Agenda post event checkbox is not checked');
            }
        } catch (error) {
            logger.logError(`Error in checking the agenda post event checkbox: ${error.message}`);
            throw new Error(`Error in checking the agenda post event checkbox: ${error.message}`);
        }
    }

    async validateTextContent(locator, expectedText) {
        try {
            // Fetch the text content of the element
            const elementText = await this.native.locator(locator).innerText();
            logger.logInfo(`Actual text: ${elementText}`);
    
            // Validate the text content of the element
            expect(elementText).toBe(expectedText);
            logger.logInfo(`Expected text: ${expectedText}`);
            logger.logInfo("Element text is correct");
        } catch (error) {
            logger.logError(`Error occurred while verifying the text content: ${error.message}`);
            throw new Error(`Error occurred while verifying the text content: ${error.message}`);
        }
    }

    async fillAdditionalVenueInfo(additionalInfo) {
        try {
            // Upload image
            const imageInputLocator = this.native.locator(this.locators.venueAdditionalInfoImageDropzone);

            const additionalInfoImagePath = await getFilePath("https://cormenfornh.com/Headshot-small.jpg");
            await imageInputLocator.setInputFiles(additionalInfoImagePath);

            logger.logInfo('Uploaded venue additional info image');

            //TODO Fill rich text editor
            // const rteLocator = this.native.locator(this.locators.venueAdditionalInfoRTE);
            // await rteLocator.click();
            // await rteLocator.type(additionalInfo);
            // logger.logInfo('Filled venue additional info text');

            // Check the checkbox to make it visible post-event
            const checkboxLocator = this.native.locator(this.locators.venueAdditionalInfoCheckbox);
            await checkboxLocator.click();
            logger.logInfo('Checked venue additional info visibility checkbox');

        } catch (error) {
            logger.logError(`Error in filling additional venue information: ${error.message}`);
            throw new Error(`Error in filling additional venue information: ${error.message}`);
        }
    }
   
}
module.exports = { BasicInfo };