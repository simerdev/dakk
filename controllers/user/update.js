import Boom from 'boom';
import joi from 'joi';
import db from '../../db';
import { generatePass } from '../../helpers/hashPassword';

const { User } = db.models;

module.exports = {
  auth: 'jwt',

  tags: ['api', 'user'],

  description: 'Update User Info',

  notes: 'udate User Info',

  validate: {
    params: {
      userId: joi
        .number()
        .required()
        .description('User Id')
    },
    payload: {
      userName: joi
        .string()
        .optional()
        .description('New Username'),

      password: joi
        .string()
        .optional()
        .description('New Password')
    }
  },
  handler: async (request, h) => {
    const { userId } = request.params;
    console.log('falaanana ===>');
    const { password } = request.payload;

    if (password) {
      request.payload.password = await generatePass(password);
    }

    try {
      const users = await User
      .update(request.payload, {
        where: {
          id: userId
        }
      });

      return h.response(users);
    } catch (e) {
      console.log(e);
      Boom.badRequest('Error While Updating User', e);
    }
  }
};