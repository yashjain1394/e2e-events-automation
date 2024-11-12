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
            profileContainer: 'profile-container.profile-component',
            addProfilePanel: 'repeater-element[text="Add Profile"]',
            addProfileButton: 'img[src="/ecc/icons/add-circle.svg"]',
            profileUI: 'profile-ui.form-component',
            profileView: 'profile-view',
            profileType: 'sp-picker[label="Choose type"]',
            profileTypeOption: (type) => `sp-menu-item[value="${type}"]`,
            customSearchTag: (index) => `custom-search:nth-of-type(${index})`,
            customTextfieldTag: 'custom-textfield',
            firstName: 'sp-textfield[placeholder="First name"]',
            lastName: 'sp-textfield[placeholder="Last name"]',
            title: 'input#title',
            bio: 'textarea#bio',
            addSocialMediaButton: 'button#add-social-media',
            socialMediaInput: 'input.social-media-link',
            saveProfileButton: 'sp-button.save-profile-button',
        };
    }

    async fillSpeakersAndHostsProfile(profile) {
        try {
            const basicInfo = new BasicInfo();
            const profileContainerLocator = this.native.locator(this.locators.profileContainer);
    
            for (let i = 0; i < profile.length; i++) {
                const item = profile[i];
                console.log(item);
    
                // Click the Add Profile button if there are multiple items
                if (i > 0) {
                    logger.logInfo('Clicking the Add Profile button');
                    const addProfilePanelLocator = await profileContainerLocator.evaluateHandle((el) => {
                        return el.shadowRoot.querySelector('repeater-element[text="Add Profile"]');
                    });
                    const addProfileButtonLocator = await addProfilePanelLocator.evaluateHandle((el) => {
                        return el.shadowRoot.querySelector('img[src="/ecc/icons/add-circle.svg"]');
                    });
                    await addProfileButtonLocator.click();
                    logger.logInfo('Add Profile button clicked successfully');
                }
    
                // Locate the nth profile UI component within the shadow root
                const profileUILocator = await profileContainerLocator.evaluateHandle((el, index) => {
                    const shadowRoot = el.shadowRoot;
                    return shadowRoot.querySelectorAll('profile-ui.form-component')[index];
                }, i);

                // Fill the profile type
                const profileTypeLocator = await basicInfo.getHandleInsideShadowRoot(profileUILocator, this.locators.profileType);
                await profileTypeLocator.click();
                logger.logInfo('Profile type clicked successfully');

                // Use a more specific locator for the profile type option
                const profileTypeOptionLocator = await basicInfo.getHandleInsideShadowRoot(profileUILocator, this.locators.profileTypeOption(item.type));
                if (!profileTypeOptionLocator) {
                    throw new Error('profile type option not found');
                }
                await profileTypeOptionLocator.click();
                logger.logInfo(`Profile type: ${item.type} selected successfully`);
    
                // Fill the first name
                const firstNameCustomSearchTagLocator = await profileUILocator.evaluateHandle((el, index) => {
                    const shadowRoot = el.shadowRoot;
                    return shadowRoot.querySelectorAll('custom-search')[index];
                }, 0);
                
                const firstNameCustomTextfieldTagLocator = await firstNameCustomSearchTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('custom-textfield');
                });
                
                const firstNameLocator = await firstNameCustomTextfieldTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('sp-textfield');
                });
                
                const firstNameInputLocator = await firstNameLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('input');
                });
                
                await firstNameInputLocator.fill(item.firstName);
                logger.logInfo(`First Name: ${item.firstName} filled successfully`);
                // this.fillFirstName(item.firstName, profileUILocator);
    
                // Fill the last name
                const lastNameCustomSearchTagLocator = await profileUILocator.evaluateHandle((el, index) => {
                    const shadowRoot = el.shadowRoot;
                    return shadowRoot.querySelectorAll('custom-search')[index];
                }, 1);
                
                const lastNameCustomTextfieldTagLocator = await lastNameCustomSearchTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('custom-textfield');
                });
                
                const lastNameLocator = await lastNameCustomTextfieldTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('sp-textfield');
                });
                
                const lastNameInputLocator = await lastNameLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('input');
                });
                
                await lastNameInputLocator.fill(item.lastName);
                logger.logInfo(`Last Name: ${item.lastName} filled successfully`);
                // this.fillLastName(item.lastName, profileUILocator);

                // Upload profile image
                const profileImageDropzoneTagLocator = await profileUILocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('image-dropzone');
                });
                const profileImageInputLocator = await profileImageDropzoneTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('input.img-file-input');
                });

                try{
                const profileImagePath = await getFilePath(item.img);
                await profileImageInputLocator.setInputFiles(profileImagePath);
                logger.logInfo(`Profile image: ${profileImagePath} uploaded successfully`);
                } catch (error) {
                    logger.logError(`Error in uploading profile image: ${error.message}`);
                }
    
                // Fill the title
                const titleCustomTextfieldTagLocator = await profileUILocator.evaluateHandle((el, index) => {
                    const shadowRoot = el.shadowRoot;
                    return shadowRoot.querySelectorAll('custom-textfield')[index];
                }, 0);
                
                const titleLocator = await titleCustomTextfieldTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('sp-textfield');
                });
                
                const titleInputLocator = await titleLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('input');
                });
                
                await titleInputLocator.fill(item.title);
                logger.logInfo(`Title ${item.title} filled successfully`);
                // this.fillTitle(item.title, profileUILocator);

                // Fill the bio
                const bioCustomTextfieldTagLocator = await profileUILocator.evaluateHandle((el, index) => {
                    const shadowRoot = el.shadowRoot;
                    return shadowRoot.querySelectorAll('custom-textfield')[index];
                }, 1);
                
                const bioLocator = await bioCustomTextfieldTagLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('sp-textfield');
                });
                
                const bioInputLocator = await bioLocator.evaluateHandle((el) => {
                    return el.shadowRoot.querySelector('textarea');
                });
                
                await bioInputLocator.type(item.bio);
                logger.logInfo(`Bio: ${item.bio} filled successfully`);
                // this.fillBio(item.bio, profileUILocator);
                
    
                // Fill the social media links
                const socialMediaLinksArray = item.socialMediaLinks.split(',').map(link => link.trim());
                console.log('Social Media Link Array:', socialMediaLinksArray);
                for (let j = 0; j < socialMediaLinksArray.length; j++) {
                    const socialMediaItem = socialMediaLinksArray[j];
                    console.log('Social Media Link:',socialMediaItem);
    
                    // Click the Add Social Media button if there are multiple items
                    if (j > 0) {
                        const addSocialMediaLinkLocator = await profileUILocator.evaluateHandle((el) => {
                            return el.shadowRoot.querySelector('repeater-element');
                        });
                        
                        const addSocialMediaLinkImgLocator = await addSocialMediaLinkLocator.evaluateHandle((el) => {
                            return el.shadowRoot.querySelector('img');
                        });
                        logger.logInfo('Clicking the Add Social Media button');
                        await addSocialMediaLinkImgLocator.click();
                        logger.logInfo('Add Social Media button clicked successfully');
                    }
    
                    // Locate the nth social media input within the shadow root
                    const socialMediaLinkCustomTextfieldTagLocator = await profileUILocator.evaluateHandle((el, index) => {
                        const shadowRoot = el.shadowRoot;
                        return shadowRoot.querySelectorAll('custom-textfield')[index];
                    }, j+2);
                    
                    const socialMediaLinkLocator = await socialMediaLinkCustomTextfieldTagLocator.evaluateHandle((el) => {
                        return el.shadowRoot.querySelector('sp-textfield');
                    });
                    
                    const socialMediaLinkInputLocator = await socialMediaLinkLocator.evaluateHandle((el) => {
                        return el.shadowRoot.querySelector('input');
                    });

                    await socialMediaLinkInputLocator.fill(socialMediaItem);
                    logger.logInfo(`Social Media Link: ${socialMediaItem} filled successfully`);

                    
                }

                // Click Save Profile
                logger.logInfo('Clicking the Save Profile button');
                
                const saveProfileButtonLocator = await basicInfo.getHandleInsideShadowRoot(profileUILocator, this.locators.saveProfileButton);

                await saveProfileButtonLocator.click();
                logger.logInfo('Save Profile button clicked successfully');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
                logger.logInfo(`Profile with first name ${item.firstName} and last name ${item.lastName} filled successfully`);
            }
        } catch (error) {
            logger.logError(`Error in filling the speakers and hosts profile: ${error.message}`);
            throw new Error(`Error in filling the speakers and hosts profile: ${error.message}`);
        }
    }

}
module.exports = { SpeakersAndHosts };