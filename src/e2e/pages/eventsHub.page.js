const { EventsBasePage } = require('./eventsBase.page.js');

class EventsHubPage extends EventsBasePage {
  constructor() {
    super('/events/hub');
    this.locators = {
      categoryButton: (categoryName) => `button[data-group="${categoryName}"]` 
    };
  }


  async selectCategory(categoryName) {
    const selector = this.locators.categoryButton(categoryName);
    await this.page.locator(selector).click();  
  }

}

module.exports = { EventsHubPage };
