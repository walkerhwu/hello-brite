# hello world 

## Test - Challenge

### Test Structure

- Frontend e2e test cases: `/e2e/frontend-e2e`
- API e2e test cases: `/e2e/api-e2e`
- Manual test: `manual`
- Bug Report: `bug-reports`

#### Running

- clone the repository
- run `npm install`
- run `npx cypress install`
- run `npx cypress open` for more interactive mode or run `npx cypress run` for CLI mode
- switch browser by adding `--browser <browser-name>`. E.g. `npx cypress run --browser chrome`. Make sure you have the browser you want the test to run on is installed locally.
- example for running a specific test `npx cypress run --browser chrome --spec "cypress/e2e/frontend-e2e/imdb_tests.cy.js"`