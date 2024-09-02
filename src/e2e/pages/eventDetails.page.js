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
            sectionSelector: (profile) => `div[class*="profile-cards"]:has(#${profile})`,
            relatedProductsSection : `.event-product-blades`,
            relatedProductFragment: `[class="fragment"]`,
            eventContainer: '.foreground.container',
            eventRsvp: `//a[text()='RSVP now' and @href='#rsvp-form-1']`,
            eventForm: '#rsvp-form-1',
            eventFormTitle: `//*[@id='rsvp-form-1']//*[@id='event-title']`,
            eventRsvpFormEmail: '#email',
            eventFormCompany: '#companyName',
            eventFormJob: '#jobTitle',
            eventFormTermsCondition: '#terms-and-conditions',
            eventFormSubmit: `//button[text()='Submit']`,
            signInEmailForm: `#EmailForm`,
            dateTimeLocator: `[class*="display-event-date-time"] strong`,
            descriptionLocator: `.preserve-format`
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
    
    async verifyNavigationToEventDetailPage(expectedTitle) {
        try {
            const normalizedTitle = expectedTitle
                .toLowerCase()
                .replace(/['"`]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            const expectedUrlPart = `/${normalizedTitle}`;
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
            //throw new Error(`Could not verify the event detail page header for "${expectedTitle}".`);
        }
    }

    async verifyDateAndTime() {
        try {
            const dateTimeLocator = this.locators.dateTimeLocator;

            const isDateVisible = await this.isElementVisible(dateTimeLocator);
            if (!isDateVisible) {
                throw new Error('Event date and time element is not visible.');
            }

            const date = await this.native.locator(dateTimeLocator).textContent();

            if (!date || date.trim() === '') {
                throw new Error(`Event date "${date}" is not in the expected format.`);
            }
            console.log(`Event date "${date}" is in the expected format.`);

        } catch (error) {
            throw new Error(`Failed to verify event date and time: ${error.message}`);
        }
    }

    async verifyEventDescription() {
        try {
            const descriptionLocator = this.locators.descriptionLocator;

            const isDescriptionVisible = await this.isElementVisible(descriptionLocator);
            if (!isDescriptionVisible) {
                throw new Error('Event description element is not visible.');
            }

            const description = await this.native.locator(descriptionLocator).textContent();

            if (!description || description.trim() === '') {
                throw new Error('Event description is missing or empty.');
            }
            console.log(`Event description "${description} is present.`);

        } catch (error) {
            throw new Error(`Failed to verify event description: ${error.message}`);
        }
    }

    async verifyEventDetails(expectedTitle) {
        try {

            await this.native.waitForSelector(this.locators.pageHeader, { state: 'visible' });

            const title = await this.native.locator(this.locators.pageHeader).innerText();

            if (!title.trim().includes(expectedTitle)) {
                throw new Error(`Expected event title to contain "${expectedTitle}", but found "${title}"`);
            }
            console.log(`Event title "${title}" is displayed correctly.`);

            await this.verifyDateAndTime();
            await this.verifyEventDescription();

        } catch (error) {
            console.error('Failed to verify event details')
            throw new Error(`Failed to verify event details: ${error.message}`);
        }
    }

    async verifyProfileCards(profile) {
        try {
            const section = await this.native.locator(this.locators.sectionSelector(profile));
            if (!await section.isVisible()) {
                throw new Error(`Section with locator ${sectionLocator} is not visible`);
            }

            const profileCards = section.locator('div[class*="card-container"]');

            const cardCount = await profileCards.count();
            if (cardCount === 0) {
                throw new Error('No profile cards found within the section');
            }
            console.log(`Found ${cardCount} profile cards for ${profile}.`);

            for (let i = 0; i < cardCount; i++) {
                const card = profileCards.nth(i);
                await expect(card).toBeVisible();
            }

            if (cardCount > 3) {
                const prevButton = section.locator('button[class*="carousel-previous"]');
                const nextButton = section.locator('button[class*="carousel-next"]');

                await expect(prevButton).toBeVisible({ timeout: 5000 });
                await expect(nextButton).toBeVisible({ timeout: 5000 });

                await expect(prevButton).toBeEnabled();
                await expect(nextButton).toBeEnabled();

                console.log('Carousel navigation buttons are present and enabled.');
            } else {
                console.log('Profile cards are not in a carousel as the count is 3 or less.');
            }

        } catch (error) {
            console.error(`Failed to verify profile cards for ${profile}:`, error.message);
            throw new Error(`Failed to verify profile cards for ${profile}: ${error.message}`);
        }
    }

    async verifyRelatedProductsBladeDetails(relatedProductBladeSelector) {
        try {
            const relatedProductBlade = this.native.locator(relatedProductBladeSelector);
            const productCards = await relatedProductBlade.locator(this.locators.relatedProductFragment).elementHandles();
            const cardCount = productCards.length;

            if (cardCount > 0) {
                console.log(`Found ${cardCount} product cards in the related products blade.`);

                for (let i = 0; i < cardCount; i++) {
                    const card = productCards[i];

                    const link = await card.waitForSelector('a.con-button');
                    const linkExists = await link.isVisible();
                    if (linkExists) {
                        const isClickable = await link.isEnabled();
                        const linkText = await link.textContent(); // Get the text of the link

                        if (isClickable) {
                            console.log(`Link in card ${i + 1} is clickable. Context: text=${linkText}`);
                        } else {
                            console.warn(`Link in card ${i + 1} is not clickable. Context: text=${linkText}`);
                        }
                    } else {
                        console.warn(`Link with class 'con-button' not found in card ${i + 1}.`);
                    }
                }
            } else {
                console.log('No product cards found in the related products blade.');
            }
        } catch (error) {
            console.error('Error verifying details in the related products blade:', error);
            throw error; 
        }
    }

    async clickRsvp() {
        try {
            await this.native.waitForSelector(this.locators.eventContainer);
            await this.native.waitForSelector(this.locators.eventRsvp);

            await this.native.locator(this.locators.eventRsvp).click();
            console.log("RSVP button clicked successfully.");

        } catch (error) {
            console.error(`Failed to click the RSVP button: ${error.message}`);
            throw new Error(`Failed to click the RSVP button: ${error.message}`);
        }
    }

    async isEventTitleCorrect(eventTitle) {
        try {

            await expect(this.native.locator(this.locators.eventFormTitle)).toHaveText(eventTitle);
            console.log(`Event title is correct: ${eventTitle}`);

        } catch (error) {
            console.error(`Event title verification failed. Expected: "${eventTitle}". Error: ${error.message}`);
            throw new Error(`Event title verification failed. Expected: "${eventTitle}". Error: ${error.message}`);
        }
    }

    async isEmailCorrect(expectedEmailAddress) {
        try {
            await expect(this.native.locator(this.locators.eventRsvpFormEmail)).toHaveText(expectedEmailAddress);
            console.log(`Email address is correct: ${expectedEmailAddress}`);

        } catch (error) {
            console.error(`Email address verification failed. Expected: "${expectedEmailAddress}". Error: ${error.message}`);
            throw new Error(`Email address verification failed. Expected: "${expectedEmailAddress}". Error: ${error.message}`);
        }
    }


    // async fillRsvpForm() {
    //     await this.native.locator(this.locators.eventFormCompany).fill(testData.companyName);
    //     await this.native.locator(this.locators.eventFormJob).selectOption(testData.jobTitle);
    //     await this.native.locator(this.locators.eventFormTermsCondition).check();
    //     await this.native.locator(this.locators.eventFormSubmit).click();
    // }
}

module.exports = { EventDetailPage };
