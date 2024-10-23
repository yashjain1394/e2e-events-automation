const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class SpeakersAndHosts extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            speakersAndHostsLabel: '//*[@id="speakers-and-hosts"]',
        };
    }
}
module.exports = { SpeakersAndHosts };