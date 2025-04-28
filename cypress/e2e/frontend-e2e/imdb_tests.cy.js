describe('IMDb Test Suite', () => {
    beforeEach(() => {
        cy.visit('https://www.imdb.com', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        cy.dismissCookieBanner('#onetrust-accept-btn-handler');
    });

    it('search for Nicolas Cage movies with Completed tag', () => {
        cy.searchFor('Nicolas Cage');
        cy.get('.ipc-metadata-list-summary-item__t')
            .first()
            .click();

        cy.clickButton('Credits');
        cy.clickButton('Upcoming');

        cy.get('body').then(($body) => {
            if ($body.find('.ipc-label--completed').length > 0) {
                cy.get('.ipc-label--completed')
                    .first()
                    .should('contain', 'Completed')
                    .click();
                cy.get('[data-testid="metadata-item"]:has(.ipc-label--completed)');
                cy.url().should('include', '/title/');
            } else {
                cy.log('No movies with Completed tag found for Nicolas Cage');
            }
        });
    });

    it('Top Box Office rating', () => {
        cy.openNavigationMenu();
        cy.clickMenuItem('Top Box Office');

        cy.url().should('include', '/chart/boxoffice/');
        cy.get('.ipc-metadata-list--base').should('be.visible');

        cy.getMovieFromList(1).click();

        cy.url().should('contain', '/title/');
        cy.get('[data-testid="hero-rating-bar__user-rating"]').should('be.visible');

        cy.rateMovie(5);

        cy.contains('Sign in').should('exist');
        cy.url().should('contain', '/registration/');
    });

    it('Navigates to Breaking Bad photos and selects Danny Trejo\'s 2nd photo', () => {
        cy.openNavigationMenu();
        cy.clickMenuItem('Top 250 TV Shows');

        cy.contains('Breaking Bad').click();
        cy.get('[data-testid="hero-media__photos"]').click();

        cy.searchWithinPage('Danny Trejo');
        cy.contains('Danny Trejo').click();

        cy.get('.media_index_thumb_list img')
            .eq(1)
            .should('be.visible')
            .click();

        cy.get('.sc-7ab21ed2-1').should('be.visible');
    });

    it('Searches for celebrities born yesterday and takes screenshot', () => {
        cy.searchBornToday('Yesterday');

        cy.get('.ipc-metadata-list-summary-item')
            .should('have.length.gt', 2)
            .eq(2)
            .click();

        cy.url().should('include', '/name/');
        cy.screenshot('celebrity-born-yesterday', {
            capture: 'viewport',
            overwrite: true
        });
    });

    it('Finds celebrities born 40 years ago today and interacts with profile', () => {
        const targetDate = cy.calculateDateYearsAgo(40);
        cy.log(`Searching for celebrities born on: ${targetDate.formatted}`);

        cy.searchBornOnDate(targetDate.month, targetDate.day, targetDate.year);

        cy.get('.ipc-metadata-list-summary-item', { timeout: 10000 })
            .should('exist')
            .its('length')
            .then((count) => {
                if (count === 0) {
                    cy.log('No results found for this date');
                    return;
                }

                cy.interactWithFirstCelebrityProfile();

                cy.url({ timeout: 8000 }).should('not.include', '/feature/bornondate');
                cy.screenshot(`celebrity-${targetDate.year}-${targetDate.timestamp}`, {
                    capture: 'viewport',
                    overwrite: true,
                });
            });
    });
});

Cypress.Commands.add('dismissCookieBanner', (selector) => {
    cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
            cy.get(selector).click();
        }
    });
});

Cypress.Commands.add('searchFor', (query) => {
    cy.get('#suggestion-search', { timeout: 10000 })
        .should('be.visible')
        .type(`${query}{enter}`);
});

Cypress.Commands.add('clickButton', (label) => {
    cy.contains('button', label).click();
});

Cypress.Commands.add('openNavigationMenu', () => {
    cy.get('button[aria-label*="Menu"], button[aria-label*="navigation"], .ipc-responsive-button')
        .first()
        .click();
});

Cypress.Commands.add('clickMenuItem', (label) => {
    cy.contains('.ipc-list-item__text', label).click();
});

Cypress.Commands.add('getMovieFromList', (index) => {
    return cy.get('ul.ipc-metadata-list li.ipc-metadata-list-summary-item')
        .eq(index)
        .find('a')
        .first();
});

Cypress.Commands.add('rateMovie', (rating) => {
    cy.contains('button', 'Rate').click();
    cy.get('.ipc-rating-prompt__container').should('be.visible');
    cy.get(`[aria-label="Rate ${rating}"]`).click();
    cy.contains('.ipc-rating-display__rating', rating.toString());
    cy.contains('button', 'Rate').click();
});

Cypress.Commands.add('searchWithinPage', (query) => {
    cy.get('.filter-search').type(query);
});

Cypress.Commands.add('searchBornToday', (period) => {
    cy.openNavigationMenu();
    cy.clickMenuItem('Born Today');

    cy.url().should('include', '/feature/bornondate');
    cy.get('input[placeholder*="Search name"]').clear();
    cy.contains('Birthday').click();
    cy.contains(period).click();
});

Cypress.Commands.add('calculateDateYearsAgo', (years) => {
    const today = new Date();
    const targetYear = today.getFullYear() - years;
    const targetMonth = today.toLocaleString('default', { month: 'long' });
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
    cy.clickMenuItem('Born Today');

    cy.get('input[type="search"]', { timeout: 8000 }).as('searchField');
    cy.get('@searchField').clear().should('have.value', '');

    cy.contains('button', 'Birth date', { timeout: 5000 }).click();
    cy.contains('.ipc-list-item__text', month, { timeout: 3000 })
        .should('be.visible')
        .click();

    cy.contains('.ipc-list-item__text', `^${day}$`, { matchCase: false })
        .scrollIntoView()
        .click();

    cy.get('input[placeholder="Year"]')
        .clear()
        .type(year.toString())
        .should('have.value', year.toString());

    cy.contains('button', 'Apply', { timeout: 3000 }).click();
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