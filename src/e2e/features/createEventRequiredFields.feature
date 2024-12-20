@createEventRequiredFields
Feature: Event Creation

  Scenario: Verify ECC dashboard page content
    Given I am on the ECC dashboard page
    When I sign-in on the ECC dashboard page
    Then I should see the All Events label on the page
    Then I should see the Search box on the page
    Then I should see the table headers on the page
    Then I should see pagination container
    Then I should see the footer section on the page

  Scenario Outline: Create event with required fields and validate
    Given I am on the ECC dashboard page
    And I should see the Create new event button on the page
    Then I should be able to click on Create new event button
    Then I am in the create event flow and Basic info page
    Then I fill out cloud type and series type with <EventDataWithRequiredFields>
    Then I fill minimum required fields such as event title, event description, date, start time, end time, timezone and venue information with <EventDataWithRequiredFields>
    Then I click Next step multiple times
    Then I should check that event is created
    Then I should be able to search & validate the event on ECC dashboard

    Examples: DefaultEvents
    | EventDataWithRequiredFields                                              |
    | '{"cloudType": "Creative Cloud", "series": "Create Now", "title": "AEEE Test Event", "description": "AEEE Test Event description", "startDate": "26", "endDate": "28", "startTime": "9:00 AM", "endTime": "1:00 PM", "timezone": "UTC-05:00 - America/New_York", "venue": "Adobe World Headquarters", "venueInfoWillAppearPostEventCheckbox": "Checked"}' |

  Scenario Outline: Delete the event
    Given I am on the ECC dashboard page
    Then I should be able to delete the event with "<EventName>"

    Examples: DefaultEventName
    | EventName |
    | AEEE Test Event |