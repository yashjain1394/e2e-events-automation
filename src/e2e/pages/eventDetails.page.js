const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
//const testData = require("../config/test-data/eventRegistration.json");

class EventDetailPage extends EventsBasePage {
    constructor() {
        super();
        this.locators = {
            pageHeader: 'h1#event-title',
            eventTitle: `#event-title`,
            eventDateTime: `.display-event-date-time.body-m`,
            eventVenue: '#venue',
            eventAgenda: `#agenda`,
            eventContainer: '.foreground.container',
            eventRsvp: `//a[text()='RSVP now' and @href='#rsvp-form-1']`,
            eventForm: '#rsvp-form-1',
            eventFormTitle: `//*[@id='rsvp-form-1']//*[@id='event-title']`,
            eventRsvpFormEmail: '#email',
            eventFormCompany: '#companyName',
            eventFormJob: '#jobTitle',
            eventFormTermsCondition: '#terms-and-conditions',
            eventFormSubmit: `//button[text()='Submit']`
        };
    }

    async isElementVisible(elementLocator) {
        try {
            const element = await this.native.waitForSelector(elementLocator);
            const isVisible = await element.isVisible();
            expect(isVisible).toBe(true);
        } catch (error) {
            throw new Error(`Element located by ${elementLocator} was not visible: ${error.message}`);
        }
    }

    async verifyNavigationToEventDetailPage(expectedTitle) {
        try {
            const normalizedTitle = expectedTitle
                .toLowerCase()
                .replace(/['"`]/g, '')  
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            const expectedUrlPart = `/events/create-now/${normalizedTitle}`;
            await this.native.waitForURL(new RegExp(expectedUrlPart));
            const currentUrl = this.native.url();
            expect(currentUrl).toContain(expectedUrlPart);
            console.log(`Successfully navigated to URL containing: "${expectedUrlPart}"`);
        } catch (error) {
            console.error(`Failed to verify navigation to event detail page with title "${expectedTitle}":`, error.message);
            throw new Error(`Could not verify navigation to the event detail page for "${expectedTitle}".`);
        }
    }

    async verifyOnEventDetailPage(expectedTitle) {
        try {
            const header = await this.native.locator(this.locators.pageHeader).innerText();
            expect(header).toBe(expectedTitle);
            console.log(`Event detail page header verified as: "${header}"`);
        } catch (error) {
            console.error(`Failed to verify event detail page header for title "${expectedTitle}":`, error.message);
            throw new Error(`Could not verify the event detail page header for "${expectedTitle}".`);
        }
    }

    async clickRsvp() {
        await this.native.waitForSelector(this.locators.eventContainer);
        await this.native.waitForSelector(this.locators.eventRsvp);
        await this.native.locator(this.locators.eventRsvp).click();
    }

    async isEventTitleCorrect(eventTitle) {
        await expect(this.native.locator(this.locators.eventFormTitle)).toHaveText(eventTitle);
    }


    async isEmailCorrect(expectedEmailAddress) {
        await expect(this.native.locator(this.locators.eventRsvpFormEmail)).toHaveText(expectedEmailAddress);
    }

    // async fillRsvpForm() {
    //     await this.native.locator(this.locators.eventFormCompany).fill(testData.companyName);
    //     await this.native.locator(this.locators.eventFormJob).selectOption(testData.jobTitle);
    //     await this.native.locator(this.locators.eventFormTermsCondition).check();
    //     await this.native.locator(this.locators.eventFormSubmit).click();
    // }
}

module.exports = { EventDetailPage };
