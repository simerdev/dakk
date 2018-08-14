const joi = require('joi');
const sessionService = require('../../services/sessionService');
const boom = require('boom');

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
      email: joi
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
    // console.log('request.server.app', request.server.state);
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
          return boom.badRequest('User does not exists');
        }

        // compare pwd
        if (payload.password !== user.password) {
          return boom.badRequest('Invalid Password');
        }

        delete user.Password;

        const sid = String(user.id);
        request.server.states.format(sid, { user });
        request.cookieAuth.set({ sid });
        return h.response({ statusCode: 200, success: true, data: user });
      })
      .catch(onError);
  }
};
