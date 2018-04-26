'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
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

const init = async () => {

  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      logEvents: ['response']
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