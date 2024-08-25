const { EventsBasePage } = require('./eventsBase.page.js');
const { expect } = require('@playwright/test');

class EventsHubPage extends EventsBasePage {
  constructor() {
    super('/events/hub');
    //this.commonPage = new CommonPage(); 
    this.locators = {
      marquee: `[class*="marquee"]`,
      photographyCategoryButton: (categoryName) => `button[data-group="${categoryName}"]`,
      videoCategoryButton: (categoryName) => `button[data-group="${categoryName}"]`,
      cardsWrapper: `[data-testid='consonant-CardsGrid']`,
      eventCards: `.consonant-Card`,
      eventCard: (eventTitle) => `.consonant-Card:has(.consonant-Card-title[title="${eventTitle}"])`,
      eventCardContent: `.consonant-Card-content`,
      eventDateAndTime: `[data-testid='consonant-DateIntervalInfobit']`,
      viewEventLink: `//a[span[text()='View event']]`,
      paginationControlsSelector: `.consonant-Pagination`,
      nextButtonSelector: `.consonant-Pagination button[data-testid="consonant-Pagination-btn--next"]`,
      previousButtonSelector: `.consonant-Pagination button[data-testid="consonant-Pagination-btn--prev"]`,
      paginationSelector: `.consonant-Pagination-items`,
      paginationSummarySelector: `.consonant-Pagination-summary`
    };

  }

  async verifyMarquee() {
    //await this.commonPage.verifyElementVisible(this.locators.marquee);
    const marqueElement = await this.native.waitForSelector(this.locators.marquee);
    expect(await marqueElement.isVisible()).toBeTruthy();
  }

  async verifyEventsDisplayed() {
    await this.native.waitForSelector(this.locators.cardsWrapper);
    const cards = await this.native.locator(this.locators.eventCards);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  }

