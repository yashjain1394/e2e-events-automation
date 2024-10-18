const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class AdditionalContent extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            additionalContentLabel: '//*[@id="additional-content"]',





        };
    }
    

}
module.exports = { AdditionalContent };