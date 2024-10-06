const { execSync } = require('child_process');
const fs = require('fs');

let report;

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

// Set the output directory for the JSON files and report
const jsonDir = 'C:\\Users\\labuser\\Desktop\\AutoEventsReports\\label=AutoEvents\\reports\\combinedJSONs';
const outputDir = 'htmlReport';

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory at: ${outputDir}`);
}

// Get the date argument from command line
const dateArg = process.argv[2];

// Validate the date format (YYYY-MM-DD)
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateArg || !dateRegex.test(dateArg)) {
  console.log(`Provided Data : ${dateArg}`)
  console.error('Please provide a date in the format YYYY-MM-DD.');
  process.exit(1);
}

async function generateHtmlReport() {
  try {
    // Filter JSON files that contain the date in their name
    const combinedJsonFiles = fs.readdirSync(jsonDir)
      .filter(file => file.endsWith('.json') && file.includes(dateArg));

    if (combinedJsonFiles.length === 0) {
      console.log(`No JSON files found in the output directory for date: ${dateArg}.`);
      return;
    }

    report.generate({
      jsonDir: jsonDir, 
      reportPath: outputDir, 
      reportName: "Auto Events Report",
      pageTitle: "Auto Events Report",
      pageFooter: '<div style="text-align:center;"><p>Contact us for any support: <b>Grp-ccwt-e2e-support</b></p></div>',
      customMetadata: true,
      openReportInBrowser: false,
      saveReport: true, 
      // Specify the JSON files to include
      jsonFiles: combinedJsonFiles.map(file => `${jsonDir}\\${file}`), // Full paths
    });

    console.log(`HTML report generated successfully at: ${outputDir}`);
  } catch (err) {
    console.error(`Error generating HTML report: ${err.message}`);
  }
}

// Execute the report generation function
generateHtmlReport();