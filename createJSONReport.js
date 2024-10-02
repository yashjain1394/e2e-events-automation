const fs = require('fs');
const path = require('path');

const reportDir = './reports'; 
const outputDir = './reports/combinedJSONs'; 

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

        const currentDate = new Date().toISOString().slice(0, 10); 
        const outputFilePath = path.join(outputDir, `${currentDate}_${dataFile}`);

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

mergeMetadataWithLogs();
