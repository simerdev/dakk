import joi from 'joi';
import Boom from 'boom';
import db from '../../db';

const { Dakk, Files } = db.models;

Dakk.hasMany(Files, {foreignKey: 'id'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });

module.exports = {
  auth: 'jwt',
  
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
      .findAll({
        attributes: ['name', 'status', 'id'],
        include: [
          Files
        ],
        offset: page === 0 ? 0 : (page * offset),
        limit: offset,
      });

      const count = await Dakk.count();

      return h.response({
        rows: dakks,
        count
      });
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  },
};

