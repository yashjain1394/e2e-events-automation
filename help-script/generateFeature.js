const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const YOUR_SITEMAP_URL =
  "https://www.adobe.com/events/create-now/events-sitemap.xml";
const OUTPUT_FEATURE_PATH = "src/e2e/features/productionMonitoring.feature";

function parseEventNameFromUrl(urlString) {
  const url = new URL(urlString);
  const pathParts = url.pathname.split("/").filter(Boolean);

  const eventsIndex = pathParts.indexOf("events");
  if (eventsIndex === -1) return null;
  if (pathParts.length <= eventsIndex + 2) return null;

  const rawEventSegment = pathParts[eventsIndex + 2];
  const spaced = rawEventSegment.replace(/-/g, " ");

  const capitalized = spaced
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return capitalized;
}

function getRelativeUrl(urlString) {
  const urlObj = new URL(urlString);
  const relativeUrl = urlObj.pathname + urlObj.search + urlObj.hash;
  return relativeUrl;
}

(async function generateFeature() {
  try {
    console.log(`Fetching sitemap from: ${YOUR_SITEMAP_URL} ...`);
    const sitemapResponse = await axios.get(YOUR_SITEMAP_URL);
    const sitemapXML = sitemapResponse.data;

    console.log("Parsing sitemap XML...");
    const sitemapJson = await parseStringPromise(sitemapXML);

    const urlEntries = sitemapJson.urlset.url || [];
    const urls = urlEntries.map((entry) => entry.loc[0]);

    const eventData = urls
      .map((absoluteUrl) => {
        const eventName = parseEventNameFromUrl(absoluteUrl);
        if (!eventName) return null;

        const relativeUrl = getRelativeUrl(absoluteUrl);
        return {
          eventName,
          urlString: relativeUrl,
        };
      })
      .filter((item) => !!item);

    if (eventData.length === 0) {
      console.warn("No valid event URLs found in sitemap! Exiting.");
      return;
    }

    const featureHeader = `@prod-monitor
Feature: Event Registration

   Scenario Outline: Validate and register events "<EventName>"
    Given I go to "<URL>"
    Then I wait for 5 seconds
    Then I navigate to Event Detail page "<EventName>"
    And I should see the event details on the page
    And I should see the Venue on the event details page
    And I should see the Agenda on the event details page
    And I should see profile cards for speakers and host
    And I verify the CTA in the related products blade
    And I verify the partners section

  Examples: DynamicEvents
    | EventName | URL |
`;

    const exampleRows = eventData
      .map(({ eventName, urlString }) => `    | ${eventName} | ${urlString} |`)
      .join("\n");

    const finalFeatureContent = featureHeader + exampleRows + "\n";

    const dirName = path.dirname(OUTPUT_FEATURE_PATH);
    fs.mkdirSync(dirName, { recursive: true });

    fs.writeFileSync(OUTPUT_FEATURE_PATH, finalFeatureContent, "utf8");

    console.log(
      `Successfully wrote ${OUTPUT_FEATURE_PATH} with ${eventData.length} row(s).`
    );
  } catch (err) {
    console.error("Error generating feature file:", err);
    process.exit(1);
  }
})();
