import { JWT_KEY } from '../../constants';

const joi = require('joi');
const sessionService = require('../../services/sessionService');
const boom = require('boom');
const jwt = require('jsonwebtoken');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form'
    }
  }, 

  tags: ['api', 'session'],

  description: 'Authenticate User',

  notes: 'Authenticate User',

  validate: {
    payload: {
      username: joi
        .string()
        .max(250)
        .required()
        .description('Must be an email or username'),
      password: joi.string()
    },
    options: { abortEarly: false }
  },

  handler: (request, h) => {
    const payload = request.payload;
    
    const onError = (err) => {
      request.server.log(['error'], err);
      console.log(err);
      return boom.badRequest('There is an error', err);
    };

    return sessionService
      .authenticate(payload)
      .then(user => {
        // check if user exists
        if (!user) {
          return boom.unauthorized('User does not exists');
        };

        // compare pwd
        if (payload.password !== user.password) {
          return boom.badRequest('Invalid Password');
        }

        const credentials = {
          userName: user.username,
          password: user.password
        };

        const token = jwt.sign(credentials, JWT_KEY, { algorithm: 'HS256', expiresIn: '1h' });

        const data = {
          roleId: user.roleId,
          token
        };

        return { data };
      })
      .catch(onError);
  }
};
