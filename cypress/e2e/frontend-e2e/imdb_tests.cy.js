import './commands'

describe('IMDb Test Suite', () => {
    beforeEach(() => {
        cy.visit('https://www.imdb.com', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        cy.dismissCookieBanner();
    });

    it('search for Nicolas Cage movies with Completed tag', () => {
        cy.searchFor('Nicolas Cage');
        cy.clickHref('Credits');
        cy.clickLabel('Upcoming');

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
        cy.clickHref('Top Box Office');

        cy.url().should('include', '/chart/boxoffice/');
        cy.get('.ipc-metadata-list--base').should('be.visible');

        cy.getMovieFromList(1).click();

        cy.url().should('contain', '/title/');
        cy.get('[data-testid="hero-rating-bar__user-rating"]').should('be.visible');

        cy.rateMovie(5);
    });

    it('Navigates to Breaking Bad photos and selects Danny Trejo\'s 2nd photo', () => {
        cy.openNavigationMenu();
        cy.clickHref('Top 250 TV Shows');

        cy.contains('Breaking Bad').click();
        cy.get('[data-testid="hero__photo-link"]').click({force: true});

        cy.searchWithinPage('Danny Trejo');

        cy.get('[data-testid="sub-section-images"]')
            .find('a')
            .eq(1)
            .click();
        cy.get('[data-image-id="rm1473521153-curr"]').should('be.visible');


    });

    it('Searches for celebrities born yesterday and takes screenshot', () => {
        const targetDay = calculateYesteray();
        cy.searchBornOnDay(targetDay);

        cy.get('.ipc-metadata-list-summary-item')
            .should('have.length.gt', 2)

        cy.get('.ipc-title-link-wrapper')
            .eq(2)
            .click()

        cy.url().should('include', '/name/');
        cy.screenshot('celebrity-born-yesterday', {
            capture: 'viewport',
            overwrite: true
        });
    });

    it('Finds celebrities born 40 years ago today and interacts with profile', () => {
        const targetDate = calculateDateYearsAgo(40);
        cy.log(`Searching for celebrities born on: ${targetDate}`);

        cy.searchBornOnDate(targetDate);
        cy.get('.ipc-metadata-list-summary-item')
            .should('exist')
            .its('length')
            .then((count) => {
                if (count === 0) {
                    cy.log('No results found for this date');
                    return;
                }

                cy.interactWithFirstCelebrityProfile();

                cy.url({ timeout: 8000 }).should('not.include', '/feature/bornondate');
                cy.screenshot('celebrity-celebrity-born-40-years-ago-today', {
                    capture: 'viewport',
                    overwrite: true,
                });
            });
    });
});

function calculateYesteray() {
    const date = new Date();
    date.setTime(date.getTime() - 1000*60*60*24)
    const targetMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const targetDay = date.getDate().toString().padStart(2, "0");

    return `${targetMonth}-${targetDay}`;
}

function calculateDateYearsAgo(years) {
    const date = new Date();
    const targetYear = (date.getFullYear()-years).toString().padStart(4, "0");
    const targetMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const targetDay = date.getDate().toString().padStart(2, "0");

    return `${targetYear}-${targetMonth}-${targetDay}`;
}