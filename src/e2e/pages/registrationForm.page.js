const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const { timeout } = require('puppeteer');
const logger = new Logger();

class RegistrationForm extends EventsBasePage {
    constructor() {
        super();
        this.locators = {
            eventForm: '#rsvp-form-1',
            eventFormTitle: `//*[@id='rsvp-form-1']//*[@id='event-title']`,
            fieldsSelector: (field) => `#${field}`,
            firstName: '#FirstName',
            lastName: '#LastName',
            email: '#Email',
            jobTitle: '#mktoFormsJobTitle',
            functionalArea: '#mktoFormsFunctionalArea',
            company: '#mkto_FormsCompany',
            country: '#Country',
            requiredFields: '[required="required"]:not(:disabled)',
            contactMethodSelector: 'label[for="contactMethod"]',
            tcCheckbox: '#terms-and-conditions',
            submitButton: 'button:has-text("Submit")',
            successDialog: '.form-success-msg:not(.hidden)',
            OKbutton: 'text=OK',
            iamgoingRSVPLink: 'a[href*="rsvp-form-1"]:text("I\'m going")',
            RSVPLink: `//a[text()='RSVP now' and @href='#rsvp-form-1']`,
            visibleFirstScreen: '.first-screen:not(.hidden)',
            visibleSecondScreen: '.second-screen:not(.hidden)',
            registerButton: 'a.con-button.blue[daa-ll*="Register"]',
            webinarRegisterButton: 'a.con-button.blue[daa-ll*="Register"]',
            webinarFirstName: '#FirstName',
            webinarLastName: '#LastName',
            webinarEmail: '#Email',
            webinarJobTitle: '#mktoFormsJobTitle',
            webinarFunctionalArea: '#mktoFormsFunctionalArea',
            webinarCompany: '#mkto_FormsCompany',
            webinarCountry: '#Country',
            webinarSubmitButton: '#mktoButton_new',
            webinarThankYouMessage: 'p.ty-message'
        };
    }

