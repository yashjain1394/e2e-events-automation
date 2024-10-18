const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class BasicInfo extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            basicInfoLabel: '//*[@id="basic-info"]',
            cloudTypeDropdown: '//*[@id="bu-select-input"]',
            seriesTypeDropdown: '//*[@id="series-select-input"]',
            eventTopicsCheckbox: '//div[@class="event-topics-component form-component"]/div/sp-checkbox',
            cloudTypeOption: (value) => `//sp-picker[@id='bu-select-input']//sp-menu-item[text()='${value}']`,
            seriesTypeOption: (value) => `//sp-picker[@id='series-select-input']//sp-menu-item[text()='${value}']`,
            eventTitle: '//*[@placeholder="Event title"]',
            eventDescription: '//*[@placeholder="Event description"]',
            eventDate: '//*[@name="event-date"]',
            iconCalendar: '//*[@class="icon icon-calendar-add"]',
            startTime: '//*[@id="time-picker-start-time"]',
            endTime: '//*[@id="time-picker-end-time"]',
            timezone: '//*[@id="time-zone-select-input"]',
            startTimeOption: (value) => `//sp-picker[@id='time-picker-start-time']//sp-menu-item[text()='${value}']`,
            endTimeOption: (value) => `//sp-picker[@id='time-picker-end-time']//sp-menu-item[text()='${value}']`,
            timezoneOption: (value) => `//sp-picker[@id='time-zone-select-input']//sp-menu-item[text()='${value}']`,
            venueName: '//*[@placeholder="Venue name"]',
            firstVenueNameOption: '.pac-item:first-child',
            nextStepButtonEnabled: '//a[contains(@class, "next-button") and not(contains(@class, "disabled"))]'





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

    // Function to get input handle inside shadow DOM
    async getInputHandleInsideInputShadowRoot(selector) {
        try {
            // Get the handle of the shadow host element
            const textFieldHandle = await this.native.locator(selector).elementHandle();
            if (!textFieldHandle) {
                throw new Error(`Element handle not found for selector: ${selector}`);
            }

            // Evaluate and access the shadow DOM root of the host element
            const inputHandle = await textFieldHandle.evaluateHandle((element) => {
                return element.shadowRoot.querySelector('input');
            });

            if (!inputHandle) {
                throw new Error(`Input handle not found in shadow DOM for selector: ${selector}`);
            }

            return inputHandle;

        } catch (error) {
            console.error(`Error in getInputHandleInsideShadowRoot: ${error.message}`);
            throw new Error(`Failed to get input handle inside shadow DOM for selector: ${selector}`);
        }
    }

    async getInputHandleTextAreaShadowRoot(selector) {
        try {
            // Get the handle of the shadow host element
            const textFieldHandle = await this.native.locator(selector).elementHandle();
            if (!textFieldHandle) {
                throw new Error(`Element handle not found for selector: ${selector}`);
            }

            // Evaluate and access the shadow DOM root of the host element
            const inputHandle = await textFieldHandle.evaluateHandle((element) => {
                return element.shadowRoot.querySelector('textarea');
            });

            if (!inputHandle) {
                throw new Error(`Input handle not found in shadow DOM for selector: ${selector}`);
            }

            return inputHandle;

        } catch (error) {
            console.error(`Error in getInputHandleInsideShadowRoot: ${error.message}`);
            throw new Error(`Failed to get input handle inside shadow DOM for selector: ${selector}`);
        }
    }


    async selectDate(startDate, endDate) {
        try {
            // Open the date picker
            await this.openDatePicker();
    
            // Locator for enabled dates
            const enabledDatesLocator = this.native.locator('.calendar-day:not(.disabled)');
    
            // Get all enabled date elements
            const enabledDatesElements = await enabledDatesLocator.elementHandles();
    
            // Get all enabled dates as an array of strings
            const enabledDates = await Promise.all(enabledDatesElements.map(async (el) => {
                const date = await el.getAttribute('data-date');
                return date ? date.split('-')[2] : '';
            }));
            
            console.log(`Enabled dates: ${enabledDates.join(', ')}`);
    
            // Check if the provided startDate is enabled
            let selectedStartDate = enabledDates.includes(startDate) ? startDate : enabledDates[0];
            if (selectedStartDate !== startDate) {
                console.warn(`Start date ${startDate} is not enabled, selecting the first available date: ${selectedStartDate}.`);
            }
    
            // Check if the provided endDate is enabled
            let selectedEndDate = enabledDates.includes(endDate) ? endDate : null;
            if (!selectedEndDate) {
                // Find the next enabled date after the start date
                const startIndex = enabledDates.indexOf(selectedStartDate);
                selectedEndDate = (startIndex !== -1 && startIndex < enabledDates.length - 1) ? enabledDates[startIndex + 1] : enabledDates[0];
                console.warn(`End date ${endDate} is not enabled, selecting the next available date: ${selectedEndDate}.`);
            }
    
            // Log selected dates
            console.log(`Selected start date: ${selectedStartDate}, Selected end date: ${selectedEndDate}`);
    
            // Click on the selected start date
            await this.native.locator(`.calendar-day:not(.disabled)[data-date*="${selectedStartDate}"]`).click();
    
            // Click on the selected end date
            await this.native.locator(`.calendar-day:not(.disabled)[data-date*="${selectedEndDate}"]`).click();
    
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
    
    
    
    
    


    async fillMinimumRequiredFields(eventData) {
        try{

            const titleInput = await this.getInputHandleInsideInputShadowRoot(this.locators.eventTitle);
            await titleInput.type(eventData.title);

            const descriptionInput = await this.getInputHandleTextAreaShadowRoot(this.locators.eventDescription);
            await descriptionInput.type(eventData.description);

            await this.selectDate(eventData.startDate, eventData.endDate);

            await this.native.locator(this.locators.startTime).click()
            await this.native.locator(this.locators.startTimeOption(eventData.startTime)).click()

            await this.native.locator(this.locators.endTime).click()
            await this.native.locator(this.locators.endTimeOption(eventData.endTime)).click()

            await this.native.locator(this.locators.timezone).click()
            await this.native.locator(this.locators.timezoneOption(eventData.timezone)).click()

            const venueInput = await this.getInputHandleInsideInputShadowRoot(this.locators.venueName);
            await venueInput.type(eventData.venue);

            await this.native.locator(this.locators.firstVenueNameOption).waitFor({ state: 'visible' });

            await this.native.locator(this.locators.firstVenueNameOption).click();

        
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
    

}
module.exports = { BasicInfo };