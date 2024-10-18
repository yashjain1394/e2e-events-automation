const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class Rsvp extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            rsvpLabel: '//*[@id="rsvp"]',





        };
    }
    

}
module.exports = { Rsvp };