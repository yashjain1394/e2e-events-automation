@registerEvent
Feature: Event Registration
    
  Scenario Outline: Validate and register events "<span style="color:black;"><b><EventName></b></span>"
    Given I go to the event with title "/events/cc-test-series/test-event/san-jose/ca/us/2027-01-01.html"   
    And I should see the event details on the page
    And I should see the Venue on the event details page
    And I should see the Agenda on the event details page
    And I should see profile cards for speakers and host
    And I verify the CTA in the related products blade
    And I verify the partners section

    Then I initiate the RSVP process and handle sign-in if required
    Then I check the RSVP status, cancel if the event is already registered
    And I should see my firstname, lastname & email prefilled
    Then I fill all the required information with <FormData>
    Then I click the Submit button
    Then I see the registration confirmation
    Then I cancel the RSVP

  Examples: DefaultEvents
    | EventName     | FormData |
    | Auto Events | '{"companyName": "Test Company 1", "jobTitle": "Other", "phoneNumber": "1234567890", "industry": "Advertising", "interest": "Creative Cloud", "companySize": "10 - 49", "ageRange": "26-35", "jobLevel": "Manager"}' |
    
    