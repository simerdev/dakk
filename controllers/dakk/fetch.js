import joi from 'joi';
import Boom from 'boom';
import db from '../../db';

const { Dakk, Files, DakkUser, User } = db.models;

Dakk.hasMany(Files, {foreignKey: 'id'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });
Dakk.hasMany(DakkUser, {foreignKey: 'dakkId'});
DakkUser.belongsTo(User, {foreignKey: 'userId'});

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
        .description('Offset number'),

      speakUp: joi
        .string()
        .valid('all', 'pending')
        .optional()
        .description('Speak Up filter')
    }
  },

  handler: async (request, h) => {
    const { page, offset, speakUp } = request.query;
    const condition = {};

    try {
      if (speakUp) {
        if (speakUp === 'pending') {
          condition.speakOn = 1;
        }

        const dakks = await Dakk
        .findAll({
          attributes: ['name', 'updatedAt', 'speakOn', 'id'],
          where: condition,
          include: [
            { model: DakkUser, attributes: ['userId'], include: [{ model: User, attributes: ['userName'] }] }
          ],
          offset: page === 0 ? 0 : (page * offset),
          limit: offset,
        });

        const count = await Dakk.count({ where: condition });

        return h.response({
          rows: dakks,
          count
        });
      }

      const dakks = await Dakk
      .findAll({
        attributes: ['name', 'status', 'id'],
        condition,
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