    async isElementVisible(elementLocator) {
        try {
            const element = await this.native.waitForSelector(elementLocator);
            const isVisible = await element.isVisible();
            expect(isVisible).toBe(true);
            return true;
        } catch (error) {
            console.error(`Element located by ${elementLocator} was not visible: ${error.message}`);
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
            const emailInput = await this.native.locator(this.locators.email);
            await this.native.waitForSelector(this.locators.email, { state: 'visible' });
            const isDisabled = await emailInput.isDisabled();
            if (!isDisabled) {
                throw new Error("Email input is not disabled as expected.");
            }

            const emailValue = await emailInput.inputValue();
            console.log(`emailValue=${emailValue}`)

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
            // Fill First Name
            await this.native.locator(this.locators.firstName).fill(fieldsData.firstName);
            logger.logInfo(`Filled First Name: ${fieldsData.firstName}`);

            // Fill Last Name
            await this.native.locator(this.locators.lastName).fill(fieldsData.lastName);
            logger.logInfo(`Filled Last Name: ${fieldsData.lastName}`);

            // Fill Email
            await this.native.locator(this.locators.email).fill(fieldsData.email);
            logger.logInfo(`Filled Email: ${fieldsData.email}`);

            // Select Job Title
            await this.native.locator(this.locators.jobTitle).selectOption({ value: fieldsData.jobTitle });
            logger.logInfo(`Selected Job Title: ${fieldsData.jobTitle}`);

            // Select Functional Area
            await this.native.locator(this.locators.functionalArea).selectOption({ value: fieldsData.functionalArea });
            logger.logInfo(`Selected Functional Area: ${fieldsData.functionalArea}`);

            // Fill Company
            await this.native.locator(this.locators.company).fill(fieldsData.company);
            logger.logInfo(`Filled Company: ${fieldsData.company}`);

            logger.logInfo('All required fields have been filled successfully.');
        } catch (error) {
            logger.logError(`Error filling required fields: ${error.message}`);
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

                const visibleFirstScreen = dialog.locator('.first-screen:not(.hidden)');
                const confirmationMessage = await visibleFirstScreen.innerHTML();

                if (!confirmationMessage.includes("You are now registered!")) {
                    throw new Error("Confirmation message not found.");
                }
                const okButton = await visibleFirstScreen.locator(this.locators.OKbutton);
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
            const isIamGoingVisible = await this.isElementVisible(this.locators.iamgoingRSVPLink);
            if (!isIamGoingVisible) {
                throw new Error("Event not registered");
            } else {
                const imGoingLink = this.native.locator(this.locators.iamgoingRSVPLink);
                await imGoingLink.click();
                const dialogSelector = this.locators.successDialog;
                const isDiloagVisible = await this.isElementVisible(dialogSelector);

                if (isDiloagVisible) {
                    const dialog = this.native.locator(dialogSelector);
                    const visibleFirstScreen = dialog.locator(this.locators.visibleFirstScreen);
                    const cancelLink = await visibleFirstScreen.locator('text=Cancel RSVP');
                    if (!cancelLink) {
                        logger.logError("Cancel RSVP link not found in the confirmation dialog.");
                        throw new Error("Cancel RSVP link not found in the confirmation dialog.");
                    }
                    await cancelLink.click();
                    logger.logInfo("Cancel RSVP button clicked");

                    const visibleSecondScreen = dialog.locator(this.locators.visibleSecondScreen);
                    const okButton = await visibleSecondScreen.locator(this.locators.OKbutton);
                    if (!okButton) {
                        logger.logError("OK button not found in the cancellation dialog.");
                        throw new Error("OK button not found in the cancellation dialog.");
                    }
                    await okButton.click();
                    logger.logInfo("Clicked OK button in the registration cancellation dialog.");

                    await dialog.waitFor({ state: 'hidden', timeout: 5000 });
                    logger.logInfo("Registration cancellation dialog closed successfully.");

                    // Wait for page to stabilize after cancellation
                    await this.native.waitForTimeout(2000);

                    // Try to find the RSVP now link with a longer timeout
                    try {
                        const rsvpLink = await this.native.locator(this.locators.RSVPLink);
                        await rsvpLink.waitFor({ state: 'visible', timeout: 10000 });
                        logger.logInfo("Registration cancellation validated successfully.");
                    } catch (rsvpError) {
                        // If RSVP link is not found, try refreshing the page
                        logger.logWarning("RSVP now link not immediately visible, refreshing page...");
                        await this.native.reload();
                        await this.native.waitForLoadState('networkidle');
                        
                        const rsvpLink = await this.native.locator(this.locators.RSVPLink);
                        await rsvpLink.waitFor({ state: 'visible', timeout: 10000 });
                        logger.logInfo("Registration cancellation validated after page refresh.");
                    }
                } else {
                    logger.logError("RSVP cancellation dialog not found");
                    throw new Error("RSVP cancellation dialog not found");
                }
            }
        } catch (error) {
            logger.logError(`Error in canceling the RSVP: ${error}`);
            throw error;
        }
    }

    async verifyFirstNamePrefilled() {
        try {
            const firstNameInput = await this.native.locator(this.locators.firstName);
            await this.native.waitForSelector(this.locators.firstName, { state: 'visible' });
            const isDisabled = await firstNameInput.isDisabled();
            if (!isDisabled) {
                throw new Error("First name input is not disabled as expected.");
            }

            const firstNameValue = await firstNameInput.inputValue()
            // Verify that first name is populated
            if (!firstNameValue) {
                logger.logError("First name input is empty.");
                throw new Error("First name input is empty.");
            }
            else{
                logger.logInfo(`Verified prefilled first name : ${firstNameValue}`);
            } 
        } catch (error) {
            logger.logError(`Error verifying prefilled first name input: ${error.message}`);
            throw error;
        }
    }

    async verifyLastNamePrefilled() {
        try {
            const lastNameInput = await this.native.locator(this.locators.lastName);
            await this.native.waitForSelector(this.locators.lastName, { state: 'visible' });
            const isDisabled = await lastNameInput.isDisabled();
            if (!isDisabled) {
                throw new Error("Last name input is not disabled as expected.");
            }

            const lastNameValue = await lastNameInput.inputValue()
            // Verify that last name is populated
            if (!lastNameValue) {
                logger.logError("Last name input is empty.");
                throw new Error("Last name input is empty.");
            }
            else{
                logger.logInfo(`Verified prefilled last name : ${lastNameValue}`);
            } 
        } catch (error) {
            logger.logError(`Error verifying prefilled last name input: ${error.message}`);
            throw error;
        }
    }

