import joi from 'joi';
import Boom from 'boom';
import { uploadImage } from '../../helpers/processFiles';
import { IMAGES_FOLDER_PATH, DRAFT_FOLDER_PATH } from '../../constants';

module.exports = {
  auth: 'jwt',
  
  tags: ['api', 'files'],

  description: 'Upload Files',

  notes: 'upload files',

  validate: {
    payload: {
      file: joi
        .string()
        .required()
        .description('Base 64 url encoded'),

      name: joi
        .string()
        .default()
        .required()
        .description('Name of file'),

      type: joi
        .string()
        .required()
        .description('Type of file')
    }
  },

  handler: async (request, h) => {
    const {file, name, type} = request.payload;
    const pathFolder = type === 'Dakk' ? IMAGES_FOLDER_PATH : DRAFT_FOLDER_PATH;
    try {
      const path = await uploadImage(name, file, pathFolder);
      return h.response(path);
    } catch (e) {
      Boom.badRequest('Error while Uploading', e);
      console.log(e);
    }
  },
};

