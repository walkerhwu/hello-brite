describe('PokeAPI Tests', () => {
    const baseUrl = 'https://pokeapi.co/api/v2';

    describe('Berry by ID', () => {
        it('should return berry data for valid ID', () => {
            const validId = 1;
            cy.request({
                method: 'GET',
                url: `${baseUrl}/berry/${validId}/`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('id', validId);
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
                url: `${baseUrl}/berry/${invalidId}/`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.equal(404);
                expect(response.body).to.equal('Not Found');
            });
        });
    });

    describe('Berry by Name', () => {
        it('should return berry data for valid name', () => {
            const validName = 'cheri';
            cy.request({
                method: 'GET',
                url: `${baseUrl}/berry/${validName}/`,
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('name', validName);
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
                url: `${baseUrl}/berry/${invalidName}/`,
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