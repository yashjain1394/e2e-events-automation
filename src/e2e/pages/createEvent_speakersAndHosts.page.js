const { expect } = require('@playwright/test');
const { EventsBasePage } = require('./eventsBase.page.js');
const Logger = require('../common-utils/logger.js');
const { BasicInfo } = require('./createEvent_basicInfo.page.js');
const {getFilePath} = require('../common-utils/helper.js');
const logger = new Logger();

class SpeakersAndHosts extends EventsBasePage {
    constructor() {
        super('/ecc/create/t3');
        this.locators = {
            speakersAndHostsLabel: '//*[@id="speakers-and-hosts"]',
            addProfilePanel: 'repeater-element[text="Add Profile"]',
            addProfileButton: 'profile-container.profile-component repeater-element[text="Add Profile"] img',
            profileType: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component sp-picker[label="Choose type"]`,
            profileTypeOption: (profileContainerIndex, profileType) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component sp-menu-item[value="${profileType}"]`,
            firstName: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component custom-search custom-textfield sp-textfield[placeholder="First Name"] input[placeholder="First Name"]`,
            lastName: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component custom-search custom-textfield sp-textfield[placeholder="Last Name"] input[placeholder="Last Name"]`,
            profileImage: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component image-dropzone input.img-file-input`,
            title: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component custom-textfield sp-textfield[placeholder="Add title"] input[placeholder="Add title"]`,
            bio: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component rte-tiptap[placeholder="Add bio"] div[contenteditable="true"]`,
            addSocialMediaButton: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component repeater-element[text="Add social media"] img.icon.icon-add-circle`,
            socialMediaInput: (profileContainerIndex,socialMediaRowIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component div.social-media div.social-media-row:nth-of-type(${socialMediaRowIndex+1}) custom-textfield.social-media-input sp-textfield[placeholder="Add social media link"] input[placeholder="Add social media link"]`,
            saveProfileButton: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component sp-button.save-profile-button`,
            editProfileButton: (profileContainerIndex) => `profile-container.profile-component div.profile-container:nth-of-type(${profileContainerIndex+1}) profile-ui.form-component sp-button.profile-action-button`,
        };
    }

    async fillSpeakersAndHostsProfile(profile) {
        try {
            logger.logInfo('Filling the speakers and hosts profile');
            for (let i = 0; i < profile.length; i++) {
                const item = profile[i];
                // console.log(item);
    
                // Click the Add Profile button if there are multiple items
                if (i > 0) {
                    logger.logInfo('Clicking the Add Profile button');
                    const addProfileButtonLocator = this.native.locator(this.locators.addProfileButton);
                    await addProfileButtonLocator.waitFor({ state: 'visible', timeout: 10000 });
                    await addProfileButtonLocator.click();
                    logger.logInfo('Add Profile button clicked successfully');
                }
    
                // Fill the profile type
                const profileTypeLocator = this.native.locator(this.locators.profileType(i));
                await profileTypeLocator.click();
                logger.logInfo('Profile type clicked successfully');

                // Use a more specific locator for the profile type option
                const profileTypeOptionLocator = this.native.locator(this.locators.profileTypeOption(i,item.type));
                if (!profileTypeOptionLocator) {
                    throw new Error('profile type option not found');
                }
                await profileTypeOptionLocator.click();
                logger.logInfo(`Profile type: ${item.type} selected successfully`);
    
                // Fill the first name
                const firstNameInputLocator = this.native.locator(this.locators.firstName(i));
                await firstNameInputLocator.fill(item.firstName);
                logger.logInfo(`First Name: ${item.firstName} filled successfully`);
    
                // Fill the last name
                const lastNameInputLocator = this.native.locator(this.locators.lastName(i));
                await lastNameInputLocator.fill(item.lastName);
                logger.logInfo(`Last Name: ${item.lastName} filled successfully`);
                
                // Upload profile image
                const profileImageInputLocator = this.native.locator(this.locators.profileImage(i));

                try{
                const profileImagePath = await getFilePath(item.img);
                await profileImageInputLocator.setInputFiles(profileImagePath);
                logger.logInfo(`Profile image: ${profileImagePath} uploaded successfully`);
                } catch (error) {
                    logger.logError(`Error in uploading profile image: ${error.message}`);
                }
    
                // Fill the title
                const titleInputLocator = this.native.locator(this.locators.title(i));
                await titleInputLocator.fill(item.title);
                logger.logInfo(`Title ${item.title} filled successfully`);

                // Fill the bio
                const bioInputLocator = this.native.locator(this.locators.bio(i));
                await bioInputLocator.type(item.bio);
                logger.logInfo(`Bio: ${item.bio} filled successfully`);
                
    
                // Fill the social media links
                const socialMediaLinksArray = item.socialMediaLinks.split(',').map(link => link.trim());
                // console.log('Social Media Link Array:', socialMediaLinksArray);
                for (let j = 0; j < socialMediaLinksArray.length; j++) {
                    const socialMediaItem = socialMediaLinksArray[j];
                    // console.log('Social Media Link:',socialMediaItem);
    
                    // Click the Add Social Media button if there are multiple items
                    if (j > 0) {
                        const addSocialMediaLinkImgLocator = this.native.locator(this.locators.addSocialMediaButton(i));
                        logger.logInfo('Clicking the Add Social Media button');
                        await addSocialMediaLinkImgLocator.click();
                        logger.logInfo('Add Social Media button clicked successfully');
                    }
    
                    // Fill the social media link
                    const socialMediaLinkInputLocator = this.native.locator(this.locators.socialMediaInput(i,j));
                    await socialMediaLinkInputLocator.fill(socialMediaItem);
                    logger.logInfo(`Social Media Link: ${socialMediaItem} filled successfully`);                    
                }

                // Click Save Profile
                logger.logInfo('Clicking the Save Profile button');
                const saveProfileButtonLocator = this.native.locator(this.locators.saveProfileButton(i));
                await saveProfileButtonLocator.click();
                logger.logInfo('Save Profile button clicked successfully');
                const editProfileButtonLocator = this.native.locator(this.locators.editProfileButton(i));
                // Wait for Edit Profile button to be visible
                await editProfileButtonLocator.waitFor({ state: 'visible', timeout: 10000 });
                logger.logInfo(`Profile with first name ${item.firstName} and last name ${item.lastName} filled successfully`);
            }
        } catch (error) {
            logger.logError(`Error in filling the speakers and hosts profile: ${error.message}`);
            throw new Error(`Error in filling the speakers and hosts profile: ${error.message}`);
        }
    }

}
module.exports = { SpeakersAndHosts };