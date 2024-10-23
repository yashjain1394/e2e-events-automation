const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const { EventDetailPage } = require('./eventDetails.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class Rsvp extends EventsBasePage {
    static eventId = null; // Static variable to store eventId
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            rsvpLabel: '//*[@id="rsvp"]',
            successToast: 'sp-toast:not(.save-success-msg)',
            actionButton: 'sp-button[slot="action"]'
        };
    }

    async verifyEventCreationSuccessToast() {
        try {
            const toastSelector = this.locators.successToast;
            const toast = this.native.locator(toastSelector);

            // Print the outer HTML of the toast element
            const outerHTML = await toast.evaluate(el => el.outerHTML);
            logger.logInfo('Outer HTML of toast:', outerHTML);

            // Extract text from the toast element
            const confirmationMessage = await toast.textContent();
            logger.logInfo('Confirmation message:', confirmationMessage);
            if (!confirmationMessage.includes("Success! This event has been published.")) {
                throw new Error("Success message not found.");
            }

            // Extract and verify the action button inside the toast
            const actionButton = toast.locator(this.locators.actionButton);
            const buttonText = await actionButton.textContent();
            logger.logInfo('Button text:', buttonText);
            expect(buttonText).toBe('Go to dashboard');

            const buttonHref = await actionButton.evaluate(el => el.getAttribute('href'));
            logger.logInfo('Button href:', buttonHref);
            expect(buttonHref).toContain('/ecc/dashboard/t3?newEventId=');

            // Click the action button
            await actionButton.click();

            logger.logInfo('Event creation success toast verified and action button clicked successfully.');
        } catch (error) {
            logger.logInfo(`Error verifying event creation success toast: ${error.message}`);
            throw new Error(`Error verifying event creation success toast: ${error.message}`);
        }
    }

    async verifyNavigationToECCDashboard(){
        try {
            const expectedUrlPart = `/ecc/dashboard/t3?newEventId=`;
            const currentUrl = await this.native.url();
            
            if (currentUrl.includes(expectedUrlPart)) {
                logger.logInfo(`"Successfully navigated to ECC dashboard, URL: "${currentUrl}"`);

                // Extract the eventId from the URL
                const urlParams = new URLSearchParams(new URL(currentUrl).search);
                const eventId = urlParams.get('newEventId');
                console.log('Extracted eventId:', eventId);

                if (!eventId) {
                    throw new Error("Event ID not found in the URL.");
                }

                // Save the eventId to the static variable
                Rsvp.eventId = eventId;
                logger.logInfo(`Event ID: ${eventId}`);

            } else {
                throw new Error(`Current URL "${currentUrl}" does not contain the expected part "${expectedUrlPart}".`);
            }
        } catch (error) {
            logger.logError(`Failed to verify navigation to ECC dashboard page: ${error.message}`);
            throw new Error(`Could not verify navigation to ECC dashboard page: ${error.message}`);
        }
    }
    }
module.exports = { Rsvp };