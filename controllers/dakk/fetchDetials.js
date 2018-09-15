import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files, Draft } = db.models;
Dakk.hasMany(Files, {foreignKey: 'id'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });

Dakk.hasMany(Draft, {foreignKey: 'id'});
Draft.belongsTo(Dakk, { foreignKey: 'dakkId' });

module.exports = {
  tags: ['api', 'dakk'],

  description: 'Get Dakk Detials',

  notes: 'get details of dakk',

  validate: {
    params: {
      dakkId: joi
        .number()
        .required()
        .description('Dakk Id')
    }
   },

  handler: async (request, h) => {
    const { dakkId } = request.params;
    
    try {
      const dakks = await Dakk
      .findOne({
        where: {
          id: dakkId
        },
        include: [
          Files,
          Draft
        ]
      });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};