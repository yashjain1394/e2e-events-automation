class Logger {
    constructor() {
        this.COLORS = {
            reset: '\x1b[0m',
            fg: {
                green: '\x1b[32m',
                yellow: '\x1b[33m',
                red: '\x1b[31m',
                cyan: '\x1b[36m',
                bright: '\x1b[1m'
            }
        };
    }

    logInfo(message) {
        console.log(`${this.COLORS.fg.green}${message}${this.COLORS.reset}`);
    }

    logWarning(message) {
        console.warn(`${this.COLORS.fg.yellow}${message}${this.COLORS.reset}`);
    }

    logError(message) {
        console.error(`${this.COLORS.fg.red}${message}${this.COLORS.reset}`);
    }

    logFeatureStart(featureName) {
        console.log(`${this.COLORS.fg.cyan}${this.COLORS.bright}Starting Feature: ${featureName}${this.COLORS.reset}`);
    }

    logScenarioStart(scenarioName) {
        console.log(`${this.COLORS.fg.green}Starting Scenario: ${scenarioName}${this.COLORS.reset}`);
    }
}

// Export the Logger class
module.exports = Logger;
