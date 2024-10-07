const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
let report;
let puppeteer;

// Check if 'multiple-cucumber-html-reporter' is installed
try {
  require.resolve('multiple-cucumber-html-reporter');
  report = require('multiple-cucumber-html-reporter');
  console.log('multiple-cucumber-html-reporter is already installed.');
} catch (e) {
  console.log('Installing multiple-cucumber-html-reporter...');
  execSync('npm install multiple-cucumber-html-reporter', { stdio: 'inherit' });
  report = require('multiple-cucumber-html-reporter'); // Require it after installation
}

// Check if 'puppeteer' is installed
try {
  require.resolve('puppeteer');
  puppeteer = require('puppeteer');
  console.log('Puppeteer is already installed.');
} catch (e) {
  console.log('Installing Puppeteer...');
  execSync('npm install puppeteer', { stdio: 'inherit' });
  puppeteer = require('puppeteer'); // Require it after installation
}

// Set the output directory for the JSON files and report
const jsonDir = 'C:\\Users\\labuser\\Desktop\\AutoEventsReports\\label=AutoEvents\\reports\\combinedJSONs';
const outputDir = 'htmlReport';
const tempDir = 'tempJsonFiles';

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory at: ${outputDir}`);
}

// Create a temporary directory for filtered JSON files
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`Created temporary directory at: ${tempDir}`);
}

// Get the date argument from command line arguments
const dateArg = process.argv[2]; // This should be passed when running the script

async function generateHtmlReport() {
  try {
    // Filter JSON files that contain the date in their name
    const combinedJsonFiles = fs.readdirSync(jsonDir)
      .filter(file => file.endsWith('.json') && file.includes(dateArg));

    // Debug output to check the filtered files
    console.log('Filtered JSON files:', combinedJsonFiles);

    if (combinedJsonFiles.length === 0) {
      console.error(`No JSON files found in the output directory for date: ${dateArg}.`);
      process.exit(1); // Fail the build
    }

    // Copy filtered JSON files to the temporary directory
    combinedJsonFiles.forEach(file => {
      const oldPath = path.join(jsonDir, file);
      const newPath = path.join(tempDir, file);
      fs.copyFileSync(oldPath, newPath);
      console.log(`Copied file: ${file} to temporary directory.`);
    });

    // Generate the report using the JSON files in the temporary directory
    report.generate({
      jsonDir: tempDir,  // Specify the temporary directory containing JSON files
      reportPath: outputDir,  // Output path for the report
      reportName: "Auto Events Report",
      pageTitle: "Auto Events Report",
      pageFooter: '<div style="text-align:center;"><p>Contact us for any support: <b>Grp-ccwt-e2e-support</b></p></div>',
      customMetadata: true,
      openReportInBrowser: false,
      saveReport: true,
    });

    console.log(`HTML report generated successfully at: ${outputDir}`);

    // Take a screenshot of the generated report
    await takeScreenshot(outputDir);
  } catch (err) {
    console.error(`Error generating HTML report: ${err.message}`);
    process.exit(1); // Fail the build on error
  } finally {
    // Optionally, clean up the temporary directory after report generation
    fs.readdirSync(tempDir).forEach(file => {
      fs.unlinkSync(path.join(tempDir, file)); // Delete each file in the temporary directory
    });
    fs.rmdirSync(tempDir); // Remove the temporary directory
    console.log(`Cleaned up temporary directory: ${tempDir}`);

    // Delete the original JSON files from the jsonDir
    combinedJsonFiles.forEach(file => {
      const originalPath = path.join(jsonDir, file);
      fs.unlinkSync(originalPath); // Delete the original JSON file
      console.log(`Deleted original file: ${originalPath}`);
    });
  }
}

// Function to take a screenshot of the HTML report
async function takeScreenshot(reportDir) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the generated report (index.html)
  const reportPath = `file://${path.join(__dirname, reportDir, 'index.html')}`;
  await page.goto(reportPath);

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Take a screenshot and save it in the same directory as the HTML report
  const screenshotPath = path.join(reportDir, 'Auto_Events_Report.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(`Screenshot saved at: ${screenshotPath}`);

  await browser.close();
}

// Execute the report generation function
generateHtmlReport();
