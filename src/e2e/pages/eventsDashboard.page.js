const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class EventsDashboard extends EventsBasePage {
    constructor() {
        super('/ecc/dashboard/t3');
        this.locators = {
            signInLink: '.feds-signIn',
            dashboardHeading: '.dashboard-header-heading',
            searchBox: '//input[@placeholder="Search"]',
            createNewEventButton: '//a[text()="Create new event"]',
            createInpersonEventButton: 'a.dropdown-item[href="/ecc/create/t3"]',
            createWebinarEventButton: 'a.dropdown-item[href="/ecc/create/t3/webinar"]',
            footerSection: '.feds-footer-privacySection',
            paginationContainer: '.pagination-container',
            tableHeaders: '//th/span',
            eventRowByEventId: (eventId) => `tr.event-row[data-event-id="${eventId}"]`,
            eventRowByEventName: (eventName) => `//tr[contains(@class, 'event-row') and .//a[contains(@class, 'event-title-link') and text()="${eventName}"]][1]`,
            moreOptionsButton: 'img.icon.icon-more-small-list',
            eventToolBox: '.dashboard-event-tool-box',
            deleteOption: 'a.dash-event-tool:has-text("Delete")',
            confirmDeleteDialog: 'sp-dialog[role="dialog"]',
            confirmDeleteButton: 'sp-button:has-text("Yes, I want to delete this event")',
            deleteConfirmationToast: 'sp-toast:has-text("Your event has been deleted.")',
            eventTitleLink: '.event-title-link',
            secondaryLinkCheckbox: '#checkbox-secondary-url',
            secondaryLinkLabel: '#secondary-cta-label',
            secondaryLinkUrl: '#secondary-cta-url',
            urlErrorMessage: '#url-error-message'
        };
    }

    async verifyEventTitle(expectedTitle) {
        try {
            const eventTitleElement = await this.native.locator(this.locators.eventFormTitle);
            const actualTitle = await eventTitleElement.textContent();
            if (actualTitle.trim() !== expectedTitle) {
                throw new Error(`Expected: "${expectedTitle}", but got: "${actualTitle.trim()}".`);
            }

            logger.logInfo(`Event title on Events Dashboard is correct: ${expectedTitle}`);

        } catch (error) {
            logger.logError(`Error verifying Events Dashboard title. Error: ${error.message}`);
            throw error;
        }
    }

      async clickSignIn() {
        try {
            await this.native.waitForSelector(this.locators.signInLink);

            await this.native.locator(this.locators.signInLink).click();
            logger.logInfo("Sign In Link clicked successfully.");

        } catch (error) {
            logger.logError(`Failed to click the Sign In Link: ${error.message}`);
            throw new Error(`Failed to click the Sign In Link: ${error.message}`);
        }
    }

    async verifyTableHeaders(expectedHeaders) {
        try {
            
            const tableHeadersItems = this.native.locator(this.locators.tableHeaders);
            const count = await tableHeadersItems.count();
    
            if (count === 0) {
                logger.logError("No table headers found.");
                throw new Error(`No table headers found inside ${this.locators.tableHeaders}.`);
            }
    
            logger.logInfo(`Found ${count} table headers.`);
    
            const actualHeaders = [];
            for (let i = 1; i < count; i++) {
                const headerText = await tableHeadersItems.nth(i).innerText();
                actualHeaders.push(headerText.trim());
            }
    
            //Comparison of actual headers with expected headers
            const headersMatch = JSON.stringify(actualHeaders) === JSON.stringify(expectedHeaders);
    
            if (!headersMatch) {
                logger.logError(`Table headers do not match. Expected: ${JSON.stringify(expectedHeaders)}, Actual: ${JSON.stringify(actualHeaders)}`);
                throw new Error(`Table headers do not match. Expected: ${JSON.stringify(expectedHeaders)}, Actual: ${JSON.stringify(actualHeaders)}`);
            }
    
            logger.logInfo(`Correct table headers are visible: ${JSON.stringify(actualHeaders)}`);
        } catch (error) {
            logger.logError(`Error occurred while verifying table headers: ${error.message}`);
            throw new Error(`Failed to verify table headers: ${error.message}`);
        }
    }
    
    async clickCreateNewEventButton(eventType) {
        try {
            await this.native.locator(this.locators.createNewEventButton).click();
            logger.logInfo('Create New Event button clicked successfully.');

            // Wait for the dropdown to be visible and click the appropriate button
            if (eventType === 'In-Person') {
                await this.native.locator(this.locators.createInpersonEventButton).click();
                logger.logInfo('Clicked on Create In-Person Event button');
            } else if (eventType === 'Webinar') {
                await this.native.locator(this.locators.createWebinarEventButton).click();
                logger.logInfo('Clicked on Create Webinar Event button');
            } else {
                throw new Error(`Invalid event type: ${eventType}. Must be either 'In-Person' or 'Webinar'`);
            }
        } catch (error) {
            logger.logError(`Failed to click the Create New Event button: ${error.message}`);
            throw new Error(`Failed to click the Create New Event button: ${error.message}`);
        }
    
        try {
            const expectedUrlPart = eventType === 'Webinar' ? '/ecc/create/t3/webinar' : '/ecc/create/t3';
            const currentUrl = await this.native.url();
            
            if (currentUrl.includes(expectedUrlPart)) {
                logger.logInfo(`"ECC dashboard" navigated to create ${eventType.toLowerCase()} events page successfully. URL: "${currentUrl}"`);
            } else {
                throw new Error(`Current URL "${currentUrl}" does not contain the expected part "${expectedUrlPart}".`);
            }
        } catch (error) {
            logger.logError(`Failed to verify navigation to create events page: ${error.message}`);
            throw new Error(`Could not verify navigation to create events page. ${error.message}`);
        }
    }

    async searchEvent(eventTitle) {
        try {
            const searchBoxLocator = this.native.locator(this.locators.searchBox);
            await searchBoxLocator.fill(eventTitle);
            logger.logInfo(`Filled the search box with event name: ${eventTitle}`);
        } catch (error) {
            logger.logError(`Failed to fill the search box: ${error.message}`);
            throw new Error(`Failed to fill the search box: ${error.message}`);
        }
    }

    async verifyEvent(eventTitle, eventId) {
        try {
            const eventRowLocator = this.native.locator(this.locators.eventRowByEventId(eventId));
            await expect(eventRowLocator).toBeVisible({ timeout: 5000 });
    
            const eventTitleLink = eventRowLocator.locator('.event-title-link');
            const eventText = await eventTitleLink.innerText();
            expect(eventText).toContain(eventTitle);
    
            logger.logInfo(`Event with title "${eventTitle}" and ID "${eventId}" is present in the table.`);
        } catch (error) {
            logger.logError(`Error in verifying event in table: ${error.message}`);
            throw new Error(`Error in verifying event in table: ${error.message}`);
        }
    }

    async deleteEvent(eventTitle) {
        try {
            const eventRowSelector = this.locators.eventRowByEventName(eventTitle);
            const eventRow = this.native.locator(eventRowSelector);

            // Click the "more options" button within the event row
            const moreOptionsButton = eventRow.locator(this.locators.moreOptionsButton);
            await moreOptionsButton.click();

            logger.logInfo('Clicked the "more options" button successfully.');

            const eventToolBox = this.native.locator(this.locators.eventToolBox);

            // Click the delete option
            const deleteOption = eventToolBox.locator(this.locators.deleteOption);
            await deleteOption.click();

            logger.logInfo('Clicked the delete option successfully.');

             // Confirmation dialog will appear
             const confirmDeleteDialog = this.native.locator(this.locators.confirmDeleteDialog);

             // Click the confirm delete button
             const confirmDeleteButton = confirmDeleteDialog.locator(this.locators.confirmDeleteButton);
             await confirmDeleteButton.click();
 
            logger.logInfo('Deletion confirmation button clicked successfully.');

            // Delete confirmation toast will appear
            const deleteConfirmationToast = this.native.locator(this.locators.deleteConfirmationToast);

            // Verify the text content of the delete confirmation toast
            const toastText = await deleteConfirmationToast.textContent();
            expect(toastText).toContain('Your event has been deleted.');

            logger.logInfo('Event deletion confirmation toast verified successfully.');

        } catch (error) {
            logger.logError(`Error deleting the event: ${error.message}`);
            throw new Error(`Error deleting the event: ${error.message}`);
        } 
        
    }
   
}

module.exports = { EventsDashboard };