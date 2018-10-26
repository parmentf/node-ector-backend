const server = require('../index');

const defaultRequest = {
    method: 'POST',
    url: '/v1/learn',
    payload: {}
};

describe('POST /learn', () => {
    it('should answer with a 200 code', (done) => {
        const request = {
            ...defaultRequest,
            payload: {  }
        };
        expect(server.inject(request)).resolves.toBe();
    });
});
