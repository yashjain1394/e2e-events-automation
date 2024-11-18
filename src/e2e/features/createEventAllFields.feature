@createEventAllFields
Feature: Event Creation

  Scenario: Verify ECC dashboard page content
    Given I am on the ECC dashboard page
    When I sign-in on the ECC dashboard page
    Then I should see the All Events label on the page
    Then I should see the Search box on the page
    Then I should see the table headers on the page
    Then I should see pagination container
    Then I should see the footer section on the page

    Scenario Outline: Create event with all fields and validate
    Given I am on the ECC dashboard page
    And I should see the Create new event button on the page
    Then I should be able to click on Create new event button
    Then I am in the create event flow and Basic info page
    Then I fill out create event Basic info page with <BasicInfoPageFields> and click Next step
    Then I fill out create event Speakers & Hosts page with <SpeakersHostsPageFields> and click Next step
    Then I fill out create event Additional content page with <AdditionalContentPageFields> and click Next step
    Then I fill out create event RSVP page with <RSVPPageFields> and click Publish event
    Then I should check that event is created
    Then I should be able to search & validate the event on ECC dashboard

    Examples: DefaultEvents
    | BasicInfoPageFields | SpeakersHostsPageFields | AdditionalContentPageFields | RSVPPageFields |
    | '{ "cloudType": "Creative Cloud", "series": "Create Now", "eventTopics": "Graphic Design, Video, Illustration, Photography, Generative AI, Social, 3D", "title": "AEEE Test Event", "description": "AEEE Test Event description", "startDate": "2024-11-26", "endDate": "2024-11-28", "startTime": "9:00 AM", "endTime": "1:00 PM", "timezone": "UTC-05:00 - America/New_York", "agenda": [ { "startTime": "9:00 AM", "description": "Breakfast" }, { "startTime": "1:00 PM", "description": "Lunch" } ], "agendaPostEventCheckbox": "Checked", "communityLink": "Checked", "communityUrl": "https://www.adobe.com", "venue": "Adobe World Headquarters", "venueInfoWillAppearPostEventCheckbox": "Checked" }' | '{ "profile": [ { "type": "Host", "firstName": "Lisa", "lastName": "Melton", "title": "Program Manger", "img": "https://i1.rgstatic.net/ii/profile.image/1179330633838597-1658185742109_Q512/Lisa-Melton-4.jpg", "bio": "Lisa is a hardworking person who will bring great insight and knowledge to this seminar", "socialMediaLinks": "https://www.instagram.com/adobe/, https://www.youtube.com/user/AdobeSystems/Adobe, https://x.com/adobe/" }, { "type": "Speaker", "firstName": "Todd", "lastName": "Michaels", "title": "Software Engineer", "img": "https://mmo.aiircdn.com/366/633860493188d.jpg", "bio": "Todd is an amazing person who will bring great effort  and knowledge to this seminar", "socialMediaLinks": "https://www.instagram.com/adobe/, https://www.youtube.com/user/AdobeSystems/Adobe, https://x.com/adobe/" } ] }' | '{ "relatedProducts": "Adobe Express, Illustrator, After Effects, Lightroom, Premiere Pro, InDesign, Fresco, Photoshop, Photoshop Express, Firefly", "partnerName": "Google", "partnerUrl": "https://google.com", "partnerImage": "https://t4.ftcdn.net/jpg/08/35/17/55/360_F_835175502_DzhlDw1AC8Vf2ClJ6vaiq8GlXtiaLtTi.jpg", "includePartnersCheckbox": "Checked", "heroImage": "https://www.adobe.com/events/assets/static/images/series/6211a2a1-3c5c-4d49-b3a5-58ebd70efed9/events/8c90668a-78de-49b0-bc79-773c242aec64/media_144b9638c2bf3fd49cd8d23280a6ad23b755ec1c9.jpeg", "thumbnailImage": "https://www.meydanfz.ae/wp-content/uploads/2021/10/Events-1536x864.png", "venueImage": "https://3.imimg.com/data3/CK/HV/MY-10570443/corporate-events-1000x1000.jpg", "venueImageCheckbox": "Checked" }' | '{ "attendeeLimit": "2000", "hostEmail": "ssemwal+US+autoevents+1+T2E@adobetest.com", "rsvpFormDescription": "Host has organized more than 500 events successfully.", "includeOnFormFieldCategories": "MOBILE PHONE, INDUSTRY, PRODUCT OF INTEREST, COMPANY SIZE, AGE, JOB LEVEL, CONTACT METHOD", "makeItRequiredFieldcategories": "MOBILE PHONE, INDUSTRY, PRODUCT OF INTEREST, COMPANY SIZE, AGE, JOB LEVEL, CONTACT METHOD" }' |

    Scenario Outline: Delete the event
    Given I am on the ECC dashboard page
    Then I should be able to delete the event with "<EventName>"

    Examples: DefaultEventName
    | EventName |
    | AEEE Test Event |