import joi from 'joi';
import Boom from 'boom';
import db from '../../db';

const { Comments } = db.models;

module.exports = {
  auth: 'jwt',

  tags: ['api', 'comment'],

  description: 'Delete Comment',

  notes: 'delete comment',

  validate: {
    params: {
      id: joi
        .number()
        .required()
        .description('Comment Id'),
    }
  },

  handler: async (request, h) => {
    const {id} = request.params;

    try {
      const comment = await Comments
      .destroy({
        where: {
          id
        }
      });
      
      return h.response(comment);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  },
};

