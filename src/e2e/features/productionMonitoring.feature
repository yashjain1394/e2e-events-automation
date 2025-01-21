@prod-monitor
Feature: Event Registration

  Scenario Outline: Validate and register events "<EventName>"
    Given I go to "<URL>"
    Then I wait for 5 seconds
    Then I navigate to Event Detail page "<EventName>"
    And I should see the event details on the page
    And I should see the Venue on the event details page
    And I should see the Agenda on the event details page
    And I should see profile cards for speakers and host
    And I verify the CTA in the related products blade
    And I verify the partners section

  Examples: DynamicEvents
    | EventName | URL |
    | Create Now Denver | /events/create-now/create-now-denver/denver/co/2024-10-29.html |
    | Creative Jam Phoenix | /events/creative-jam/creative-jam-phoenix/phoenix/az/2024-11-12.html |
    | Photography Create Now Nyc | /events/create-now/photography-create-now-nyc/new-york/ny/2024-11-14.html |
    | Create Now Atlanta | /events/create-now/create-now-atlanta/atlanta/ga/2024-11-14.html |
    | Photography Create Now San Francisco | /events/create-now/photography-create-now-san-francisco/san-francisco/ca/2024-11-19.html |
    | Photography Create Now Salt Lake City | /events/create-now/photography-create-now-salt-lake-city/salt-lake-city/ut/2024-12-03.html |
    | Create Now New Orleans | /events/create-now/create-now-new-orleans/new-orleans/la/2024-12-05.html |
    | Adobe Creative Cafe San Diego State University | /events/create-now/adobe-creative-cafe-san-diego-state-university/san-diego/ca/2025-01-29.html |
    | Creative Cafe Atl | /events/create-now/creative-cafe-atl/atlanta/ga/2025-01-29.html |
    | Adobe Creative Cafe San Francisco | /events/create-now/adobe-creative-cafe-san-francisco/san-francisco/ca/2025-02-06.html |
    | Adobe Creative Cafe San Jose | /events/create-now/adobe-creative-cafe-san-jose/san-jose/ca/2025-01-27.html |
