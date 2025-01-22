@hub-monitor
Feature: Event Registration
    
  Scenario Outline: Validate and register events "<span style="color:black;"><b><EventName></b></span>"
    Given I am on the prod events hub page
    When I select the event card with title "<EventName>"
    Then the banners on the event card should be displayed correctly
    And I should see the date and time displayed correctly on the event card
    When I click the View event button on the event card
    Then I wait for 2 seconds
    Then I should navigate to the event detail page
    And I should see the event details on the page
    And I should see the Venue on the event details page
    And I should see the Agenda on the event details page
    And I should see profile cards for speakers and host
    And I verify the CTA in the related products blade
    And I verify the partners section

  Examples: DefaultEvents
    | EventName |
    | Adobe Creative Cafe San Jose | 
    | Creative Cafe ATL            | 
    | Adobe Creative Cafe San Diego State University | 
    | Adobe Creative Cafe San Francisco              |
    