import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk } = db.models;

module.exports = {
  tags: ['api', 'dakk'],

  description: 'Get All Dakks',

  notes: 'get details of all dakks',

  handler: async (request, h) => {
    try {
      const dakks = await Dakk
      .findAll({
        attributes: ['name', 'status']
      });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};