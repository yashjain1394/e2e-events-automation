const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        // Ensure the path is correctly defined
        this.logFilePath = path.join(__dirname, 'test-logs.log');
        this.COLORS = {
            reset: '\x1b[0m',
            fg: {
                green: '\x1b[32m',
                yellow: '\x1b[33m',
                red: '\x1b[31m',
                cyan: '\x1b[36m',
                bright: '\x1b[1m',
                black: '\x1b[30m' 
            },
            style: {
                bold: '\x1b[1m' 
            }
        };
    }

    logHeading(message) {
        console.log(`${this.COLORS.style.bold}${this.COLORS.fg.black}${message}${this.COLORS.reset}`);
        this.writeLog('HEADING', message);
    }

    logInfo(message) {
        console.log(`${this.COLORS.fg.green}${message}${this.COLORS.reset}`);
        this.writeLog('INFO', message);
    }

    logWarning(message) {
        console.warn(`${this.COLORS.fg.yellow}${message}${this.COLORS.reset}`);
        this.writeLog('WARNING', message);
    }

    logError(message) {
        console.error(`${this.COLORS.fg.red}${message}${this.COLORS.reset}`);
        this.writeLog('ERROR', message);
    }

    writeLog(level, message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level}] ${message}\n`;

        // Use the correct path variable
        fs.appendFileSync(this.logFilePath, logMessage);
    }
}

// Export the Logger class
module.exports = Logger;
