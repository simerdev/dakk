'use strict';
import Hapi from 'hapi';
import path from 'path';

import { appHelper }  from './helpers';

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

const init = async () => {
  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
      version: '1.0.0',
      },
    };
    
  await server.register([
    require('vision'),
    require('inert'),
    {
      plugin: require('hapi-swagger'),
      options: swaggerOptions
    },
    {
      plugin: require('./helpers/auth')
    },
    {
      plugin: require('hapi-router'),
      options: {
        cwd: __dirname,
        routes: 'controllers/**/*Controller.js' // uses glob to include files
      }
    }
  ]);

  server.route({
    method: 'GET',
    path: '/public/{file*}',
    handler: {
      directory: {
        path: path.join(__dirname, './', 'assets'),
        listing: true
      }
    }
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