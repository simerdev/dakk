import { JWT_KEY } from '../../constants';
import { comparePass } from '../../helpers/hashPassword';

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
      .then(async res => {
        const user = res && res.dataValues;
        // check if user exists
        if (!user) {
          return boom.unauthorized('User does not exists');
        };

        const match = await comparePass(payload.password, user.password);
        // compare pwd
        if (!match) {
          return boom.badRequest('Invalid Password');
        }

        const credentials = {
          userName: user.userName,
          password: user.password,
          roleId: user.roleId
        };

        const token = jwt.sign(credentials, JWT_KEY, { algorithm: 'HS256', expiresIn: '1h' });

        const data = {
          roleId: user.roleId,
          userId: user.id,
          adminId: user.adminId,
          token
        };

        return { data };
      })
      .catch(onError);
  }
};
