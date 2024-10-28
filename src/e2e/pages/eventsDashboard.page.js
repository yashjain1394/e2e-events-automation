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
            footerSection: '.feds-footer-privacySection',
            paginationContainer: '.pagination-container',
            tableHeaders: '//th/span',
            eventRow: (eventId) => `tr.event-row[data-event-id="${eventId}"]`,
            moreOptionsButton: 'img.icon.icon-more-small-list',
            eventToolBox: '.dashboard-event-tool-box',
            deleteOption: 'a.dash-event-tool:has-text("Delete")',
            confirmDeleteDialog: 'sp-dialog[role="dialog"]',
            confirmDeleteButton: 'sp-button:has-text("Yes, I want to delete this event")',
            deleteConfirmationToast: 'sp-toast:has-text("Your event has been deleted.")',

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
    
    async clickCreateNewEventButton() {
        try {
            await this.native.locator(this.locators.createNewEventButton).click();
            logger.logInfo('Create New Event button clicked successfully.');
        } catch (error) {
            logger.logError(`Failed to click the Create New Event button: ${error.message}`);
            throw new Error(`Failed to click the Create New Event button: ${error.message}`);
        }
    
        try {
            const expectedUrlPart = `/ecc/create/t3`;
            const currentUrl = await this.native.url();
            
            if (currentUrl.includes(expectedUrlPart)) {
                logger.logInfo(`"ECC dashboard" navigated to create events page successfully. URL: "${currentUrl}"`);
            } else {
                throw new Error(`Current URL "${currentUrl}" does not contain the expected part "${expectedUrlPart}".`);
            }
        } catch (error) {
            logger.logError(`Failed to verify navigation to create events page: ${error.message}`);
            throw new Error(`Could not verify navigation to create events page. ${error.message}`);
        }
    }

    async deleteEvent(eventId) {
        try {
            const eventRowSelector = this.locators.eventRow(eventId);
            const eventRow = this.native.locator(eventRowSelector);
            logger.logInfo({ eventRowSelector });

            // Click the "more options" button within the event row
            const moreOptionsButton = eventRow.locator(this.locators.moreOptionsButton);
            await moreOptionsButton.click();

            logger.logInfo('Clicked the "more options" button successfully.');

            const eventToolBox = this.native.locator(this.locators.eventToolBox);

            // Click the delete option
            const deleteOption = eventToolBox.locator(this.locators.deleteOption);
            await deleteOption.click();

            logger.logInfo('Clicked the delete option successfully.');

             // Wait for the confirmation dialog to appear
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