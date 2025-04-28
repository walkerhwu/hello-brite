Feature: Tentacles Input Field validation
  As an user
  I want to enter the number of tentacles
  So that I can submit valid values and get appropriate response

  Scenario: Valid input range
    Given I am on the form page
    When I enter "50" in the tentacles input field
    And I click on the "Send" button
    Then I should see "Success" message

  Scenario: Valid minimum boundary value
    Given I am on the form page
    When I enter "10" in the tentacles input field
    And I click on the "Send" button
    Then I should see "Success" message

  Scenario: Valid maximum boundary value
    Given I am on the form page
    When I enter "100" in the tentacles input field
    And I click on the "Send" button
    Then I should see "Success" message

  Scenario: Invalid input below minimum
    Given I am on the form page
    When I enter "9" in the tentacles input field
    And I click on the "Send" button
    Then I should see an error message

  Scenario: Invalid input above maximum
    Given I am on the form page
    When I enter "101" in the tentacles input field
    And I click on the "Send" button
    Then I should see an error message

  Scenario: Invalid non-numeric input
    Given I am on the form page
    When I enter "ten" in the tentacles input field
    And I click on the "Send" button
    Then I should see an error message

  Scenario: Empty input submission
    Given I am on the form page
    When I clear the tentacles input field
    And I click on the "Send" button
    Then I should see an error message

  Scenario: Decimal number input
    Given I am on the form page
    When I enter "50.5" in the tentacles input field
    And I click on the "Send" button
    Then I should see an error message