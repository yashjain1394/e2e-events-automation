const { EventsBasePage } = require('./eventsBase.page.js');

class EventsHubPage extends EventsBasePage {
  constructor() {
    super('/events/hub');
    this.locators = {
      photographyCategoryButton: (categoryName) => `button[data-group="${categoryName}"]`,
      videoCategoryButton: (categoryName) => `button[data-group="${categoryName}"]` ,
      cardsWrapper : `[data-testid='consonant-CardsGrid']`,
      eventCards : `.consonant-Card`,
      eventCard : (eventTitle) => `.consonant-Card-title[title="${eventTitle}"]`,
      viewEventLink: `//a[span[text()='View event']]`
    };
  }

  async selectCategory(categoryName) {
    const selector = this.locators.videoCategoryButton(categoryName);
    await this.native.locator(selector).click();  
  }

  async areEventCardsVisible() {
    await this.native.waitForSelector(this.locators.cardsWrapper);
    const cards = await this.native.locator(this.locators.eventCards);
    const count = await cards.count();
    return count > 0;
  }

  async viewEventByTitle(eventTitle) {
    const eventCardSelector = this.locators.eventCard(eventTitle);
    const eventCard = await this.native.locator(eventCardSelector);
    if (await eventCard.count() > 0) {
      const isVisible = await eventCard.locator('a').isVisible();
      console.log(`View Event link visibility: ${isVisible}`);
      //await eventCard.locator('a').click();
    } else {
      throw new Error(`Event with title "${eventTitle}" not found`);
    }
  }
}

module.exports = { EventsHubPage };
