@createEventRequiredFields
Feature: Event Creation Required Fields

  Scenario: Verify ECC dashboard page content
    Given I am on the ECC dashboard page
    When I sign-in on the ECC dashboard page
    Then I should see the All Events label on the page
    Then I should see the Search box on the page
    Then I should see the table headers on the page
    Then I should see pagination container
    Then I should see the footer section on the page

  Scenario Outline: Create event with required fields and validate "<span style="color:black;"><b><Description></b></span>"
    Given I am on the ECC dashboard page
  #  When I sign-in on the ECC dashboard page
    And I should see the Create new event button on the page
    Then I should be able to click on Create new event button
    Then I am in the create event flow and Basic info page
    Then I fill out cloud type and series type with <EventDataWithRequiredFields>
    Then I fill minimum required fields such as event title, event description, date, start time, end time, timezone and venue information with <EventDataWithRequiredFields>
    Then I click Next step multiple times
    Then I should check that event is created
    Then I should be able to search & validate the event on ECC dashboard

    Examples: DefaultEvents
    | Description | EventDataWithRequiredFields                                              |
    | Auto Events Required Fields | '{"cloudType": "Creative Cloud", "series": "Create Now", "title": "Auto Events Required Fields", "eventDetails":"TEST RTE", "description": "Auto Events description", "startDate": "2024-11-26", "endDate": "2024-11-28", "startTime": "9:00 AM", "endTime": "1:00 PM", "timezone": "UTC-05:00 - America/New_York","language":"en-US", "venue": "Adobe World Headquarters", "venueInfoWillAppearPostEventCheckbox": "Checked"}' |
    | Auto Events Required Fields | '{"cloudType": "Creative Cloud", "series": "Create Now", "title": "Auto Events Required Fields", "description": "Auto Events description", "startDate": "2024-11-26", "endDate": "2024-11-28", "startTime": "9:00 AM", "endTime": "1:00 PM", "timezone": "UTC-05:00 - America/New_York","language":"de-DE", "venue": "Adobe World Headquarters", "venueInfoWillAppearPostEventCheckbox": "Checked"}' |

  Scenario Outline: Delete the event "<span style="color:black;"><b><EventName></b></span>"
    Given I am on the ECC dashboard page
    Then I should be able to delete the event with "<EventName>"

    Examples: DefaultEventName
    | EventName |
    | Auto Events Required Fields |
   