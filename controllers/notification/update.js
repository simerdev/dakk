import joi from 'joi';
import Boom from 'boom';
import { updateNotification } from '../../db/repositries/notification';

module.exports = {
  auth: 'jwt',

  tags: ['api', 'notification'],

  description: 'Update Notifications of a User',

  notes: 'update Notifications of a User',

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
      const res = await updateNotification(userId);
      return h.response(res);
    } catch (e) {
      console.log(e);
      Boom.badRequest('Error while updating notifications', e);
    }
  },
};

