'use strict';
import Hapi from 'hapi';
import path from 'path';
import { appHelper }  from './helpers';
import { addNotification } from './db/repositries/notification';

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: '0.0.0.0' || 'localhost'
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
    var clients = socket.client.conn.emit.length;
    console.log("clients: " + clients);
    
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

    socket.on('addComment', function (payload) {
      console.log('socket add comment called');
      payload.message = `New Comment Added on Dakk ${payload.dakkName}`;
      io.emit('notification', payload);
    });

    socket.on('end', function () {
      console.log('conenct disconnected');
      socket.disconnect(true);
      // socket.connected[socket.id].disconnect();

      var clients = socket.client.conn.emit.length;
      setTimeout(function() {
        console.log("clients: " + clients);
      }, 5000);
    });
  }); 

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();