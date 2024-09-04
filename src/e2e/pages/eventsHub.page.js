const { EventsBasePage } = require('./eventsBase.page.js');
const { expect } = require('@playwright/test');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

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
      eventTitle: `[data-testid="consonant-Card-title"]`,
      eventCardContent: `.consonant-Card-content`,
      eventDateAndTime: `[data-testid='consonant-DateIntervalInfobit']`,
      viewEventLink: `a[daa-ll="View event"]`,
      paginationControlsSelector: `.consonant-Pagination`,
      nextButtonSelector: `.consonant-Pagination button[data-testid="consonant-Pagination-btn--next"]`,
      previousButtonSelector: `.consonant-Pagination button[data-testid="consonant-Pagination-btn--prev"]`,
      paginationSelector: `.consonant-Pagination-items`,
      paginationSummarySelector: `.consonant-Pagination-summary`
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

  async verifyEventsDisplayed() {
    try {
      await this.native.waitForSelector(this.locators.cardsWrapper);
      const cards = await this.native.locator(this.locators.eventCards);
      const count = await cards.count();
      if (count > 0) {
        logger.logInfo(`${count} events are shown on the first page of the Events Hub.`);
        return true;
      } else {
        logger.logError('No events displayed on the Events Hub first page');
        return false;
      }
    } catch (error) {
      logger.logError(`Error verifying events displayed: ${error.message}`);
      return false;
    }
  }

  async verifyButtonIsClickable(buttonType, buttonSelector) {
    try {
      const button = await this.native.locator(buttonSelector);
      await button.waitFor({ state: 'visible' });
      expect(await button.isEnabled()).toBeTruthy();
      logger.logInfo(`The "${buttonType}" button is clickable.`);
    } catch (error) {
      logger.logError(`The "${buttonType}" button is not clickable: ${error.message}`);
      throw new Error(`The button with selector "${buttonSelector}" is not clickable.`);
    }
  }

  async verifyPageNumbersClickable() {
    try {
      const paginationItems = this.native.locator(`${this.locators.paginationSelector} li button`);
      const count = await paginationItems.count();

      if (count === 0) {
        logger.logError("No pagination buttons found inside")
        throw new Error(`No pagination buttons found inside ${paginationSelector}.`);
      }

      logger.logInfo(`Found ${count} pagination buttons.`);
      for (let i = 0; i < count; i++) {
        const pageButton = paginationItems.nth(i);
        await pageButton.waitFor({ state: 'visible' });
        expect(await pageButton.isEnabled()).toBeTruthy();
        console.log(`Pagination button ${i + 1} is clickable.`);
      }

    } catch (error) {
      logger.logError(`Error occured while pagination button verification: ${error.message}`);
      throw new Error(`Failed to verify pagination buttons.`);
    }
  }

  async verifyTotalPagesAndResults() {
    try {
      await this.native.waitForSelector(this.locators.paginationSummarySelector);

      const childElement = await this.native.locator(`${this.locators.paginationSummarySelector} > *`);
      const summaryText = await childElement.textContent();

      const match = summaryText.match(/(\d+)\s*-\s*(\d+)\s*of\s*(\d+)\s*results/);

      if (!match) {
        logger.error(`Pagination summary does not match expected format. Found: "${summaryText}".`)
        throw new Error(`Pagination summary does not match expected format.`);
      }

      const [_, start, end, total] = match.map(Number);

      if (start > end || end > total) {
        logger.logError(`Pagination summary numbers are out of range. Summary: "${summaryText}".`)
        throw new Error(`Pagination summary numbers are out of range.`);
      }

      logger.logInfo(`Pagination summary is correct: ${summaryText}`);
    } catch (error) {
      logger.logError(`Error occured while total pages and results verification: ${error.message}`);
      throw new Error(`Failed to verify total pages and results: ${error.message}`);
    }
  }

  async viewEventByTitle(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible' });
      const viewEventLink = eventCard.locator(this.locators.viewEventLink);
      expect(await viewEventLink.isVisible()).toBeTruthy();
      logger.logInfo(`Event Card with title ${eventTitle} is present`)

    } catch (error) {
      logger.logError(`Failed to view event with title "${eventTitle}": ${error.message}`);
      throw new Error(`Could not view event card with title "${eventTitle}".`);
    }
  }

  // async getEventTitleBySequence(sequenceNumber) {
  //   try {
  //     const eventCards = this.native.locator(this.locators.eventCards);
  //     const eventCard = eventCards.nth(sequenceNumber - 1);

  //     await eventCard.waitFor({ state: 'visible' });

  //     const titleElement = eventCard.locator(this.locators.eventTitle);
  //     await titleElement.waitFor({ state: 'visible' });

  //     const titleText = await titleElement.innerText();
  //     console.log(`Event Card at position ${sequenceNumber} has title: "${titleText}"`);

  //     return titleText;

  //   } catch (error) {
  //     console.error(`Failed to view event card at position "${sequenceNumber}":`, error.message);
  //     throw new Error(`Could not select or click on the event card at position "${sequenceNumber}".`);
  //   }
  // }

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
        logger.logError(`Banner not present for event card titled "${eventTitle}"`)
        throw new Error(`Banner for the event card titled "${eventTitle}" does not have a valid background-image URL.`);
      }
      logger.logInfo(`Banner background image URL on the event card titled "${eventTitle}" is: ${backgroundImageUrl}`);

    } catch (error) {
      logger.logError(`Error occured while banner verification: ${error.message}`);
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
        logger.logError("Date and time text is missing or not visible.")
        throw new Error("Date and time text is missing or not visible.");
      }

      const dateTimeRegex = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2} \| \d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM)/;
      if (!dateTimeRegex.test(dateAndTimeText.trim())) {
        logger.logError(`Date and time format is incorrect: ${dateAndTimeText}`)
        throw new Error(`Date and time format is incorrect`);
      }

      logger.logInfo(`Date and time on the event card are displayed correctly: ${dateAndTimeText}`);
    } catch (error) {
      logger.logError(`Error occured while date and time verification : ${error.message}`);
      throw error;
    }
  }

  async clickViewEventButton(eventTitle) {
    try {
      const eventCardSelector = this.locators.eventCard(eventTitle);

      await this.native.waitForSelector(eventCardSelector);
      const eventCard = this.native.locator(eventCardSelector);

      await eventCard.waitFor({ state: 'visible', timeout: 5000 });

      const viewEventLinkSelector = this.locators.viewEventLink;
      await this.native.waitForSelector(viewEventLinkSelector);
      const viewEventLink = eventCard.locator(viewEventLinkSelector);
      await viewEventLink.waitFor({ state: 'visible', timeout: 5000 });

      console.log(`Event Card with title "${eventTitle}" is present`);

      const hrefValue = await viewEventLink.getAttribute('href');
      console.log(`Href value of the link: ${hrefValue}`);

      if (await viewEventLink.isEnabled()) {
        if (hrefValue) {
          await this.native.goto(hrefValue);
          console.log(`Navigated to ${hrefValue}`);
        } else {
          console.warn(`Href value not found for the link in card "${eventTitle}".`);
          throw new Error(`Href value not found for the link`);
        }
      } else {
        logger.logError(`View event link in card "${eventTitle}" is not clickable.`);
        throw new Error(`View event link in card "${eventTitle}" is not clickable.`);
      }

    } catch (error) {
      logger.logError(`Error occured while clicking on view event with title "${eventTitle}": ${error.message}`);
      throw new Error(`Could not click "View event" on event card with title "${eventTitle}".`);
    }
  }

}

module.exports = { EventsHubPage };
