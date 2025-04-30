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
    cy.contains('a', label).click({force: true});
});

Cypress.Commands.add('clickLabel', (label) => {
    cy.contains('label', label).click();
});

Cypress.Commands.add('openNavigationMenu', () => {
    cy.get('button[aria-label*="Menu"], button[aria-label*="navigation"], .ipc-responsive-button')
        .first()
        .click();
});

Cypress.Commands.add('clickMenuItem', (label) => {
    cy.contains('.ipc-list-item__text', label).click({force: true});
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
    cy.get('[data-testid="mv-gallery-button"]').click();
    cy.get('[data-testid="image-chip-dropdown-test-id"]').click();
    cy.get('[data-testid="promptable"]').should('be.visible');

    cy.get('#Person-filter-select-dropdown')
        .find(`option:contains('${query}')`)
        .then($el =>
            $el.get(0).setAttribute("selected", "selected")
        ).parent().trigger("change")

    cy.contains('button', query).should('be.visible');

    cy.get(`[aria-label="Close Prompt"]`).click();

});

Cypress.Commands.add('searchBornOnDay', (targetDay) => {
    cy.openNavigationMenu();
    cy.clickMenuItem('Born Today');
    cy.url().should('include', 'birth_monthday');

    cy.contains('button', 'Birthday').click();

    cy.contains('label', 'Birthday').click();
    cy.get('input[data-testid="birthday-input-test-id"]')
        .type(targetDay)
        .type('{enter}');

    cy.get('button[data-testid="adv-search-get-results"]').click();


});

Cypress.Commands.add('searchBornOnDate', (targetDate) => {
    cy.openNavigationMenu();
    cy.clickMenuItem('Born Today');
    cy.url().should('include', 'birth_monthday');

    cy.contains('button', 'Birthday').click();

    cy.contains('label', 'Birth date').click();
    cy.get('input[name=birth-date-start-input]').type(targetDate)
    cy.get('input[name=birth-date-end-input]').type(targetDate)

    cy.get('button[data-testid="adv-search-get-results"]').click();
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
                    cy.wrap($link).click();
                } else {
                    cy.log('No description links found, clicking name instead');
                    cy.get('.ipc-metadata-list-summary-item__t').first().click();
                }
            });
    });
});