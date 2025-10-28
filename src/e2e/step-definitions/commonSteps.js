const { Given, Then } = require("@cucumber/cucumber");
const {
  GnavPage,
} = require("@amwp/platform-ui-lib-adobe/lib/common/page-objects/gnav.page.js");
const {
  AdobeIdSigninPage,
} = require("@amwp/platform-ui-lib-adobe/lib/common/page-objects/adobeidsingin.page.js");
const { WebinarPage } = require("../pages/webinar.page.js");
const path = require("path");
const fs = require("fs");
const YAML = require("yaml");

Then(/^I have a new browser context$/, async function () {
  PW.context = await PW.browser.newContext(PW.contextOptions);
});

Given(/^I go to the (.+) event "([^"]*)"$/, async function (type, path) {
  const pageClass = {
    Webinar: WebinarPage,
    // "In-Person": InPersonEventPage,
  }[type];
  this.page = new pageClass(path);

  await this.page.open();
});

Then(
  /^I sign in with '([^\"]*)' test account(| from the gnav)$/,
  async function (account, gnavSignIn) {
    // Store original context to restore after sign-in
    const originalPage = this.page;

    if (gnavSignIn) {
      this.context(GnavPage);
      await this.page.signIn.click();
    }

    this.context(AdobeIdSigninPage);

    const accounts = path.resolve(__dirname, "../config/accounts.yml");
    const accountsCfg = YAML.parse(fs.readFileSync(accounts, "utf8"));

    if (!(account in accountsCfg)) {
      throw `The account '${account}' is not in accounts.yml`;
    }
    let username = accountsCfg[account];
    let password = process.env.ADOBEID_PASSWORD;

    if (!username || !password) {
      throw new Error("No environment variable: ADOBEID_PASSWORD");
    }
    await this.page.signIn(username, password);

    // Restore original context
    this.page = originalPage;
  }
);
