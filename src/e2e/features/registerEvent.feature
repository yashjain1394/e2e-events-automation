Feature: Register for an Event

  Scenario: User registers for an event with minimum required fields

    Given I am on the events hub page
    And I am able to see the events listed there
    And I choose the event named "Tech Conference"  # This can be parameterized if needed
    When I click the "View Event" button for the selected event
    Then I should be taken to the event details page
    And I should see the event details on the page
    And I should see an RSVP button on the event details page
    And the RSVP button should be clickable
    When I click the RSVP button
    Then if a sign-in page appears, I should sign in
    And if no sign-in page appears, I should see a form to fill out
    And I fill out the form with valid details

