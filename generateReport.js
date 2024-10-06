const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
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
      console.log(`No JSON files found in the output directory for date: ${dateArg}.`);
      return;
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
  } catch (err) {
    console.error(`Error generating HTML report: ${err.message}`);
  } finally {
    // Optionally, clean up the temporary directory after report generation
    fs.readdirSync(tempDir).forEach(file => {
      fs.unlinkSync(path.join(tempDir, file)); // Delete each file
    });
    fs.rmdirSync(tempDir); // Remove the temporary directory
    console.log(`Cleaned up temporary directory: ${tempDir}`);
  }
}

// Execute the report generation function
generateHtmlReport();
