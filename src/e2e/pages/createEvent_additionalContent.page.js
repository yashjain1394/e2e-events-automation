const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const { BasicInfo } = require('./createEvent_basicInfo.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();
const { getFilePath } = require('../common-utils/helper.js');

class AdditionalContent extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            additionalContentLabel: '//*[@id="additional-content"]',
            addProductPromotionImg: 'product-selector-group repeater-element[text="Add product promotion"] img',
            productPicker: (productSelectorIndex) => `product-selector-group product-selector:nth-of-type(${productSelectorIndex+1}) sp-picker[label="Select a product"]`,
            productPickerOption: (productSelectorIndex,productName) => `product-selector-group product-selector:nth-of-type(${productSelectorIndex+1}) sp-menu-item[value="${this.convertProductNameToValue(productName)}"]`,
            productCheckbox: (productSelectorIndex) => `product-selector-group product-selector:nth-of-type(${productSelectorIndex+1}) sp-checkbox`,
            savePartnerButton: 'partner-selector-group partner-selector sp-button[variant="primary"]',
            includePartnersCheckbox: 'sp-checkbox[id="partners-visible"] input[type="checkbox"]',
            partnerName: 'partner-selector-group partner-selector custom-search custom-textfield sp-textfield[placeholder="Enter partner name"] input[placeholder="Enter partner name"]',
            partnerUrl: 'partner-selector-group partner-selector sp-textfield[placeholder="Enter partner full URL"] input[placeholder="Enter partner full URL"]',
            partnerImage: 'partner-selector-group partner-selector image-dropzone input.img-file-input',
            heroImageDropzone: 'image-dropzone[id="hero-image"] input.img-file-input',
            thumbnailImageDropzone: 'image-dropzone[id="thumbnail-image"] input.img-file-input',
            venueImageDropzone: 'image-dropzone[id="venue-image"] input.img-file-input',
            venueImageCheckbox: 'sp-checkbox[id="checkbox-venue-image-visible"] input[type="checkbox"]',

        };
    }

    async fillRelatedProducts(relatedProducts) {

        try{
        const basicInfo = new BasicInfo();
        // Fill the related products
        const relatedProductsArray = relatedProducts.split(',').map(product => product.trim());
        // console.log('Related Products:', relatedProductsArray);
        for (let j = 0; j < relatedProductsArray.length; j++) {
            const relatedProductsItem = relatedProductsArray[j];
            // console.log(relatedProductsItem);

            // Click the Add Product promotion button if there are multiple items
            if (j > 0) {
                logger.logInfo(`${relatedProductsItem}: Clicking the Add Product promotion button`);
                const addProductPromotionImgLocator = this.native.locator(this.locators.addProductPromotionImg);
                await addProductPromotionImgLocator.click();
                logger.logInfo(`${relatedProductsItem}: Clicked the Add Product promotion button successfully`);
            }

            // Click the product dropdown
            logger.logInfo(`${relatedProductsItem}: Clicking the product picker`);
            const productPickerLocator = this.native.locator(this.locators.productPicker(j));
            await productPickerLocator.click();
            logger.logInfo(`${relatedProductsItem}: Clicked the product picker successfully`);

            // Use a more specific locator for selecting the product option
            const productPickerOptionLocator = this.native.locator(this.locators.productPickerOption(j,relatedProductsItem));
            if (!productPickerOptionLocator) {
                logger.logError(`${relatedProductsItem}: product type option not found`);
            }
            await productPickerOptionLocator.click();
            logger.logInfo(`${relatedProductsItem}: Selected the product option successfully`);
            

            // Check the checkbox for the product
            const productCheckboxLocator = this.native.locator(this.locators.productCheckbox(j));
            await productCheckboxLocator.click();
            logger.logInfo(`${relatedProductsItem}: Checked the product checkbox successfully`);
        }
    }catch (error) {
        logger.logError(`Error in filling the related products: ${error.message}`);
        throw new Error(`Error in filling the related products: ${error.message}`);
    }
    }

    async checkIncludePartnersCheckbox(includePartnersCheckbox) {
        try {
            if(includePartnersCheckbox.toLowerCase()==='checked'){
            const includePartnersCheckboxLocator = this.native.locator(this.locators.includePartnersCheckbox);
            await includePartnersCheckboxLocator.click();
            logger.logInfo('Include partners checkbox is checked');
            }
            else{
                logger.logInfo('Include partners checkbox is not checked');
            }
        } catch (error) {
            logger.logError(`Error in checking the include partners checkbox: ${error.message}`);
            throw new Error(`Error in checking the include partners checkbox: ${error.message}`);
        }
    }

    async fillPartnerName(partnerName) {
        try {
            const partnerNameInputLocator = this.native.locator(this.locators.partnerName);
            await partnerNameInputLocator.fill(partnerName);
            logger.logInfo(`Filled the partner name: ${partnerName}`);
        } catch (error) {
            logger.logError(`Error in filling the partner name: ${error.message}`);
            throw new Error(`Error in filling the partner name: ${error.message}`);
        }
    }

    async fillPartnerUrl(partnerUrl) {
        try {
            const partnerUrlInputLocator = this.native.locator(this.locators.partnerUrl);
            await partnerUrlInputLocator.fill(partnerUrl);
            logger.logInfo(`Filled the partner URL: ${partnerUrl}`);
        } catch (error) {
            logger.logError(`Error in filling the partner URL: ${error.message}`);
            throw new Error(`Error in filling the partner URL: ${error.message}`);
        }
    }

    async uploadPartnerImage(partnerImage) {
        try {
            const partnerImageInputLocator = this.native.locator(this.locators.partnerImage);
            try{
            const partnerImagePath = await getFilePath(partnerImage);
            await partnerImageInputLocator.setInputFiles(partnerImagePath);
            }catch(error){
                logger.logError(`Error in uploading the partner image: ${error.message}`);
            }
            logger.logInfo(`Uploaded the partner image: ${partnerImage}`);
        } catch (error) {
            logger.logError(`Error in uploading the partner image: ${error.message}`);
            throw new Error(`Error in uploading the partner image: ${error.message}`);
        }
    }

    async clickSavePartnerButton() {
        try {
            const savePartnerButtonLocator = this.native.locator(this.locators.savePartnerButton);
            const isEnabled = await savePartnerButtonLocator.isEnabled();
            
            if (isEnabled) {
                await savePartnerButtonLocator.click();
                logger.logInfo('Save Partner button clicked successfully');
            } else {
                logger.logInfo('Save Partner button is not enabled');
            }
        } catch (error) {
            logger.logError(`Error in clicking the save partner button: ${error.message}`);
            throw new Error(`Error in clicking the save partner button: ${error.message}`);
        }
    }

    async uploadHeroImage(heroImage) {
        try {
            const heroImageInputLocator = this.native.locator(this.locators.heroImageDropzone);
            try{
            const heroImagePath = await getFilePath(heroImage);
            await heroImageInputLocator.setInputFiles(heroImagePath);
            }catch(error){
                logger.logError(`Error in uploading the hero image: ${error.message}`);
            }
            logger.logInfo(`Uploaded the hero image: ${heroImage}`);
        } catch (error) {
            logger.logError(`Error in uploading the hero image: ${error.message}`);
            throw new Error(`Error in uploading the hero image: ${error.message}`);
        }
    }

    async uploadThumbnailImage(thumbnailImage) {
        try {
            const thumbnailImageInputLocator = this.native.locator(this.locators.thumbnailImageDropzone);
            try{
            const thumbnailImagePath = await getFilePath(thumbnailImage);
            await thumbnailImageInputLocator.setInputFiles(thumbnailImagePath);
            }catch(error){
                logger.logError(`Error in uploading the thumbnail image: ${error.message}`);
            }
            logger.logInfo(`Uploaded the thumbnail image: ${thumbnailImage}`);
        } catch (error) {
            logger.logError(`Error in uploading the thumbnail image: ${error.message}`);
            throw new Error(`Error in uploading the thumbnail image: ${error.message}`);
        }
    }

    async uploadVenueImage(venueImage) {
        try {
            const venueImageInputLocator = this.native.locator(this.locators.venueImageDropzone);
            try{
            const venueImagePath = await getFilePath(venueImage);
            await venueImageInputLocator.setInputFiles(venueImagePath);
            }catch(error){
                logger.logError(`Error in uploading the venue image: ${error.message}`);
            }
            logger.logInfo(`Uploaded the venue image: ${venueImage}`);
        } catch (error) {
            logger.logError(`Error in uploading the venue image: ${error.message}`);
            throw new Error(`Error in uploading the venue image: ${error.message}`);
        }
    }

    async checkVenueImageCheckbox(venueImageCheckbox) {
        try {
            if(venueImageCheckbox.toLowerCase()==='checked'){
            const venueImageCheckboxLocator = this.native.locator(this.locators.venueImageCheckbox);
            await venueImageCheckboxLocator.click();
            logger.logInfo('Venue image checkbox is checked');
            }
            else{
                logger.logInfo('Venue image checkbox is not checked');
            }
        } catch (error) {
            logger.logError(`Error in checking the Venue image checkbox: ${error.message}`);
            throw new Error(`Error in checking the Venue image checkbox: ${error.message}`);
        }
    }

    // Helper function to convert product name to value
    convertProductNameToValue(productName) {
    logger.logInfo(`Converting product name to value: ${productName}`);
    return productName.toLowerCase().replace(/\s+/g, '-');
    }

}
module.exports = { AdditionalContent };