const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

class BasicInfo extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            basicInfoLabel: '//*[@id="basic-info"]',


        };
    }

    async fillCloudTypeSeriesTypeAndEventTopics(fieldsData) {

    }

}
module.exports = { BasicInfo };