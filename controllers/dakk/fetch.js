import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk } = db.models;

module.exports = {
  tags: ['api', 'dakk'],

  description: 'Get All Dakks',

  notes: 'get details of all dakks',

  handler: (request, h) => {
    return Dakk.findAll()
    .then(users => {
      return h.response(users);
    })
    .catch(e => { 
      Boom.badRequest('invalid query');
      console.log(e)
    });
  }
};