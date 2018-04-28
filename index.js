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

      return 'Welcome to ECTOR backend. See <a href="https://github.com/parmentf/node-ector-backend#readme">documentation</a>.';
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
  path: '/v1/reply/{user}/{entry}',
  handler: (request, h) => {
    const { user, entry } = request.params;
    const answer = reply(ector, user, entry);
    request.logger.info(`/v1/reply/${user}/${entry} ==> ${answer.sentence}`);
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

init();