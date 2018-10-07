import Boom from 'boom';
import db from '../../db';
const { User } = db.models;

module.exports = {
  auth: 'jwt',

  tags: ['api', 'user'],

  description: 'Get All Users',

  notes: 'get details of all users',

  handler: async (request, h) => {
    try {
      const users = await User
      .findAll({
        attributes: ['userName', 'id'],
        where: {
          roleId: 2
        }
      });

      return h.response(users);
    } catch (e) {
      console.log(e);
      Boom.badRequest('Error While fetching Users list', e);
    }
  }
};