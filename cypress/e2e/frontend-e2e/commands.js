Cypress.Commands.add('dismissCookieBanner', (selector) => {
    cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
            cy.get(selector).click();
        }
    });
});

Cypress.Commands.add('searchFor', (query) => {
    cy.get('#suggestion-search', {timeout: 10000})
        .should('be.visible')
        .type(`${query}{enter}`);
    cy.get('.ipc-metadata-list-summary-item__t')
        .first()
        .click();
});

Cypress.Commands.add('clickHref', (label) => {
    cy.contains('a', label).click();
});

Cypress.Commands.add('clickLabel', (label) => {
    cy.contains('label', label).click();
});

Cypress.Commands.add('openNavigationMenu', () => {
    cy.get('button[aria-label*="Menu"], button[aria-label*="navigation"], .ipc-responsive-button')
        .first()
        .click();
});

Cypress.Commands.add('getMovieFromList', (index) => {
    return cy.get('ul.ipc-metadata-list li.ipc-metadata-list-summary-item')
        .eq(index)
        .find('a')
        .first();
});

Cypress.Commands.add('rateMovie', (rating) => {
    cy.contains('button', 'Rate').click({force: true});
    cy.get('.ipc-rating-prompt__container').should('be.visible');
    cy.get(`[aria-label="Rate ${rating}"]`).click({force: true});
    cy.contains('.ipc-rating-display__rating', rating.toString());
    cy.contains('button', 'Rate').click({force: true});
});

Cypress.Commands.add('searchWithinPage', (query) => {
    cy.get('.filter-search').type(query);
});

Cypress.Commands.add('searchBornToday', (period) => {
    cy.openNavigationMenu();
    cy.clickHref('Born Today');

    cy.url().should('include', '/feature/bornondate');
    cy.get('input[placeholder*="Search name"]').clear();
    cy.contains('Birthday').click({force: true});
    cy.contains(period).click({force: true});
});

Cypress.Commands.add('calculateDateYearsAgo', (years) => {
    const today = new Date();
    const targetYear = today.getFullYear() - years;
    const targetMonth = today.toLocaleString('default', {month: 'long'});
    const targetDay = today.getDate();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    return {
        year: targetYear,
        month: targetMonth,
        day: targetDay,
        formatted: `${targetMonth} ${targetDay}, ${targetYear}`,
        timestamp: timestamp
    };
});

Cypress.Commands.add('searchBornOnDate', (month, day, year) => {
    cy.openNavigationMenu();
    cy.clickHref('Born Today');

    cy.get('input[type="search"]', {timeout: 8000}).as('searchField');
    cy.get('@searchField').clear().should('have.value', '');

    cy.contains('button', 'Birth date', {timeout: 5000}).click({force: true});
    cy.contains('.ipc-list-item__text', month, {timeout: 3000})
        .should('be.visible')
        .click({force: true});

    cy.contains('.ipc-list-item__text', `^${day}$`, {matchCase: false})
        .scrollIntoView()
        .click({force: true});

    cy.get('input[placeholder="Year"]')
        .clear()
        .type(year.toString())
        .should('have.value', year.toString());

    cy.contains('button', 'Apply', {timeout: 3000}).click({force: true});
});

Cypress.Commands.add('interactWithFirstCelebrityProfile', () => {
    cy.get('.ipc-metadata-list-summary-item').first().as('firstCelebrity');
    cy.get('@firstCelebrity').within(() => {
        cy.get('.ipc-html-content-inner-div a').first()
            .as('descriptionLink')
            .then(($link) => {
                if ($link.length) {
                    const linkText = $link.text().trim();
                    cy.log(`Found description link: "${linkText}"`);
                    cy.wrap($link).click({force: true});
                } else {
                    cy.log('No description links found, clicking name instead');
                    cy.get('.ipc-metadata-list-summary-item__t').first().click({force: true});
                }
            });
    });
});
