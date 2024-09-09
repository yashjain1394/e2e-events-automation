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
            requiredFields: '[required="required"]:not(:disabled)',
            contactMethodSelector: 'label[for="contactMethod"]',
            tcCheckbox: '#terms-and-conditions',
            submitButton: 'button:has-text("Submit")',
            successDialog: '.form-success-msg',
            OKbutton: 'text=OK',
            iamgoingRSVPLink: 'a[href*="rsvp-form-1"]:text("I\'m going")',
            RSVPLink: `//a[text()='RSVP now' and @href='#rsvp-form-1']`,
        };
    }

    async isElementVisible(elementLocator) {
        try {
            const element = await this.native.waitForSelector(elementLocator);
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

            logger.logInfo(`Verified prefilled email : ${emailValue}`);
        } catch (error) {
            logger.logError(`Error verifying prefilled email input: ${error.message}`);
            throw error;
        }
    }

    async fillRequiredFields(fieldsData) {
        try {
            await this.native.waitForSelector(this.locators.requiredFields);
            const requiredFields = this.native.locator(this.locators.requiredFields);
            let totalRequiredFields = await requiredFields.count();

            for (let i = 0; i < totalRequiredFields; i++) {
                const field = requiredFields.nth(i);
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
                    console.log(`"${fieldId}" : "${value}"`);
                } else {
                    logger.logWarning(`"${fieldId}" : "No value provided"`);
                    throw new Error(`"${fieldId}" : "No value provided"`);
                }
            }
            const isContactMethodVisible = await this.isElementVisible(this.locators.contactMethodSelector);
            if (isContactMethodVisible) {
                const contactMethodLabelClass = await this.native.getAttribute(this.locators.contactMethodSelector, 'class');
                if (contactMethodLabelClass && contactMethodLabelClass.includes('required')) {
                    totalRequiredFields += 1;
                    const contactMethodValue = fieldsData.contactMethod;
                    if (contactMethodValue) {
                        const radioButton = await this.native.$(`input[type="radio"][name="contactMethod"][value="${contactMethodValue}"]`);
                        if (radioButton) {
                            await radioButton.check();
                            logger.logInfo(`"Contact Method" : "${contactMethodValue}"`);
                        } else {
                            console.log(`Radio button with value ${contactMethodValue} not found.`);
                            throw new Error(`Radio button with value ${contactMethodValue} not found.`);
                        }
                    }
                    else {
                        logger.logWarning("Contact Method : No value provided");
                        throw new Error("Contact Method : No value provided");
                    }

                }
            }
            logger.logInfo(`All ${totalRequiredFields} required fields have been filled with provided data.`);
        } catch (error) {
            logger.logError(`Error filling required fields`);
            throw error;
        }
    }

    async checkTermsAndConditions() {
        try {
            const isCheckboxVisible = await this.isElementVisible(this.locators.tcCheckbox);
            if (isCheckboxVisible) {
                const checkbox = await this.native.locator(this.locators.tcCheckbox)
                const isChecked = await checkbox.isChecked();
                if (!isChecked) {
                    await checkbox.click();
                }
                logger.logInfo("Checked Terms and Conditions")
            } else {
                logger.logError("Terms and Conditions checkbox not found.");
                throw new Error("Terms and Conditions checkbox not found.");
            }
        } catch (error) {
            console.error(`Error in checking the Terms and Conditions checkbox: ${error.message}`);
            throw new Error(`Error in checking the Terms and Conditions checkbox: ${error.message}`);
        }
    }

    async submitInformation() {
        try {
            const isSubmitButtonVisible = await this.isElementVisible(this.locators.submitButton);
            if (isSubmitButtonVisible) {
                const submitButton = await this.native.locator(this.locators.submitButton)
                const isDisabled = await submitButton.evaluate(button => button.disabled);
                if (!isDisabled) {
                    await submitButton.click();
                    logger.logInfo("Submit button clicked")
                } else {
                    logger.logError("Submit button is disabled.");
                    throw new Error("Submit button is disabled and cannot be clicked.");
                }
            } else {
                logger.logError("Submit button not found.");
                throw new Error("Submit button not found.");
            }
        } catch (error) {
            logger.logError(`Error in clicking the Submit button: ${error.message}`);
            throw error;
        }
    }

    async verifyRegistrationConfirmation() {
        try {
            const dialogSelector = this.locators.successDialog;
            const isDiloagVisible = await this.isElementVisible(dialogSelector)

            if (isDiloagVisible) {
                const dialog = this.native.locator(dialogSelector)
                const confirmationMessage = await dialog.innerText();
                if (!confirmationMessage.includes("You are now registered!")) {
                    throw new Error("Confirmation message not found.");
                }
                const okButton = await dialog.locator(this.locators.OKbutton);
                if (!okButton) {
                    throw new Error("OK button not found in the confirmation dialog.");
                }
                await okButton.click();
                console.log("Clicked OK button in the registration confirmation dialog.");

                await dialog.waitFor({ state: 'hidden', timeout: 5000 });
                console.log("Registration confirmation dialog closed successfully.");

                const imGoingLink = await this.native.locator(this.locators.iamgoingRSVPLink);

                if (await imGoingLink.isVisible()) {
                    logger.logInfo("Registration confirmation validated successfully.");
                } else {
                    throw new Error("'I'm going' link not found after registration confirmation.");
                }
            }
            else {
                logger.logError("RSVP confirmation dialog not found")
                throw new Error("RSVP confirmation dialog not found");
            }

        } catch (error) {
            logger.logError(`Error in verifying registration confirmation: ${error.message}`);
            throw error;
        }
    }

    async cancelRSVP() {
        try {
            const isIamGoingVisible = this.isElementVisible(this.locators.iamgoingRSVPLink)
            if (!isIamGoingVisible) {
                throw new Error("Event not registered")
            } else {
                const imGoingLink = this.native.locator(this.locators.iamgoingRSVPLink);
                await imGoingLink.click();
                const dialogSelector = this.locators.successDialog;
                const isDiloagVisible = await this.isElementVisible(dialogSelector)

                if (isDiloagVisible) {
                    const dialog = this.native.locator(dialogSelector)
                    const cancelLink = await dialog.locator('text=Cancel RSVP');
                    if (!cancelLink) {
                        throw new Error("Cancel RSVP link not found in the confirmation dialog.");
                    }
                    await cancelLink.click();
                    console.log("Cancel RSVP button clicked")

                    await dialog.waitFor({ state: 'hidden', timeout: 5000 });
                    console.log("Registration confirmation dialog closed successfully.");

                    const RSVPLink = await this.native.locator(this.locators.RSVPLink);

                    if (await RSVPLink.isVisible()) {
                        logger.logInfo("Registration cancellation validated successfully.");
                    } else {
                        throw new Error("RSVP link not found after cancellation.");
                    }
                    logger.logInfo("RSVP canceled successfully.");
                }
                else {
                    logger.logError("RSVP confirmation dialog not found")
                    throw new Error("RSVP confirmation dialog not found");
                }
            }

        } catch (error) {
            logger.logError(`Error in canceling the RSVP: ${error}`);
            throw error;
        }
    }

}
module.exports = { RegistrationForm };
