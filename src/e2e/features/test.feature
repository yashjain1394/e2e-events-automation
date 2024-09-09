Feature: Platform-UI Automation Demo

  @id-1
  Scenario: Go to the Adobehome page
    Given I go to "/events/hub"
     Then I resize the browser window to 1920x1080
     Then I wait for 5 seconds
     Then I should see the address bar contains "adobe.com"
         