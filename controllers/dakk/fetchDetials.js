import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files, Draft, DakkUser } = db.models;

Dakk.hasMany(Files, {foreignKey: 'dakkId'});
Dakk.hasMany(Draft, {foreignKey: 'dakkId'});
Dakk.hasMany(DakkUser, {foreignKey: 'dakkId'});

module.exports = {
  auth: 'jwt',

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
        attributes: ['status', 'speakOn', 'name'],
        where: {
          id: dakkId
        },
        include: [
          { model: Files, required: false, attributes: ['name'] },
          { model: Draft, required: false, attributes: [['fileName', 'name']] },
          { model: DakkUser, required: false, attributes: ['userId'] },
        ]
      });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};