  async viewEventByTitle(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });
      const viewEventLink = eventCard.locator(this.locators.viewEventLink);
      expect(await viewEventLink.isVisible()).toBeTruthy();
      console.log(`Event Card with title ${eventTitle} is present`);

    } catch (error) {
      console.error(`Failed to view event with title "${eventTitle}":`, error.message);
      throw new Error(`Could not select or click on the event card with title "${eventTitle}".`);
    }
  }

  async verifyBannersOnCard(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });

      const bannerHeader = await eventCard.locator('[data-testid="consonant-Card-header"]');

      expect(await bannerHeader.isVisible()).toBeTruthy();

      const styleAttribute = await bannerHeader.getAttribute('style');

      expect(styleAttribute).toContain('background-image', `No background-image found in the style attribute for the event card titled "${eventTitle}".`);

      const backgroundImageStart = styleAttribute.indexOf('url(') + 4; // 4 to skip 'url('
      const backgroundImageEnd = styleAttribute.indexOf(')', backgroundImageStart);
      let backgroundImageUrl = styleAttribute.substring(backgroundImageStart, backgroundImageEnd).replace(/['"]/g, '');


      if (!backgroundImageUrl || backgroundImageUrl === '') {
        throw new Error(`Banner for the event card titled "${eventTitle}" does not have a valid background-image URL.`);
      }
      console.log(`Banner background image URL on the event card titled "${eventTitle}" is: ${backgroundImageUrl}`);

    } catch (error) {
      console.error("Banner verification failed:", error.message);
      throw new Error(`Failed to verify the banner on the event card titled "${eventTitle}".`);
    }
  }

  async verifyDateAndTimeOnCard(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });

      const dateAndTimeElement = eventCard.locator(this.locators.eventDateAndTime);
      await dateAndTimeElement.waitFor({ state: 'visible' });

      const dateAndTimeText = await dateAndTimeElement.textContent();
      if (!dateAndTimeText) {
        throw new Error("Date and time text is missing or not visible.");
      }

      const dateTimeRegex = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2} \| \d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM) GMT[+-]\d{1,2}:\d{2}$/;
      if (!dateTimeRegex.test(dateAndTimeText.trim())) {
        throw new Error(`Date and time format is incorrect: ${dateAndTimeText}`);
      }

      console.log(`Date and time on the event card are displayed correctly: ${dateAndTimeText}`);
    } catch (error) {
      console.error("Date and time verification failed:", error.message);
      throw error;
    }
  }

  async verifyViewEventButton(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });

      const viewEventLink = eventCard.locator(this.locators.viewEventLink);
      await viewEventLink.waitFor({ state: 'visible' });
      await expect(viewEventLink).toBeEnabled();

      console.log(`"View event" button on the event card is clickable.`);
    } catch (error) {
      console.error('Verification of "View event" button failed:', error.message);
      throw error;
    }
  }

  async verifyPaginationControls() {
    try {
      const paginationControls = await this.native.waitForSelector(this.locators.paginationControlsSelector);
      expect(await paginationControls.isVisible()).toBeTruthy();
    } catch (error) {
      console.error("Pagination controls verification failed:", error.message);
      throw new Error("Failed to verify pagination controls.");
    }
  }

  async verifyButtonIsClickable(buttonSelector) {
    try {
      const button = await this.native.locator(buttonSelector);
      await button.waitFor({ state: 'visible' });
      expect(await button.isEnabled()).toBeTruthy();
      console.log(`The button with selector "${buttonSelector}" is clickable.`);
    } catch (error) {
      console.error(`Button with selector "${buttonSelector}" is not clickable:`, error.message);
      throw new Error(`The button with selector "${buttonSelector}" is not clickable.`);
    }
  }

  async verifyPageNumbersClickable() {
    try {
      const paginationItems = this.native.locator(`${this.locators.paginationSelector} li button`);
      const count = await paginationItems.count();

      if (count === 0) {
        throw new Error(`No pagination buttons found inside ${paginationSelector}.`);
      }

      console.log(`Found ${count} pagination buttons.`);
      for (let i = 0; i < count; i++) {
        const pageButton = paginationItems.nth(i);
        await pageButton.waitFor({ state: 'visible' });
        expect(await pageButton.isEnabled()).toBeTruthy();
        console.log(`Pagination button ${i + 1} is clickable.`);
      }

    } catch (error) {
      console.error(`Pagination button verification failed:`, error.message);
      throw new Error(`Failed to verify pagination buttons.`);
    }
  }

  async verifyTotalPagesAndResults() {
    try {

      //const parentSelector = '.consonant-Pagination-summary';
      await this.native.waitForSelector(this.locators.paginationSummarySelector);

      const childElement = await this.native.locator(`${this.locators.paginationSummarySelector} > *`); 
      const summaryText = await childElement.textContent();

      const match = summaryText.match(/(\d+)\s*-\s*(\d+)\s*of\s*(\d+)\s*results/);

      if (!match) {
        throw new Error(`Pagination summary does not match expected format. Found: "${summaryText}".`);
      }

      const [_, start, end, total] = match.map(Number);

      if (start > end || end > total) {
        throw new Error(`Pagination summary numbers are out of range. Summary: "${summaryText}".`);
      }

      console.log(`Pagination summary is correct: ${summaryText}`);
    } catch (error) {
      console.error(`Total pages and results verification failed:`, error.message);
      throw new Error(`Failed to verify total pages and results: ${error.message}`);
    }
  }

  async clickViewEventButton(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = await this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });
      const viewEventLink = await eventCard.locator(this.locators.viewEventLink);
      await eventCard.waitFor({ state: 'visible' });
      expect(await viewEventLink.isVisible()).toBeTruthy();
      console.log(`Event Card with title ${eventTitle} is present`);
      await viewEventLink.click();
      await viewEventLink.click();
    } catch (error) {
      console.error(`Failed to view event with title "${eventTitle}":`, error.message);
      throw new Error(`Could not select or click on the event card with title "${eventTitle}".`);
    }
  }

}

module.exports = { EventsHubPage };
