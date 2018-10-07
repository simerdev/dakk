'use strict';
import Hapi from 'hapi';
import path from 'path';
import { appHelper }  from './helpers';

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
});

const io = require('socket.io')(server.listener);

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
    // require('hapi-socket.io'),
    // require('hapi-io'),
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

  await healthCheck();

  await server.start();

  io.on('connection', function (socket) {
    console.log('socket connection');

    socket.on('addDakk', function (payload) {
      console.log('socket add Dakk called', payload);
      payload.message = `New Dakk ${payload.dakkName} is assigned to you`;
      io.emit('notification', payload);
    });

    socket.on('addDraft', function (payload) {
      console.log('socket add Draft called');
      payload.message = `New Draft on Dakk ${payload.dakkName}`;
      io.emit('notification', payload);
    });

  });

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();