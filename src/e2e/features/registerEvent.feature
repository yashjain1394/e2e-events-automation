Feature: Register for an Event

  @id-registration
  Scenario: User registers for an event with minimum required fields
  
    Given I am on the events hub page
        And I choose the "social" category
        Then confirm events are displayed on the page
        Then view "PixelArt Expo" event
         