describe('PokeAPI Tests', () => {
    const baseUrl = 'https://pokeapi.co/api/v2';
    const berryBaseUrl = 'https://pokeapi.co/api/v2/berry';

    let validBerryId;
    let validBerryName;

    before(() => {
        cy.request({
            method: 'GET',
            url: `${berryBaseUrl}?limit=50`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.result).not.to.empty;
            expect(response.body.result).to.be.an('array');

            const firstBerry = response.body.results[0];
            validBerryName = firstBerry.name;

            const urlForFirstBerry = firstBerry.url.split('/');
            validBerryId = urlForFirstBerry[urlForFirstBerry.length - 2];
        })

        describe('Berry by ID', () => {
            it('should return berry data for valid ID', () => {
                cy.request({
                    method: 'GET',
                    url: `${berryBaseUrl}/berry/${validBerryId}/`,
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('id', validBerryId);
                    expect(response.body).to.have.property('name');
                    expect(response.body).to.have.property('growth_time');
                    expect(response.body).to.have.property('max_harvest');
                    expect(response.body).to.have.property('natural_gift_power');
                });
            });

            it('should return error for invalid ID', () => {
                const invalidId = 999999;
                cy.request({
                    method: 'GET',
                    url: `${berryBaseUrl}/berry/${invalidId}/`,
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.equal(404);
                    expect(response.body).to.equal('Not Found');
                });
            });
        });

        describe('Berry by Name', () => {
            it('should return berry data for valid name', () => {
                cy.request({
                    method: 'GET',
                    url: `${berryBaseUrl}/berry/${validBerryName}/`,
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('name', validBerryName);
                    expect(response.body).to.have.property('id');
                    expect(response.body).to.have.property('growth_time');
                    expect(response.body).to.have.property('max_harvest');
                    expect(response.body).to.have.property('natural_gift_power');
                });
            });

            it('should return error for invalid name', () => {
                const invalidName = 'briteberry';
                cy.request({
                    method: 'GET',
                    url: `${berryBaseUrl}/berry/${invalidName}/`,
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.equal(404);
                    expect(response.body).to.equal('Not Found');
                });
            });
        });

        describe('Berry Flavor and Spicy Berries', () => {
            it('should return berry flavor data for valid name', () => {
                const flavorName = 'spicy';
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/berry-flavor/${flavorName}/`,
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('name', flavorName);
                    expect(response.body).to.have.property('berries').that.is.an('array');

                    let maxPotency = 0;
                    let mostSpicyBerry = null;

                    response.body.berries.forEach(berry => {
                        if (berry.potency > maxPotency) {
                            maxPotency = berry.potency;
                            mostSpicyBerry = berry.berry;
                        }
                    });

                    expect(mostSpicyBerry).to.not.be.null;

                    const berryName = mostSpicyBerry.name || mostSpicyBerry.url.split('/').slice(-2, -1)[0];
                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/berry/${berryName}/`,
                    }).then((berryResponse) => {
                        expect(berryResponse.status).to.equal(200);
                        expect(berryResponse.body).to.have.property('name', berryName);
                        expect(berryResponse.body).to.have.property('id');
                    });
                });
            });
        });
    });
})