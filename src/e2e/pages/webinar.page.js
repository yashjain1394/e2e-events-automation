const { classes } = require("polytype");
const { EventDetailPage } = require("./eventDetails.page.js");
const { MarketoFormSection } = require("./marketoForm.section.js");

class WebinarPage extends classes(EventDetailPage, MarketoFormSection) {
  constructor(contentPath) {
    super({
      super: EventDetailPage,
      arguments: [contentPath],
    });
  }
}

module.exports = { WebinarPage };
