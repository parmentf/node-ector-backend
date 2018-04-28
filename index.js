'use strict';

const Hapi = require('hapi');
const Ector = require('ector');
const reply = require('./routes/reply');

const ector = new Ector();

const server = Hapi.server({
    port: process.env.PORT || 5000
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {

      return 'Welcome to ECTOR backend.';
  }
});

server.route({
  method: ['GET', 'POST'],
  path: '/hello/{name?}',
  handler: (request, h) => {
      const user = request.params.name || 'stranger';
      request.logger.info(`user: ${user}`);
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
  path: '/v1/json/{toto}',
  handler: (request, h) => {
    return {
      payload: request.params.toto,
      length: request.params.toto.length
    }
  }
});

server.route({
  method: 'GET',
  path: '/v1/reply/{user}/{entry}',
  handler: (request, h) => {
    const { user, entry } = request.params;
    const answer = reply(ector, user, entry);
    request.logger.info(`/v1/reply/${user}/${entry} ==> ${answer}`);
    return answer;
  },
  options: {
    description: `Get the reply from to the user's entry.`,
    notes: `Warning: use the entry to learn.`,
    tags: ['api', 'reply', 'learn']
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

init();