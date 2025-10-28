@registerEvent
Feature: Event Registration

  Background:
    Given I have a new browser context

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
      | EventName   | FormData                                                                                                                                                                                                             |
      | Auto Events | '{"companyName": "Test Company 1", "jobTitle": "Other", "phoneNumber": "1234567890", "industry": "Advertising", "interest": "Creative Cloud", "companySize": "10 - 49", "ageRange": "26-35", "jobLevel": "Manager"}' |

  @MWPW-173971
  Scenario Outline: Verify webinar registration functionality
    Given I go to the Webinar event "<path>"
    Then I fill all the required information in the Marketo form with:
      | Form Field        | Value          |
      | First name        | <first_name>   |
      | Last name         | <last_name>    |
      | Business email    | <email>        |
      | Job title or role | <job_title>    |
      | Department        | <department>   |
      | Organization      | <organization> |
      | Country           | <country>      |
    Then I click the Marketo Register button
    Then I see the successful registration confirmation

    Examples:
      | path                                                       | first_name | last_name | email          | job_title | department       | organization      | country       |
      | events/dx-webinar-test-series/kats-test-webinar/2025-05-16 | Magma      | Johnson   | test@adobe.com | Analyst   | Digital Commerce | Adobe Systems Inc | United States |

  @MWPW-173971 @sign-in
  Scenario Outline: Verify webinar registration functionality when logged in
    Given I go to the Webinar event "<path>"
    Then I sign in with 'Free Account' test account from the gnav
    Then I fill all the required information in the Marketo form with:
      | Form Field        | Value          |
      | First name        | <first_name>   |
      | Last name         | <last_name>    |
      | Business email    | <email>        |
      | Job title or role | <job_title>    |
      | Department        | <department>   |
      | Organization      | <organization> |
      | Country           | <country>      |
    Then I click the Marketo Register button
    Then I see the successful registration confirmation

    Examples:
      | path                                                       | first_name | last_name | email          | job_title | department       | organization      | country       |
      | events/dx-webinar-test-series/kats-test-webinar/2025-05-16 | Magma      | Johnson   | test@adobe.com | Analyst   | Digital Commerce | Adobe Systems Inc | United States |
