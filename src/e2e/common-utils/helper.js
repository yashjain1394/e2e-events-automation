const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();

async function getFilePath(filePathOrUrl) {
    if (filePathOrUrl.startsWith('http')) {
        const downloadDir = path.join(__dirname, '../config/test-data');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
            logger.logInfo(`Created download directory at: ${downloadDir}`);
        }
        const downloadPath = path.join(downloadDir, path.basename(filePathOrUrl));
        await downloadImage(filePathOrUrl, downloadPath);
        logger.logInfo(`Downloaded image from URL: ${filePathOrUrl} to path: ${downloadPath}`);
        return downloadPath;
    }
    logger.logInfo(`Using local file path: ${filePathOrUrl}`);
    return filePathOrUrl;
}

async function downloadImage(url, downloadPath) {
    logger.logInfo(`Starting download of image from URL: ${url}`);
    const response = await axios({
        url,
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(downloadPath);
        response.data.pipe(writer);
        writer.on('finish', () => {
            logger.logInfo(`Successfully downloaded image to path: ${downloadPath}`);
            resolve();
        });
        writer.on('error', (error) => {
            logger.logError(`Error downloading image from URL: ${url} to path: ${downloadPath} - ${error.message}`);
            reject(error);
        });
    });
}

// Helper function to convert time string to value
function convertTimeToValue(time) {
    const [hourMinute, period] = time.split(' ');
    let [hour, minute] = hourMinute.split(':');
    if (period === 'PM' && hour !== '12') {
        hour = String(Number(hour) + 12).padStart(2, '0');
    } else if (period === 'AM' && hour === '12') {
        hour = '00';
    } else {
        hour = hour.padStart(2, '0');
    }
    minute = minute.padStart(2, '0');
    return `${hour}:${minute}:00`;
}

// Helper function to fetch time without AM/PM
function getTimeWithoutPeriod(time) {
    const match = time.match(/(\d{1,2}:\d{2})(?:\s*[APMapm]{2})?/);
    return match ? match[1] : time;
}

// Helper function to fetch AM/PM from time
function getPeriodFromTime(time) {
    const match = time.match(/(?:\d{1,2}:\d{2})(\s*[APMapm]{2})?/);
    return match ? match[1].trim() : '';
}

// Helper function to convert product name to value
function convertProductNameToValue(productName) {
    logger.logInfo(`Converting product name to value: ${productName}`);
    return productName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to remove spaces from category names and capitalize the first character after each space
function removeSpaceFromCategoryName(categoryName) {
    return categoryName.toLowerCase().replace(/\s+(\w)/g, (match, p1) => p1.toUpperCase());
    }

module.exports = { getFilePath, downloadImage, convertTimeToValue, getTimeWithoutPeriod, getPeriodFromTime, convertProductNameToValue, removeSpaceFromCategoryName };