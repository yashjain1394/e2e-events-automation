const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const { EventDetailPage } = require('./eventDetails.page.js');
const logger = new Logger();
const { getTimeWithoutPeriod, getPeriodFromTime } = require('../common-utils/helper.js');
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
            eventTopicsCheckbox: (name) => `//*[@id="form-step-basic-info"]//sp-checkbox[@name="${name}"]`,
            communityLinkCheckbox: 'sp-checkbox[name="checkbox-community"] input[name="checkbox-community"]',
            communityUrlField: 'sp-textfield[placeholder="Add Community URL"] input[placeholder="Add Community URL"]',
            addAgendaTimeAndDetailsPanel: 'agenda-fieldset-group repeater-element[text="Add agenda time and details"]',
            agendaFieldsetGroup: 'agenda-fieldset-group',
            agendaFieldset: 'agenda-fieldset',
            agendaTime: (index) => `agenda-fieldset-group agenda-fieldset:nth-of-type(${index+1}) sp-picker[label="Pick agenda time"]`,
            agendaTimePeriod: (index) => `agenda-fieldset-group agenda-fieldset:nth-of-type(${index+1}) sp-picker[label="AM/PM"]`,
            agendaTimeOption: (index, time) => `agenda-fieldset-group agenda-fieldset:nth-of-type(${index+1}) sp-menu-item[value="${getTimeWithoutPeriod(time)}"]`,
            agendaTimePeriodOption: (index, time) => `agenda-fieldset-group agenda-fieldset:nth-of-type(${index+1}) sp-menu-item[value="${getPeriodFromTime(time)}"]`,
            agendaDetails: (index) => `agenda-fieldset-group agenda-fieldset:nth-of-type(${index+1}) sp-textfield[placeholder="Add Agenda details"] input[placeholder="Add Agenda details"]`,
            agendaPostEventCheckbox: 'sp-checkbox[id="checkbox-agenda-info"] input[name="checkbox-agenda-info-name"]', 
            failureToast: 'sp-toast[variant="negative"]',
            toastDismiss: 'sp-close-button[label="Close"]',
            successToast: 'sp-toast.save-success-msg[variant="positive"]',
            
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
        
    } catch (error) {
        console.error(`Error in selecting Cloud Type: ${error.message}`);
        throw new Error(`Error in selecting Cloud Type: ${error.message}`);
    }
    }

    async selectSeriesType(seriesType) {
        try{
        await this.native.locator(this.locators.seriesTypeDropdown).click()
        if(seriesType === "automate"){
            seriesType == this.seriesName
        }
        await this.native.locator(this.locators.seriesTypeOption(seriesType)).click()
        
    } catch (error) {
        console.error(`Error in selecting Series Type: ${error.message}`);
        throw new Error(`Error in selecting Series Type: ${error.message}`);
    }
    }

    async selectEventTopics(eventTopics) {
        try {
            if (!Array.isArray(eventTopics)) {
                throw new Error("eventTopics should be an array");
            }

            for (const topic of eventTopics) {
                const trimmedTopic = topic.trim();
                const checkboxLocator = this.native.locator(this.locators.eventTopicsCheckbox(trimmedTopic));
                logger.logInfo(`Selecting checkbox for topic: ${trimmedTopic}`);

                // Click the checkbox
                await checkboxLocator.click();

                logger.logInfo(`Selected checkbox for topic: ${trimmedTopic}`);
            }
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
            // Wait for the enabled Next Step button to be visible and enabled
            await this.native.locator(this.locators.nextStepButtonEnabled).waitFor({ state: 'visible' });
            
            // Click the enabled Next Step button
            await this.native.locator(this.locators.nextStepButtonEnabled).click();
            logger.logInfo('Next Step button clicked.');
            }catch (error) {
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
            const agendaFieldsetGroupLocator = this.native.locator(this.locators.agendaFieldsetGroup);
    
            for (let i = 0; i < agenda.length; i++) {
                const item = agenda[i];
    
                // Click the Add Agenda button if there are multiple items
                if (i > 0) {
                    const addAgendaTimeAndDetailsPanelLocator = this.native.locator(this.locators.addAgendaTimeAndDetailsPanel);
                    logger.logInfo('Clicking the Add Agenda button');
                    await addAgendaTimeAndDetailsPanelLocator.click();
                }
    
                // Fill the agenda time
                const agendaTimeLocator = await this.native.locator(this.locators.agendaTime(i));
                await agendaTimeLocator.click();

                // Use a more specific locator for the time option
                const agendaTimeOptionLocator = this.native.locator(this.locators.agendaTimeOption(i,item.startTime));
                
                if (!agendaTimeOptionLocator) {
                    throw new Error('Agenda time option not found');
                }
                await agendaTimeOptionLocator.click();

                // Fill the agenda time period
                const agendaTimePeriodLocator = await this.native.locator(this.locators.agendaTimePeriod(i));
                await agendaTimePeriodLocator.click();

                // Use a more specific locator for the time period option
                const agendaTimePeriodOptionLocator = this.native.locator(this.locators.agendaTimePeriodOption(i, item.startTime));
                if (!agendaTimePeriodOptionLocator) {
                    throw new Error('Agenda time period option not found');
                }
                await agendaTimePeriodOptionLocator.click();

                // Fill the agenda details
                const agendaDetailsInputLocator = await this.native.locator(this.locators.agendaDetails(i));
                if (!agendaDetailsInputLocator) {
                    throw new Error('Agenda details field not found');
                }
                await agendaDetailsInputLocator.fill(item.description);
    
                logger.logInfo(`Agenda item with start time ${item.startTime} and description "${item.description}" filled successfully`);
            }
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
}
module.exports = { BasicInfo };