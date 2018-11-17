const server = require('../index');

let defaultRequest;

describe('GET /reply', () => {
    beforeAll(() => {
        defaultRequest = {
            method: 'GET'
        };
    });

    it('should answer with 200 code', (done) => {
        const request = {
            ...defaultRequest,
            url: '/v1/reply/User/Entry'
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.result).toEqual({
                    sentence: 'Entry',
                    nodes: [2]
                });
                done();
            });
    });

    it('should answer with 404 code with incomplete URL', (done) => {
        const request = {
            ...defaultRequest,
            url: '/v1/reply/'
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(404);
                done();
            });
    });

    it('should swap user and bot names', (done) => {
        const request = {
            ...defaultRequest,
            url : '/v1/reply/User2/Hi ECTOR.'
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.result).toEqual({
                    sentence: 'Hi User2.',
                    nodes: [4, 5]
                });
                done();
            });
    });
});
