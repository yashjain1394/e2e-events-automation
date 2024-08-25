@registerEvent
Feature: Event Registration

  Background:
    Given I am on the events hub page

  Scenario: Navigate to Events Hub
    Then I should see the Marquee displayed on the page
    Then I should see events displayed on the page
    When I select an event card with title from test data
    Then the banners on the event card should be displayed correctly
    And I should see the date and time displayed correctly on the event card
    And the "View event" button on the event card should be clickable

  Scenario: Verify Pagination
    Then I should see pagination controls
    And the "Next" button should be clickable
    And the "Previous" button should be clickable
    And I should be able to click on specific page numbers
    And I should see the total number of pages and results displayed

  Scenario: Navigate to an Event Detail Page
    When I click the "View event" button on an event card with title from test data
    Then I should navigate to the event detail page
    Then I should see the event details on the page
    Then I should see the Agenda on the event details page
    And I should see the Venue on the event details page
    Then I click the RSVP Button
    Then I sign in with AdobeID
    Then I again click the RSVP Button
