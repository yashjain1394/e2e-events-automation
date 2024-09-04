const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class RegistrationForm extends EventsBasePage {
    constructor() {
        super();
        this.locators = {
            eventForm: '#rsvp-form-1',
            eventFormTitle: `//*[@id='rsvp-form-1']//*[@id='event-title']`,
            fieldsSelector: (field) => `#${field}`,
            requiredFields: '[required="required"]:not(:disabled)'
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

    async verifyEventTitle(expectedTitle) {
        try {
            const eventTitleElement = await this.native.locator(this.locators.eventFormTitle);
            const actualTitle = await eventTitleElement.textContent();
            if (actualTitle.trim() !== expectedTitle) {
                throw new Error(`Expected: "${expectedTitle}", but got: "${actualTitle.trim()}".`);
            }

            logger.logInfo(`Event title on RSVP form is correct: ${expectedTitle}`);

        } catch (error) {
            logger.logError(`Error verifying event title. Error: ${error.message}`);
            throw error;
        }
    }

    async verifyEmailPrefilled(expectedEmail) {
        try {
            const emailInput = await this.native.locator(this.locators.fieldsSelector('email'));
            const isDisabled = await emailInput.isDisabled();
            if (!isDisabled) {
                throw new Error("Email input is not disabled as expected.");
            }

            const emailValue = await emailInput.inputValue();

            if (emailValue !== expectedEmail) {
                throw new Error(`Expected email to be "${expectedEmail}", but got "${emailValue}".`);
            }

            logger.logInfo(`Prefilled Email: ${emailValue}`);
        } catch (error) {
            logger.logError(`Error verifying prefilled email input: ${error.message}`);
            throw error;
        }
    }

    async fillRequiredFields(fieldsData) {
        try {
            await this.native.waitForSelector(this.locators.requiredFields);
            const requiredFields = this.native.locator(this.locators.requiredFields);
            const totalRequiredFields = await requiredFields.count(); 

            for (let i = 0; i < totalRequiredFields; i++) {
                const field = requiredFields.nth(i);
                const fieldType = await field.getAttribute('type');
                const fieldId = await field.getAttribute('id');

                let value;

                switch (fieldId) {
                    case 'companyName':
                        value = fieldsData.companyName;
                        await field.fill(value);
                        break;

                    case 'jobTitle':
                        value = fieldsData.jobTitle;
                        await field.selectOption({ value });
                        break;

                    case 'mobilePhone':
                        value = fieldsData.phoneNumber;
                        await field.fill(value);
                        break;

                    case 'industry':
                        value = fieldsData.industry;
                        await field.selectOption({ value });
                        break;

                    case 'productOfInterest':
                        value = fieldsData.interest;
                        await field.selectOption({ value });
                        break;

                    case 'companySize':
                        value = fieldsData.companySize;
                        await field.selectOption({ value });
                        break;

                    case 'age':
                        value = fieldsData.ageRange;
                        await field.selectOption({ value });
                        break;

                    case 'jobLevel':
                        value = fieldsData.jobLevel;
                        await field.selectOption({ value });
                        break;

                    default:
                        logger.logWarning(`${fieldId} not handled`);
                        break;
                }

                if (value) {
                    logger.logInfo(`"${fieldId}" : "${value}"`);
                }else{
                    logger.logWarning(`"${fieldId}" : "No value provided"`);
                    throw new Error(`"${fieldId}" : "No value provided"`);
                }
            }

            logger.logInfo(`All ${totalRequiredFields} required fields have been filled with provided data.`);
        } catch (error) {
            logger.logError(`Error filling required fields: ${error.message}`);
            throw error;
        }
    }
}
module.exports = { RegistrationForm };
