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

  handler: async (request, h) => {
    try {
      const dakks = await Dakk
      .findAll({
        attributes: ['name', 'status', 'id'],
        include: [
          Files
        ]
      });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};