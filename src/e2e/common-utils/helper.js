// helpers.js
const getDynamicEventNames = () => {
    const eventNamesFromEnv = process.env.EVENTS;
  
    if (eventNamesFromEnv) {
      return eventNamesFromEnv.split(',').map(name => name.trim());
    }

    return ["Adam's Creative Jelly Jam", 'E2E Event', 'World UAT Expo'];
  };
  
  module.exports = { getDynamicEventNames };
  