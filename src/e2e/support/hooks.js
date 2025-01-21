const { 
  Before, 
  After, 
  AfterAll, 
  Status, 
  BeforeAll 
} = require('@cucumber/cucumber');

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const argv = require('minimist')(process.argv.slice(2));

const Logger = require('../common-utils/logger.js');
const logger = new Logger();

const registerEventTestData = require("../config/test-data/eventRegistration.json");
const createEventTestData   = require("../config/test-data/eventCreation.json");

BASE_URL_MAP = {
  prod: 'https://events-service-platform.adobe.io',
  stage: 'https://events-service-platform-stage.adobe.io',
  dev:   'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io'
};

let isScenarioExecuted = false; 
let loginScenarioFailed = false;
let seriesId = null;
let bearer = null;
let globalSeriesName = null;

dotenv.config();

BeforeAll(async function() {
  // 1) Determine environment
  this.env = process.env.ENV || argv.p || 'stage'; // default to stage (adjust if needed)
  
  // 2) Prepare to retrieve bearer token
  const authUrl = 'https://ims-na1-stg1.adobelogin.com/ims/token/v1'; // TODO: fill this with your Auth URL
  const FormData = require('form-data'); // Only require here if you do not need it globally

  const formData = new FormData();
  formData.append('client_id',     process.env.client_id);
  formData.append('client_secret', process.env.client_secret);
  formData.append('grant_type',    'password');
  formData.append('password',      process.env.password);
  formData.append('username',      process.env.username);
  
  try {
    const authResponse = await axios.post(authUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    bearer = authResponse.data.access_token;
  } catch (error) {
    console.error('Failed to obtain bearer token:', error.message);
    throw error;
  }

  // 3) Create a "series" and store the returned seriesId
  const BASE_URL = BASE_URL_MAP[this.env] || BASE_URL_MAP.stage; 
  const randomSixDigits = ("000000" + Math.floor(Math.random() * 1000000)).slice(-3); // 6 digits
  const seriesNameRand = `automationSeriesTest${randomSixDigits}`;

  const X_API_KEY = process.env.X_API_KEY;
  const X_CLIENT_IDENTITY = 
  this.env === 'prod'
    ? process.env.X_CLIENT_IDENTITY_PROD
    : process.env.X_CLIENT_IDENTITY;

  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': bearer,
      'x-api-key': X_API_KEY,
      'x-client-identity': X_CLIENT_IDENTITY
    },
    timeout: 10000 // 10 seconds timeout
  });

  try {
    const seriesResponse = await apiClient.post('/v1/series', {
      seriesName:        seriesNameRand,
      seriesDescription: "test",
      cloudType:         "CreativeCloud",
      templateId:        "/events/fragments/event-templates/dme/simple",
      seriesStatus:      "draft",
    });

    seriesId = seriesResponse.data.seriesId;
    globalSeriesName = seriesNameRand; 

    console.log('Series created successfully:', seriesResponse.data);
  } catch (error) {
    console.error('Error creating series:', error.message);
    throw error;
  }
});

/********************************************************************
 * BEFORE (Scenario-Level)
 *   1) Set environment & browser from ENV or CLI
 *   2) Prepare credentials for event registration / creation
 *   3) Conditional checks (e.g., skipping scenarios, etc.)
 ********************************************************************/
Before(async function (scenario) {
  // 1) Basic setup
  this.env     = process.env.ENV || argv.p || 'stage';
  this.browser = process.env.BROWSER || argv.b || 'chrome';
  this.seriesName = globalSeriesName
  // 2) Prepare credentials
  this.credentialsRegisterEvent = {
    username: process.env.USERNAME || registerEventTestData.userInfo.username,
    password: process.env.PASSWORD || registerEventTestData.userInfo.password,
  };
  this.credentialsCreateEvent = {
    username: process.env.USERNAME || createEventTestData.eventCreationUserInfo.username,
    password: process.env.PASSWORD || createEventTestData.eventCreationUserInfo.password,
  };

  // If the user passed in a specific EVENT name
  this.overrideEventName = process.env.EVENT || null;

  const scenarioName = scenario.pickle.name;
  logger.logHeading(`Starting Scenario: ${scenarioName}`);

  // 3) Skip logic if previous scenario caused a "login" failure
  if (loginScenarioFailed && scenarioName !== 'Verify ECC dashboard page content') {
    // This scenario will be skipped
    return 'skipped';
  }

  // 4) Check if scenario is "Validate and register events"
  //    - If in prod, require an EVENT name
  //    - If event was already executed, skip again
  if (scenarioName === 'Validate and register events') {
    if (this.env === 'prod' && !this.overrideEventName) {
      logger.logError("Skipping scenario: EVENT not provided for production");
      throw new Error('Scenario skipped: EVENT not provided for production');
    }

    if (this.overrideEventName && isScenarioExecuted) {
      logger.logError("Skipping scenario: Event already executed.");
      throw new Error('Scenario skipped: Event already executed.');
    }
  }
});

/********************************************************************
 * AFTER (Scenario-Level)
 *   1) Mark that 'Validate and register events' scenario has run
 *   2) If 'Verify ECC dashboard page content' failed, track it
 ********************************************************************/
After(function (scenario) {
  const scenarioName = scenario.pickle.name;

  if (scenarioName === 'Validate and register events') {
    isScenarioExecuted = true;
  }

  if (scenarioName === 'Verify ECC dashboard page content' && scenario.result.status === Status.FAILED) {
    loginScenarioFailed = true;
  }
});

/********************************************************************
 * AFTER ALL
 *   1) Write metadata file
 *   2) Delete the series that was created in BeforeAll
 ********************************************************************/
AfterAll(async function () {
  try {
    // 1) Write metadata file
    const metadata = {
      browser:     { name: "Browser",     value: this.browser || 'chrome' },
      environment: { name: "Environment", value: this.env     || 'stage'  }
    };
    
    // Ensure global.config.profile is defined in your project
    const metadataFilePath = path.join(
      global.config.profile.reportDir, 
      `metadata_${global.config.profile.reportTimestamp}.json`
    );

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata written to: ${metadataFilePath}`);
  } catch (err) {
    console.error(`Error writing metadata in AfterAll hook: ${err.message}`);
  }

  // 2) Delete the series that was created
  if (!seriesId || !bearer) {
    console.warn('No seriesId or bearer token to delete the series. Skipping deletion.');
    return;
  }

  const BASE_URL = BASE_URL_MAP[this.env] || BASE_URL_MAP.stage;
  const X_CLIENT_IDENTITY = process.env.X_CLIENT_IDENTITY;
  const X_API_KEY         = process.env.X_API_KEY;

  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': bearer,
      'x-api-key': X_API_KEY,
      'x-client-identity': X_CLIENT_IDENTITY
    },
    timeout: 10000
  });

  try {
    console.log(`Deleting series with ID: ${seriesId}`);
    const response = await apiClient.delete(`/v1/series/${seriesId}`);
    console.log('Series deletion response:', response.data);
  } catch (error) {
    console.error('Error deleting the series:', error.message);
    throw error;
  }
});
