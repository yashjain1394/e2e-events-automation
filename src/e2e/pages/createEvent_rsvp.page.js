const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const { EventDetailPage } = require('./eventDetails.page.js');
const { BasicInfo } = require('./createEvent_basicInfo.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class Rsvp extends EventsBasePage {
    static eventId = null; // Static variable to store eventId
    
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            rsvpLabel: '//*[@id="rsvp"]',
            eventCreationSuccessToast: 'sp-toast:not(.save-success-msg)[variant="positive"]',
            actionButton: 'sp-button[slot="action"][href^="https://www.stage.adobe.com/ecc/dashboard/t3?newEventId="]',
            attendeeLimit: 'input[id="attendee-count-input"]',
            contactHostCheckbox: 'sp-checkbox[id="registration-contact-host"]',
            hostEmail: 'sp-textfield[id="event-host-email-input"] input[placeholder="Add host email"]',
            rsvpFormDescription: 'sp-textfield[id="rsvp-form-detail-description"] input[placeholder="Add brief description"]',
            includeOnFormFieldCategories: (category) => `sp-checkbox[name="${this.removeSpaceFromCategoryName(category)}"].check-appear`,
            makeItRequiredFieldCategories: (category) => `sp-checkbox[name="${this.removeSpaceFromCategoryName(category)}"].check-require`,
            termsAndConditionCheckbox: 'input[data-field-id="terms-and-condition-check-1"]',
        };
    }

    async verifyEventCreationSuccessToast(eventPublishedToastText, eventPublishedToastGoToDashboardText) {
        try {
            const toastSelector = this.locators.eventCreationSuccessToast;
            const toast = this.native.locator(toastSelector);

            // Extract text from the toast element
            const confirmationMessage = await toast.textContent();
            logger.logInfo(`Confirmation message: ${confirmationMessage}`);
            if (!confirmationMessage.includes(eventPublishedToastText)) {
                throw new Error("Success message not found.");
            }

            // Extract and verify the action button inside the toast
            const actionButton = toast.locator(this.locators.actionButton);
            const buttonText = await actionButton.textContent();
            logger.logInfo(`Button text: ${buttonText}`);
            expect(buttonText).toBe(eventPublishedToastGoToDashboardText);

            const buttonHref = await actionButton.evaluate(el => el.getAttribute('href'));
            logger.logInfo('Button href:', buttonHref);
            expect(buttonHref).toContain('/ecc/dashboard/t3?newEventId=');

            // Click the action button
            await actionButton.click();

            logger.logInfo('Event creation success toast verified and action button clicked successfully.');
        } catch (error) {
            logger.logError(`Error verifying event creation success toast: ${error.message}`);
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

    async fillAttendeeLimit(attendeeLimit) {
        try {
            const attendeeLimitInput = this.native.locator(this.locators.attendeeLimit);
            await attendeeLimitInput.fill(attendeeLimit);
            logger.logInfo(`Filled attendee limit: ${attendeeLimit}`);
        } catch (error) {
            logger.logError(`Failed to fill attendee limit: ${error.message}`);
            throw new Error(`Could not fill attendee limit: ${error.message}`);
        }

    }

    async fillHostEmail(hostEmail) {
        try {
            const contactHostCheckboxLocator = this.native.locator(this.locators.contactHostCheckbox);
            await contactHostCheckboxLocator.click();
            logger.logInfo('Checked the contact host checkbox');
            const hostEmailInputLocator = this.native.locator(this.locators.hostEmail);
            await hostEmailInputLocator.fill(hostEmail);
            logger.logInfo(`Filled host email: ${hostEmail}`);
        } catch (error) {
            logger.logError(`Failed to fill host email: ${error.message}`);
            throw new Error(`Could not fill host email: ${error.message}`);
        }
    }

    async fillRsvpFormDescription(description) {
        try {
            const rsvpFormDescriptionInputLocator = this.native.locator(this.locators.rsvpFormDescription);
            await rsvpFormDescriptionInputLocator.fill(description);
            logger.logInfo(`Filled RSVP form description: ${description}`);
        } catch (error) {
            logger.logError(`Failed to fill RSVP form description: ${error.message}`);
            throw new Error(`Could not fill RSVP form description: ${error.message}`);
        }
    }

    async selectIncludeOnFormFieldCategories(fieldCategories) {
        try {
            const fieldCategoriesArray = fieldCategories.split(',').map(category => category.trim());
            // console.log('Include on form Field Categories:', fieldCategoriesArray);
            for (const category of fieldCategoriesArray) {
                const checkboxLocator = this.native.locator(this.locators.includeOnFormFieldCategories(category));
                await checkboxLocator.click();
                logger.logInfo(`Selected Include on form field category checkbox for ${category}`);
            }
        } catch (error) {
            logger.logError(`Failed to select Include on form field categories checkboxes: ${error.message}`);
            throw new Error(`Could not select Include on form field categories checkboxes: ${error.message}`);
        }
    }

    async selectMakeItRequiredFieldcategories(fieldCategories) {
        try {
            const fieldCategoriesArray = fieldCategories.split(',').map(category => category.trim());
            // console.log('Make it required Field Categories:', fieldCategoriesArray);
            for (const category of fieldCategoriesArray) {
                const checkboxLocator = this.native.locator(this.locators.makeItRequiredFieldCategories(category));
                await checkboxLocator.click();
                logger.logInfo(`Selected Make it required field category checkbox for ${category}`);
            }
        } catch (error) {
            logger.logError(`Failed to select Make it required field categories checkboxes: ${error.message}`);
            throw new Error(`Could not select Make it required field categories checkboxes: ${error.message}`);
        }
    }

    async checkTermsAndConditionsCheckbox() {
        try {
            const termsAndConditionCheckboxSelector = this.native.locator(this.locators.termsAndConditionCheckbox);
            const isTermsAndConditionCheckboxEnabled = await termsAndConditionCheckboxSelector.isEnabled();
            if (!isTermsAndConditionCheckboxEnabled) {
                logger.logInfo('Terms and condition checkbox is disabled.');
            }else{
                logger.logInfo('Terms and condition checkbox is enabled.');
                await termsAndConditionCheckboxSelector.check();
                logger.logInfo('Checked the terms and condition checkbox');
            }
            
        } catch (error) {
            logger.logError(`Failed to check the terms and condition checkbox: ${error.message}`);
            throw new Error(`Could not check the terms and condition checkbox: ${error.message}`);
        }
    }

    // Helper function to remove spaces from category names and capitalize the first character after each space
    removeSpaceFromCategoryName(categoryName) {
        return categoryName.toLowerCase().replace(/\s+(\w)/g, (match, p1) => p1.toUpperCase());
        }
}
module.exports = { Rsvp };