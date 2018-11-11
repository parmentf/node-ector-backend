const server = require('../index');

let defaultRequest;

describe('POST /learn', () => {
    beforeAll(() => {
        defaultRequest = {
            method: 'POST',
            url: '/v1/learn/',
        };
    });

    it('should answer with 400 when no payload', (done) => {
        const request = {
            ...defaultRequest,
            payload: {  }
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });

    it('should answer with a 201 code', (done) => {
        const request = {
            ...defaultRequest,
            payload: {
                source: 'Source',
                entry: 'Entry'
            }
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(201);
                done();
            });
    });
});

describe('GET /learn', () => {
    beforeAll(() => {
        defaultRequest = {
            method: 'GET'
        };
    });

    it('should answer with 201 code', (done) => {
        const request = {
            ...defaultRequest,
            url: '/v1/learn/Source/Entry'
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(201);
                done();
            });
    });

    it('should answer with 404 code with incomplete URL', (done) => {
        const request = {
            ...defaultRequest,
            url: '/v1/learn/'
        };
        server.inject(request)
            .then(response => {
                expect(response.statusCode).toBe(404);
                done();
            });
    });
});