    async checkFormDisplayed(){
        try {
          await this.native.waitForSelector(this.locators.eventForm, { state: 'visible', timeout: 10000 });
          return true;
        } catch (error) {
          console.error(`Error checking form visibility: ${error.message}`);
          return false;
        }
      };

    async clickRegisterButton() {
        try {
            const registerButton = await this.native.locator(this.locators.registerButton);
            await registerButton.waitFor({ state: 'visible', timeout: 10000 });
            await registerButton.click();
            logger.logInfo('Clicked Register button successfully');
        } catch (error) {
            logger.logError(`Error clicking Register button: ${error.message}`);
            throw error;
        }
    }

    async clickWebinarRegisterButton() {
        try {
            const registerButton = await this.native.locator(this.locators.webinarRegisterButton);
            await registerButton.waitFor({ state: 'visible', timeout: 10000 });
            const isDisabled = await registerButton.evaluate(button => button.disabled);
            if (isDisabled) {
                throw new Error("Webinar Register button is disabled and cannot be clicked.");
            }
            await registerButton.click();
            logger.logInfo('Clicked Webinar Register button successfully');
        } catch (error) {
            logger.logError(`Error clicking Webinar Register button: ${error.message}`);
            throw error;
        }
    }

    async fillWebinarRegistrationForm(fieldsData) {
        try {
            // Fill First Name
            await this.native.locator(this.locators.webinarFirstName).fill(fieldsData.firstName);
            logger.logInfo(`Filled Webinar First Name: ${fieldsData.firstName}`);

            // Fill Last Name
            await this.native.locator(this.locators.webinarLastName).fill(fieldsData.lastName);
            logger.logInfo(`Filled Webinar Last Name: ${fieldsData.lastName}`);

            // Fill Email
            await this.native.locator(this.locators.webinarEmail).fill(fieldsData.email);
            logger.logInfo(`Filled Webinar Email: ${fieldsData.email}`);

            // Select Job Title
            await this.native.locator(this.locators.webinarJobTitle).selectOption({ value: fieldsData.jobTitle });
            logger.logInfo(`Selected Webinar Job Title: ${fieldsData.jobTitle}`);

            // Select Functional Area
            await this.native.locator(this.locators.webinarFunctionalArea).selectOption({ value: fieldsData.functionalArea });
            logger.logInfo(`Selected Webinar Functional Area: ${fieldsData.functionalArea}`);

            // Fill Company
            await this.native.locator(this.locators.webinarCompany).fill(fieldsData.company);
            logger.logInfo(`Filled Webinar Company: ${fieldsData.company}`);

            // Select Country
            if (fieldsData.country) {
                await this.native.locator(this.locators.webinarCountry).selectOption({ value: fieldsData.country });
                logger.logInfo(`Selected Webinar Country: ${fieldsData.country}`);
            }

            logger.logInfo('All webinar registration fields have been filled successfully.');
        } catch (error) {
            logger.logError(`Error filling webinar registration fields: ${error.message}`);
            throw error;
        }
    }

    async clickWebinarSubmitButton() {
        try {
            const submitButton = await this.native.locator(this.locators.webinarSubmitButton);
            await submitButton.waitFor({ state: 'visible', timeout: 10000 });
            const isDisabled = await submitButton.evaluate(button => button.disabled);
            if (isDisabled) {
                throw new Error("Webinar submit button is disabled and cannot be clicked.");
            }
            await submitButton.click();
            logger.logInfo('Clicked Webinar submit button successfully');
        } catch (error) {
            logger.logError(`Error clicking Webinar submit button: ${error.message}`);
            throw error;
        }
    }

    async verifyWebinarThankYouMessage() {
        try {
            const thankYouMessage = await this.native.locator(this.locators.webinarThankYouMessage);
            await thankYouMessage.waitFor({ state: 'visible', timeout: 10000 });
            
            const messageText = await thankYouMessage.textContent();
            const expectedText = "Thank you for your interest in ExperienceCloud. Your seat is saved!";
            
            if (!messageText.includes(expectedText)) {
                throw new Error(`Expected thank you message to contain "${expectedText}", but got: "${messageText}"`);
            }
            
            logger.logInfo('Verified webinar thank you message successfully');
        } catch (error) {
            logger.logError(`Error verifying webinar thank you message: ${error.message}`);
            throw error;
        }
    }

}
module.exports = { RegistrationForm };
