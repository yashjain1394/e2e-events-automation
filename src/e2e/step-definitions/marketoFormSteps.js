const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then(
  "I fill all the required information in the Marketo form with:",
  async function (dataTable) {
    // Convert data table to object
    const formData = {};
    const rows = dataTable.hashes();
    for (const row of rows) {
      formData[row["Form Field"]] = row["Value"];
    }

    await expect(
      this.page.native.locator(this.page.marketo.marketoForm)
    ).toBeVisible({ timeout: 10000 });

    await this.page.fillFormData(formData);
  }
);

Then("I click the Register button", async function () {
  await this.page.submitForm();
});

Then("I see the successful registration confirmation", async function () {
  const successMessage = this.page.getSuccessMessage();

  // Assert message is visible and has content
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText(/.+/);

  const messageText = await this.page.getSuccessMessageText();
  console.log("Registration confirmation message:", messageText);
  expect(messageText).toBeTruthy();
  expect(messageText.length).toBeGreaterThan(0);
});
