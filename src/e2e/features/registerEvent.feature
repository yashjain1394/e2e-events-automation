Feature: Events Hub

  Background:
    Given I am on the events hub page

  @id-registration
  Scenario: Navigate to Events Hub
    Then I should see the Marquee displayed on the page
    Then I should see events displayed on the page
    When I select an event card with title "Shutter to Software"
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
    When I click the "Read more" button on an event card
    Then I should navigate to the event detail page
