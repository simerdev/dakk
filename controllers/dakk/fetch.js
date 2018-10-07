import joi from 'joi';
import Boom from 'boom';
import db from '../../db';

const { Dakk, Files } = db.models;

Dakk.hasMany(Files, {foreignKey: 'id'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });

module.exports = {
  tags: ['api', 'dakk'],

  description: 'Get All Dakks',

  notes: 'get details of all dakks',

  validate: {
    query: {
      page: joi
        .number()
        .default(1)
        .description('Page No.'),

      offset: joi
        .number()
        .default(10)
        .description('Offset number')
    }
  },

  handler: async (request, h) => {
    const {page, offset} = request.query;

    try {
      const dakks = await Dakk
      .findAndCountAll({
        attributes: ['name', 'status', 'id'],
        include: [
          Files
        ],
        offset: page === 0 ? 1 : (page * offset) + 1,
        limit: offset,
      });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  },
};

