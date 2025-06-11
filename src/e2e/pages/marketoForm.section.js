const {
  Section,
} = require("@amwp/platform-ui-automation/lib/common/page-objects/section.js");

class MarketoFormSection extends Section {
  constructor() {
    super();
    this.marketo = {
      marketoForm: ".marketo form",
      registerButton: '[data-mkto-btn-submit="Register"]',
      successMessage: ".marketo.success p.ty-message",
    };
  }

  async fillFormData(formData) {
    for (const [fieldLabel, value] of Object.entries(formData)) {
      let fieldLocator = null;

      // Try by placeholder first
      fieldLocator = this.native
        .locator(this.marketo.marketoForm)
        .getByPlaceholder(fieldLabel);

      const count = await fieldLocator.count();
      if (count === 0) {
        // Try by label
        fieldLocator = this.native
          .locator(this.marketo.marketoForm)
          .getByLabel(fieldLabel);
        const labelCount = await fieldLocator.count();

        if (labelCount === 0) {
          // Try input with placeholder
          fieldLocator = this.native
            .locator(this.marketo.marketoForm)
            .locator(`input[placeholder*="${fieldLabel}"]`);
          const inputCount = await fieldLocator.count();

          if (inputCount === 0) {
            // Try select by first option text
            const selectElements = this.native
              .locator(this.marketo.marketoForm)
              .locator("select");
            const selectCount = await selectElements.count();

            let foundSelect = false;
            for (let i = 0; i < selectCount; i++) {
              const selectElement = selectElements.nth(i);
              const firstOptionText = await selectElement
                .locator("option")
                .first()
                .textContent();

              if (firstOptionText && firstOptionText.includes(fieldLabel)) {
                fieldLocator = selectElement;
                foundSelect = true;
                break;
              }
            }

            if (!foundSelect) {
              continue;
            }
          }
        }
      }

      await fieldLocator.waitFor({ state: "visible" });

      const tagName = await fieldLocator
        .first()
        .evaluate((el) => el.tagName.toLowerCase());

      if (tagName === "select") {
        await fieldLocator.selectOption({ label: value });
      } else {
        await fieldLocator.fill(value);
      }
    }
  }

  async submitForm() {
    const registerButton = this.native.locator(this.marketo.registerButton);
    await registerButton.waitFor({ state: "visible" });
    await registerButton.click();
  }

  getSuccessMessage() {
    return this.native.locator(this.marketo.successMessage);
  }

  async getSuccessMessageText() {
    const successMessage = this.getSuccessMessage();
    await successMessage.waitFor({ state: "visible" });
    return await successMessage.textContent();
  }
}

module.exports = { MarketoFormSection };
