'use strict';
import Hapi from 'hapi';
import Boom from 'boom';
import { appHelper }  from './helpers';

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const context = {
  title: 'My personal site'
};

server.state('data', {
  ttl: null,
  isSecure: false,
  isHttpOnly: true,
  clearInvalid: false,
  strictHeader: true
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    const headers = request.headers;
    const response = h.response(request.location);
    response.type('application/json')
    response.header('my-value', 'XXXX');
    h.state('data', 'test', { encoding: 'none' });
    return h.response('Hello');

    return response;
  },
  options: {
    cache: {
        expiresIn: 30 * 1000,
        privacy: 'private'
    }
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (request, h) => {
      return 'Hello, ' + encodeURIComponent(request.params.name) + ' ' + request.query.name + ' !';
  }
});

server.route({
  method: 'GET',
  path: '/json',
  handler: (request, h) => {
    const data = {
      id: 223,
      name: 'Harsimran'
    };

    const value = request.state;
    console.log('cokkie value', value);
    return h.response(data).code(400);
  }
});

const healthCheck = async () => {
  await appHelper.checkDbConnection();
};

const init = async () => {
  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
      version: '1.0.0',
      },
    };
    
  await server.register([
    {
      plugin: require('./helpers/auth')
    },
    require('vision'),
    require('inert'),
    {
      plugin: require('hapi-swagger'),
      options: swaggerOptions
    },
    {
      plugin: require('hapi-router'),
      options: {
        cwd: __dirname,
        routes: 'controllers/**/*Controller.js' // uses glob to include files
      }
    }
  ]);

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layout: 'default-layout',
    helpersPath: './views/helpers',
    context
  });

  server.route({
    method: 'GET',
    path: '/login',
    handler: (request, h) => {
      return h.view('index')
    }
  });

  await healthCheck();

  // server.auth.default('session');

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();