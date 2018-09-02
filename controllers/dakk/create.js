import joi from 'joi';
import { uploadImages } from '../../helpers/processFiles';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files } = db.models;

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form'
    }
  }, 

  tags: ['api', 'dakk'],

  description: 'Create New Dakk',

  notes: 'create new dakk',

  validate: {
    payload: {
      name: joi
        .string()
        .max(50)
        .required()
        .description('Name of dakk'),
      
      dakkFiles: joi
        .array()
        .required()
        .description('Array of files containing name and path'),
      
      userName: joi
        .string()
        .max(20)
        .required()
          .description('Username')
    },
    options: { abortEarly: false }
  },

  handler: async (request, h) => {
    const { name, userName, dakkFiles } = request.payload;
    try {
      const dakk = await Dakk.create({
        name,
        type: 'pdf',
        uploadBy: userName,
        status: 'open'
      });
  
      const files = dakkFiles.map(f => {
        const newPath = uploadImages(f.name, f.path);
      
        return {
          name: f.name,
          file: newPath,
          dakkId: dakk.id
        }
      });
  
      await Files.bulkCreate(files);

      return h.response(dakk);
    } catch (e) {
      Boom.badRequest('Error while creating dakk', e);
      console.log(e);
    }
  }
};