@registerEvent
Feature: Event Registration

  Background:
    Given I am on the events hub page

  Scenario: Navigate to Events Hub
    Then I should see the Marquee displayed on the page
    Then I should see events displayed on the page

  Scenario Outline: Validate event cards
    When I select the event card with title "<EventName>"
    Then the banners on the event card should be displayed correctly
    And I should see the date and time displayed correctly on the event card
    And the View event button on the event card should be clickable

  # Default examples to use if none are provided through Jenkins
  Examples: DefaultEvents
    | EventName   |
    | Adam's Creative Jelly Jam  |
    | E2E Event       |
    | World UAT Expo  |

  Scenario: Verify Pagination
    Then I should see pagination controls
    And the "Next" button should be clickable
    And the "Previous" button should be clickable
    And I should be able to click on specific page numbers
    And I should see the total number of pages and results displayed

  Scenario: Navigate to an Event Detail Page
    #When I click the "View event" button on an event card with title from test data
    When I click the "View event" button on the event card at position 1
    Then I should navigate to the event detail page
    #Then I should see the event details on the page
    Then I should see the Agenda on the event details page
    And I should see the Venue on the event details page
    Then I click the RSVP Button
    Then I sign in with AdobeID
    Then I again click the RSVP Button
    Then I see the RSVP Form
    Then I should see the event title I clicked on
    #And I should see my email prefilled
    #Then I fill all required information
    # When I check the Terms and Conditions
    #Then I click the Submit button
    #Then I see the registration confirmation
    #Then I close the confirmation
