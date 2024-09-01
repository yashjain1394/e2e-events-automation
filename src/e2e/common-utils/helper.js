const getDynamicEventNames = () => {
    const eventNamesFromEnv = process.env.EVENTS;
  
    if (eventNamesFromEnv) {
      return eventNamesFromEnv.split(',').map(name => name.trim());
    }

    return ['PixelArt Expo', 'Create Now Pittsburgh'];
  };
  
  module.exports = { getDynamicEventNames };
  