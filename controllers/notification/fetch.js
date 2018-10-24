import joi from 'joi';
import Boom from 'boom';
import { getNotifications } from '../../db/repositries/notification';

module.exports = {
  auth: 'jwt',

  tags: ['api', 'notification'],

  description: 'Fetch Unread Notifications of a User',

  notes: 'get Unread Notifications of a User',

  validate: {
    params: {
      userId: joi
        .number()
        .required()
        .description('User Id'),
    }
  },

  handler: async (request, h) => {
    const {userId} = request.params;

    try {
      const res = await getNotifications(userId);
      return h.response(res);
    } catch (e) {
      console.log(e);
      Boom.badRequest('Error while fetching notifications', e);
    }
  },
};

