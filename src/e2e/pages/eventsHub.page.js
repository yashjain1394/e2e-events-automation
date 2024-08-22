const { EventsBasePage } = require('./eventsBase.page.js');
const { CommonPage } = require('./common.page.js');
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
      paginationControlsSelector : `.consonant-Pagination`
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
      console.log(`Event Card is present`);
      //await viewEventLink.click();

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
      const paginationControls = await this.native.locator(this.locators.paginationControlsSelector);
      await expect(paginationControls).toBeVisible();
    } catch (error) {
      console.error("Pagination controls verification failed:", error.message);
      throw new Error("Failed to verify pagination controls.");
    }
  }


  // async selectCategory(categoryName) {
  //   const selector = this.locators.videoCategoryButton(categoryName);
  //   await this.native.locator(selector).click();
  // }
}

module.exports = { EventsHubPage };
