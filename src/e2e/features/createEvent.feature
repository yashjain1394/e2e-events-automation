@createEvent
Feature: Event Creation


  Scenario Outline: Validate and create events
    Given I am on the ECC dashboard page
    Then I should see the All Events label on the page
    Then I should see the Search box on the page
    Then I should see the table headers on the page
    Then I should see pagination container
    Then I should see the footer section on the page
    Then I should see the Create new event button on the page
    Then I should be able to click on Create new event button

    Then I am in the create event flow and Basic info page
    # Then I fill out cloud type, series type and select event topics
    # Then I fill event title, event description, date, start time, end time, timezone and venue information from <EventDetails>
    # Then I click Next step multiple times
    # Then I should check that event is created with minimum required elements
    # And I should be able to delete the event

    # Examples: DefaultEvents
    # | EventDetails                                              |
    # | '{"cloudType": "Creative Cloud", "Series": "Create Now", "title": "Test Event", "description": "description", "Start Date": "10", "End Date": "12", "Start Time": "9:00 AM", "End Time": "1:00 PM", "timezone": "UTC-05:00 - America/New_York", "Venue": "Adobe World Headquarters"}' |
    