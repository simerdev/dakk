'use strict';
import Hapi from 'hapi';
import Boom from 'boom';
import { appHelper }  from './helpers';
import { JWT_KEY } from './constants';

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const context = {
  title: 'My personal site'
};

const healthCheck = async () => {
  await appHelper.checkDbConnection();
};

const validate = function (credentials) {
  // Run any checks here to confirm we want to grant these credentials access
  return {
    isValid: true,
    credentials // request.auth.credentials
  }
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

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_KEY,
    validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

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

  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();