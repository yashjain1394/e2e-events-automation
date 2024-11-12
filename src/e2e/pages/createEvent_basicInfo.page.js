const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const { EventDetailPage } = require('./eventDetails.page.js');
const logger = new Logger();
const { convertTimeToValue, getTimeWithoutPeriod, getPeriodFromTime } = require('../common-utils/helper.js');

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
            eventTitle: '//*[@placeholder="Event title"]',
            eventDescription: '//*[@placeholder="Event description"]',
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
            venueName: '//*[@placeholder="Venue name"]',
            firstVenueNameOption: '.pac-item:first-child',
            venueInfoWillAppearPostEventCheckbox: 'sp-checkbox[id="checkbox-venue-info-visible"]',
            nextStepButtonEnabled: '//a[contains(@class, "next-button") and not(contains(@class, "disabled"))]',
            eventTopicsCheckbox: (name) => `//*[@id="form-step-basic-info"]//sp-checkbox[@name="${name}"]`,
            communityLinkCheckbox: 'sp-checkbox#checkbox-community',
            communityUrlField: 'sp-textfield#community-url-details',
            addAgendaTimeAndDetailsPanel: 'repeater-element[text="Add agenda time and details"]',
            agendaFieldsetGroup: 'agenda-fieldset-group',
            agendaFieldset: 'agenda-fieldset',
            agendaTime: 'sp-picker[label="Pick agenda time"]',
            agendaTimePeriod: 'sp-picker[label="AM/PM"]',
            agendaTimeOption: (time) => `sp-menu-item[value="${getTimeWithoutPeriod(time)}"]`,
            agendaTimePeriodOption: (time) => `sp-menu-item[value="${getPeriodFromTime(time)}"]`,
            agendaDetails: 'sp-textfield[placeholder="Add Agenda details"]',
            agendaPostEventCheckbox: 'sp-checkbox#checkbox-agenda-info',
            
        };
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

    async getHandleInsideShadowRoot(shadowHostSelectorOrHandle, innerSelector) {
        try {
            let shadowHostHandle;
    
            // Check if shadowHostSelectorOrHandle is a string or a JSHandle
            if (typeof shadowHostSelectorOrHandle === 'string') {
                // Get the handle of the shadow host element
                shadowHostHandle = await this.native.locator(shadowHostSelectorOrHandle).elementHandle();
                if (!shadowHostHandle) {
                    throw new Error(`Element handle not found for selector: ${shadowHostSelectorOrHandle}`);
                }
            } else {
                // Use the provided JSHandle directly
                shadowHostHandle = shadowHostSelectorOrHandle;
            }
    
            // Ensure the shadow host element has a shadow root
            const hasShadowRoot = await shadowHostHandle.evaluate(element => !!element.shadowRoot);
            if (!hasShadowRoot) {
                throw new Error(`Element does not have a shadow root: ${shadowHostSelectorOrHandle}`);
            }

            // Print the DOM inside the shadow root
            // const shadowRootHTML = await shadowHostHandle.evaluate(element => element.shadowRoot.innerHTML);
            // console.log(`Shadow root DOM for selector ${shadowHostSelectorOrHandle}:`, shadowRootHTML);
    
            // Evaluate and access the shadow DOM root of the host element
            const innerHandle = await shadowHostHandle.evaluateHandle((element, selector) => {
                return element.shadowRoot.querySelector(selector);
            }, innerSelector);
    
            if (!innerHandle) {
                throw new Error(`Inner handle not found in shadow DOM for selector: ${innerSelector}`);
            }
    
            return innerHandle;
    
        } catch (error) {
            console.error(`Error in getHandleInsideShadowRoot: ${error.message}`);
            throw new Error(`Failed to get handle inside shadow DOM for selectors: ${shadowHostSelectorOrHandle}, ${innerSelector}`);
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
   
    async fillRequiredFields(eventData) {
        try{
            if (this.overrideEventName) {
                logger.logHeading(`Event provided by user: ${this.overrideEventName}`)
                this.eventName = this.overrideEventName
              } else {
                this.eventName = eventData.title
              }
            const titleInput = await this.getHandleInsideShadowRoot(this.locators.eventTitle,'input');
            await titleInput.type(this.eventName);

            BasicInfo.eventName = eventData.title;

            const descriptionInput = await this.getHandleInsideShadowRoot(this.locators.eventDescription,'textarea');
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

            const venueInput = await this.getHandleInsideShadowRoot(this.locators.venueName,'input');
            await venueInput.type(eventData.venue);

            await this.native.locator(this.locators.firstVenueNameOption).waitFor({ state: 'visible' });

            await this.native.locator(this.locators.firstVenueNameOption).click();

            if(eventData.venueInfoWillAppearPostEvent && eventData.venueInfoWillAppearPostEvent.toLowerCase() === "checked"){
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

    async clickCreateNextStepButton() {
        try {
            // Wait for the enabled Next Step button to be visible and enabled
            await this.native.locator(this.locators.nextStepButtonEnabled).waitFor({ state: 'visible' });
            
            // Click the enabled Next Step button
            await this.native.locator(this.locators.nextStepButtonEnabled).click();
            
            logger.logInfo('Next Step button clicked successfully.');
        } catch (error) {
            logger.logError(`Failed to click the Next Step button: ${error.message}`);
            throw new Error(`Failed to click the Next Step button: ${error.message}`);
        }
    }

    async checkCommunityLinkCheckbox(communityLink) {
        try {

            if(communityLink.toLowerCase() === "checked"){
            const checkboxLocator = await this.getHandleInsideShadowRoot(this.locators.communityLinkCheckbox,'input');
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
            const urlFieldLocator = await this.getHandleInsideShadowRoot(this.locators.communityUrlField,'input');
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
                    const addAgendaTimeAndDetailsPanelLocator = await this.getHandleInsideShadowRoot(agendaFieldsetGroupLocator, this.locators.addAgendaTimeAndDetailsPanel);
                    const addAgendaButtonLocator = await this.getHandleInsideShadowRoot(addAgendaTimeAndDetailsPanelLocator, 'img');
                    logger.logInfo('Clicking the Add Agenda button');
                    await addAgendaButtonLocator.click();
                }
    
                // Locate the nth agenda fieldset within the shadow root
            const agendaFieldsetLocator = await agendaFieldsetGroupLocator.evaluateHandle((el, index) => {
                const shadowRoot = el.shadowRoot;
                return shadowRoot.querySelectorAll('agenda-fieldset')[index];
            }, i);

                // Fill the agenda time
                const agendaTimeLocator = await this.getHandleInsideShadowRoot(agendaFieldsetLocator, this.locators.agendaTime);
                await agendaTimeLocator.click();

                // Use a more specific locator for the time option
                const agendaTimeOptionLocator = await this.getHandleInsideShadowRoot(agendaFieldsetLocator, this.locators.agendaTimeOption(item.startTime));
                if (!agendaTimeOptionLocator) {
                    throw new Error('Agenda time option not found');
                }
                await agendaTimeOptionLocator.click();

                // Fill the agenda time period
                const agendaTimePeriodLocator = await this.getHandleInsideShadowRoot(agendaFieldsetLocator, this.locators.agendaTimePeriod);
                await agendaTimePeriodLocator.click();

                // Use a more specific locator for the time period option
                const agendaTimePeriodOptionLocator = await this.getHandleInsideShadowRoot(agendaFieldsetLocator, this.locators.agendaTimePeriodOption(item.startTime));
                if (!agendaTimePeriodOptionLocator) {
                    throw new Error('Agenda time period option not found');
                }
                await agendaTimePeriodOptionLocator.click();

                // Fill the agenda details
                const agendaDetailsLocator = await this.getHandleInsideShadowRoot(agendaFieldsetLocator, this.locators.agendaDetails);
                const agendaDetailsInputLocator = await this.getHandleInsideShadowRoot(agendaDetailsLocator, 'input');
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