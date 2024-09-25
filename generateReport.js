const fs = require('fs');
const path = require('path');
const report = require('multiple-cucumber-html-reporter');

const reportDir = './reports'; 
const outputDir = './reports/combinedReports'; 

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory at: ${outputDir}`);
}

function mergeMetadataWithLogs() {
  const dataFiles = fs.readdirSync(reportDir).filter(file => file.endsWith('.json') && file.startsWith('cucumber'));
  const metadataFiles = fs.readdirSync(reportDir).filter(file => file.endsWith('.json') && file.startsWith('metadata_'));

  dataFiles.forEach(dataFile => {
    const timestamp = dataFile.split('_')[1].split('.')[0];
    const matchingMetadataFile = `metadata_${timestamp}.json`;

    if (metadataFiles.includes(matchingMetadataFile)) {
      try {
        const logContent = JSON.parse(fs.readFileSync(path.join(reportDir, dataFile), 'utf-8'));
        const metadataContent = JSON.parse(fs.readFileSync(path.join(reportDir, matchingMetadataFile), 'utf-8'));

        logContent.forEach((feature) => {
          feature.metadata = metadataContent;
        });

        const outputFilePath = path.join(outputDir, dataFile);
        fs.writeFileSync(outputFilePath, JSON.stringify(logContent, null, 2), 'utf-8');
        console.log(`Merged file saved at: ${outputFilePath}`);

      } catch (error) {
        console.error(`Error merging files: ${dataFile} and ${matchingMetadataFile}. Error: ${error.message}`);
      }
    } else {
      console.warn(`No matching metadata file found for: ${dataFile}`);
    }
  });
}

async function generateHtmlReport() {
  try {
    const combinedJsonFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.json'));

    if (combinedJsonFiles.length === 0) {
      console.log('No JSON files found in the output directory.');
      return;
    }

    report.generate({
      jsonDir: outputDir, 
      reportPath: outputDir, 
      customData: {
        title: "Details",
        data: [
          { label: "Project", value: "Auto Events" },
          { label: "Release", value: "1.2.3" },
          { label: "Cycle", value: "B11221.34321" },
          { label: "Execution Start Time", value: "Nov 19th 2017, 02:31 PM EST" },
          { label: "Execution End Time", value: "Nov 19th 2017, 02:56 PM EST" },
        ],
      },
      customMetadata: true,
      openReportInBrowser: true,
      saveReport: true, 
    });

    console.log(`HTML report generated successfully at: ${outputDir}`);
  } catch (err) {
    console.error(`Error generating HTML report: ${err.message}`);
  }
}

mergeMetadataWithLogs();
generateHtmlReport();
