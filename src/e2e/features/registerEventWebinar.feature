@registerEventWebinar
Feature: Event Registration Webinar
    
  Scenario Outline: Validate and register events "<span style="color:black;"><b><EventName></b></span>"
    Given I go to the event with title "/events/dx-webinar-test-series/kats-test-webinar/2025-05-16"   
    And I should see the event details on the page
    And I should see the Agenda on the event details page
    And I should see profile cards for speakers and host
    When I click the Webinar Register button
    When I fill out the webinar registration form with the following details
    | firstName | lastName | email | jobTitle | functionalArea | company | country |
    | John      | Doe      | john@example.com | ANALYST | MARKETING_GENERAL | Adobe | US |
    Then I click the webinar submit button
    Then I should see the webinar registration thank you message

  