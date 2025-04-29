import './commands'

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
            .first().click();
        cy.clickHref('Credits');
        cy.clickHref('Upcoming');

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
