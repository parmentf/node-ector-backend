'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const Ector = require('ector');
const reply = require('./routes/reply');
const learn = require('./routes/learn');

const ector = new Ector();

const server = Hapi.server({
    port: process.env.PORT || 5000,
    routes: {
        validate: {
            failAction: async (request, h, err) => {
                if (process.env.NODE_ENV === 'production') {
                    // In prod, log a limited error message and throw the default Bad Request error.
                    console.error('ValidationError:', err.message); // Better to use an actual logger here.
                    throw Boom.badRequest(`Invalid request payload input`);
                } else {
                    // During development, log and respond with the full error.
                    console.error(err);
                    request.logger && request.logger.error(err);
                    throw err;
                }
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Welcome to ECTOR backend. See <a href="https://github.com/parmentf/node-ector-backend#readme">documentation</a>.';
    }
});

server.route({
    method: ['GET', 'POST'],
    path: '/hello/{name?}',
    handler: (request, h) => {
        const user = request.params.name || 'stranger';
        request.logger && request.logger.info(`user: ${user}`);
        return 'Hello, ' + user + '!';
    },
    options: {
        description: 'Say hello!',
        notes: 'The user parameter defaults to \'stranger\' if unspecified',
        tags: ['api', 'greeting']
    }
});

server.route({
    method: 'GET',
    path: '/v1/reply/{user}/{entry}',
    handler: (request, h) => {
        const { user, entry } = request.params;
        const answer = reply(ector, user, entry);
        request.logger && request.logger.info(`/v1/reply/${user}/${entry} ==> ${answer.sentence}`);
        return answer;
    },
    options: {
        cors: true,
        description: `Get the reply from to the user's entry.`,
        notes: `Warning: use the entry to learn.`,
        tags: ['api', 'reply', 'learn']
    }
});

server.route({
    method: 'GET',
    path: '/v1/learn/{source}/{entry}',
    handler: (request, h) => {
        const { source, entry } = request.params;
        const nodes = learn(ector, source, entry);
        request.logger && request.logger.info(`/v1/learn/${source}/${entry}`);
        return h.response(nodes).code(201);
    },
    options: {
        cors: true,
        description: `Add knowledge to ECTOR's concept network.`,
        notes: `No activation value added. The source is an identifier of where the knowledge comes from (eg Wikipedia).`,
        tags: ['api', 'learn']
    }
});

server.route({
    method: 'POST',
    path: '/v1/learn/',
    handler: (request, h) => {
        if (!request.payload || !request.payload.source || !request.payload.entry) {
            throw Boom.badRequest(`Payload required {source, entry}!`);
        }
        const { source, entry } = request.payload;
        const nodes = learn(ector, source, entry);
        request.logger && request.logger.info(`POST /v1/learn/${source}/${entry}`);
        return h.response(nodes).code(201);
    },
    options: {
        cors: true,
        description: `Add knowledge to ECTOR's concept network.`,
        notes: `No activation value added. The source is an identifier of where the knowledge comes from (eg Wikipedia).`,
        tags: ['api', 'learn']
    }
});

server.route({
    method: 'GET',
    path: '/v1/concept-network',
    handler: (request, h) => {
        return ector.cn;
    },
    options: {
        cors: true,
        description: `Get the Concept Network.`,
        notes: `This may be a large Javascript Object.`,
        tags: ['api', 'serialization', 'backup']
    }
});

server.route({
    method: 'GET',
    path: '/v1/concept-network-state/{user}',
    handler: (request, h) => {
        if (!ector.cns[request.params.user]) {
            return h.response('User not found').code(404);
        }
        return  ector.cns[request.params.user].nodeState;
    },
    options: {
        cors: true,
        description: `Get the Concept Network State for the user.`,
        notes: `The activation values only for the user.`,
        tags: ['api', 'serialization', 'backup']
    }
});

const init = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: process.env.NODE_ENV !== 'production',
            //logEvents: ['response']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

if (!module.parent) {
    init();
}

module.exports = server;
