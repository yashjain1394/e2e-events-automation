const { GnavPage } = require('@amwp/platform-ui-lib-adobe/lib/common/page-objects/gnav.page');

class EventsBasePage extends GnavPage {
  constructor(urlPath, options) {
    process.env.env = global.config.profile.profile;
    process.env.locale =
    global.config.profile.locale && global.config.profile.locale !== "default" ? global.config.profile.locale : "us";
    let localizedPath;
    if (process.env.locale !== "us") {ß
      localizedPath = `${process.env.locale}${urlPath}`;
    } else {
      localizedPath = `${urlPath}`;
    }
    console.log("Localized Path:", localizedPath);
    super(localizedPath, options);
    this.isLocale();
    this.isEnv();
  }

  /**
   * Logic for locale step
   * @param {*} neg - (not )?
   * @param  {...any} locale - one to many ratio, seperated by comma
   * @returns boolean
   */
  async isLocale(neg, ...locale) {
    let isIncluded = locale.some((element) =>
      element.includes(process.env.locale)
    );
    if ((neg && !isIncluded) || (!neg && isIncluded)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Logic for environment step
   * @param {*} neg - (not )?
   * @param  {...any} env - one to many ratio, seperated by comma
   * @returns boolean
   */
  async isEnv(neg, ...env) {
    let isIncluded = env.some((element) => element.includes(process.env.env));
    if ((neg && !isIncluded) || (!neg && isIncluded)) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = {EventsBasePage};