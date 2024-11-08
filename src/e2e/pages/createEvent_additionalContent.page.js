const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const { BasicInfo } = require('./createEvent_basicInfo.page.js');
const Logger = require('../common-utils/logger.js');
const logger = new Logger();
const { convertProductNameToValue } = require('../common-utils/helper.js');
const { getFilePath } = require('../common-utils/helper.js');

class AdditionalContent extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            additionalContentLabel: '//*[@id="additional-content"]',
            productSelectorGroup: 'product-selector-group',
            productSelector: 'product-selector',
            addProductPromotionRepeaterElement: 'repeater-element[text="Add product promotion"]',
            addProductPromotionImg: 'img[alt="add-circle"]',
            productPicker: 'sp-picker[label="Select a product"]',
            productPickerOption: (product) => `sp-menu-item[value="${convertProductNameToValue(product)}"]`,
            productCheckbox: 'sp-checkbox',
            partnerSelectorGroup: 'partner-selector-group',
            partnerSelector: 'partner-selector',
            partnerNameCustomSearch: 'custom-search',
            partnerNameCustomTextField: 'custom-textfield',
            partnerNameSpTextField: 'sp-textfield[placeholder="Enter partner name"]',
            partnerUrlSpTextField: 'sp-textfield[placeholder="Enter partner full URL"]',
            partnerImageDropzone: 'image-dropzone',
            savePartnerButton: 'sp-button[variant="primary"]',
            includePartnersCheckbox: 'sp-checkbox[id="partners-visible"]',
            heroImageDropzone: 'image-dropzone[id="hero-image"]',
            thumbnailImageDropzone: 'image-dropzone[id="thumbnail-image"]',
            venueImageDropzone: 'image-dropzone[id="venue-image"]',
            venueImageCheckbox: 'sp-checkbox[id="checkbox-venue-image-visible]',

        };
    }

    async fillRelatedProducts(relatedProducts) {

        try{
        const basicInfo = new BasicInfo();
        // Fill the related products
        const relatedProductsArray = relatedProducts.split(',').map(product => product.trim());
        console.log('Related Products:', relatedProductsArray);
        for (let j = 0; j < relatedProductsArray.length; j++) {
            const relatedProductsItem = relatedProductsArray[j];
            console.log(relatedProductsItem);

            const productSelectorGroupLocator = this.native.locator(this.locators.productSelectorGroup)
            
            // Click the Add Product promotion button if there are multiple items
            if (j > 0) {
                logger.logInfo('Clicking the Add Product promotion button');
                const addProductPromotionRepeaterElementLocator = await basicInfo.getHandleInsideShadowRoot(productSelectorGroupLocator, this.locators.addProductPromotionRepeaterElement);
                const addProductPromotionImgLocator = await basicInfo.getHandleInsideShadowRoot(addProductPromotionRepeaterElementLocator, this.locators.addProductPromotionImg);
                await addProductPromotionImgLocator.click();
                logger.logInfo('Clicked the Add Product promotion button successfully');
            }

            // Locate the nth Product selector within the shadow root
            
            const productSelectorLocator = await productSelectorGroupLocator.evaluateHandle((el, index) => {
                const shadowRoot = el.shadowRoot;
                return shadowRoot.querySelectorAll('product-selector')[index];
            }, j);

            // Click the product dropdown
            logger.logInfo('Clicking the product picker');
            const productPickerLocator = await basicInfo.getHandleInsideShadowRoot(productSelectorLocator, this.locators.productPicker);
            await productPickerLocator.click();
            logger.logInfo('Clicked the product picker successfully');

            // Use a more specific locator for selecting the product option
            const productPickerOptionLocator = await basicInfo.getHandleInsideShadowRoot(productSelectorLocator, this.locators.productPickerOption(relatedProductsItem));
            if (!productPickerOptionLocator) {
                logger.logError('product type option not found');
            }
            await productPickerOptionLocator.click();
            logger.logInfo(`Selected the product: ${relatedProductsItem}`);
            

            // Check the checkbox for the product
            const productCheckboxLocator = await basicInfo.getHandleInsideShadowRoot(productSelectorLocator, this.locators.productCheckbox);
            await productCheckboxLocator.click();
            logger.logInfo('Checked the product checkbox successfully');
        }
    }catch (error) {
        logger.logError(`Error in filling the related products: ${error.message}`);
        throw new Error(`Error in filling the related products: ${error.message}`);
    }
    }

    async checkIncludePartnersCheckbox(includePartnersCheckbox) {
        try {
            const basicInfo = new BasicInfo();
            const partnerSelectorGroupLocator = this.native.locator(this.locators.partnerSelectorGroup);
            const partnerSelectorLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorGroupLocator, this.locators.partnerSelector);

            if(includePartnersCheckbox==='checked'){
            const includePartnersCheckboxLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorLocator, this.locators.includePartnersCheckbox);
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
            const basicInfo = new BasicInfo();
            const partnerSelectorGroupLocator = this.native.locator(this.locators.partnerSelectorGroup);
            const partnerSelectorLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorGroupLocator, this.locators.partnerSelector);

            const partnerNameCustomSearchLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorLocator, this.locators.partnerNameCustomSearch);
            const partnerNameCustomTextFieldLocator = await basicInfo.getHandleInsideShadowRoot(partnerNameCustomSearchLocator, this.locators.partnerNameCustomTextField);
            const partnerNameSpTextFieldLocator = await basicInfo.getHandleInsideShadowRoot(partnerNameCustomTextFieldLocator, this.locators.partnerNameSpTextField);
            const partnerNameInputLocator = await basicInfo.getHandleInsideShadowRoot(partnerNameSpTextFieldLocator, 'input');
            await partnerNameInputLocator.fill(partnerName);
            logger.logInfo(`Filled the partner name: ${partnerName}`);
        } catch (error) {
            logger.logError(`Error in filling the partner name: ${error.message}`);
            throw new Error(`Error in filling the partner name: ${error.message}`);
        }
    }

    async fillPartnerUrl(partnerUrl) {
        try {
            const basicInfo = new BasicInfo();
            const partnerSelectorGroupLocator = this.native.locator(this.locators.partnerSelectorGroup);
            const partnerSelectorLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorGroupLocator, this.locators.partnerSelector);

            const partnerUrlSpTextFieldLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorLocator, this.locators.partnerUrlSpTextField);
            const partnerUrlInputLocator = await basicInfo.getHandleInsideShadowRoot(partnerUrlSpTextFieldLocator, 'input');
            await partnerUrlInputLocator.fill(partnerUrl);
            logger.logInfo(`Filled the partner URL: ${partnerUrl}`);
        } catch (error) {
            logger.logError(`Error in filling the partner URL: ${error.message}`);
            throw new Error(`Error in filling the partner URL: ${error.message}`);
        }
    }

    async uploadPartnerImage(partnerImage) {
        try {
            const basicInfo = new BasicInfo();
            const partnerSelectorGroupLocator = this.native.locator(this.locators.partnerSelectorGroup);
            const partnerSelectorLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorGroupLocator, this.locators.partnerSelector);

            const partnerImageDropzoneLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorLocator, this.locators.partnerImageDropzone);
            const partnerImageInputLocator = await basicInfo.getHandleInsideShadowRoot(partnerImageDropzoneLocator, 'input.img-file-input');
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
            const basicInfo = new BasicInfo();
            const partnerSelectorGroupLocator = this.native.locator(this.locators.partnerSelectorGroup);
            const partnerSelectorLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorGroupLocator, this.locators.partnerSelector);

            const savePartnerButtonLocator = await basicInfo.getHandleInsideShadowRoot(partnerSelectorLocator, this.locators.savePartnerButton);
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
            const basicInfo = new BasicInfo();
            const heroImageDropzoneLocator = this.native.locator(this.locators.heroImageDropzone);
            const heroImageInputLocator = await basicInfo.getHandleInsideShadowRoot(heroImageDropzoneLocator, 'input.img-file-input');
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
            const basicInfo = new BasicInfo();
            const thumbnailImageDropzoneLocator = this.native.locator(this.locators.thumbnailImageDropzone);
            const thumbnailImageInputLocator = await basicInfo.getHandleInsideShadowRoot(thumbnailImageDropzoneLocator, 'input.img-file-input');
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
            const basicInfo = new BasicInfo();
            const venueImageDropzoneLocator = this.native.locator(this.locators.venueImageDropzone);
            const venueImageInputLocator = await basicInfo.getHandleInsideShadowRoot(venueImageDropzoneLocator, 'input.img-file-input');
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
            if(venueImageCheckbox==='checked'){
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



}
module.exports = { AdditionalContent };