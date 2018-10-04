import joi from 'joi';
import { uploadImages } from '../../helpers/processFiles';
import Boom from 'boom';
import db from '../../db';
import { IMAGES_FOLDER_PATH, DRAFT_FOLDER_PATH } from '../../constants';

const { Dakk, Files, DakkUser, Draft, User } = db.models;

module.exports = {
  auth: 'jwt',

  plugins: {
    'hapi-swagger': {
      payloadType: 'form'
    }
  }, 

  tags: ['api', 'dakk'],

  description: 'Update Dakk Details',

  notes: 'update dakk details',

  validate: {
    params: {
      dakkId: joi
        .number()
        .required()
        .description('Dakk id to update'),

      userName: joi
        .string()
        .required()
        .description('user name')
    },
    payload: {
      name: joi
        .string()
        .max(50)
        .optional()
        .description('Name of dakk'),
      
      dakkFiles: joi
        .array()
        .optional()
        .description('Array of files having name and path'),

      branches: joi
        .array()
        .optional()
        .description('Assigned Branch Name'),

      draftFiles: joi
        .array()
        .optional()
        .description('Array of draft/reply files having name and path'),

      status: joi
        .string()
        .required()
        .max(5)
        .description('Status of dakk (Open or Close)'),

      speakOn: joi
        .boolean()
        .default(0)
        .optional()
        .allow([true, false])
        .description('Required to speak on ?')
    },
    options: { abortEarly: false }
  },

  handler: async (request, h) => {
    const { name, dakkFiles, branches, draftFiles, status, speakOn } = request.payload;
    const { dakkId, userName } = request.params;

    console.log('speakon', speakOn);
    
    try {
      const dakk = await Dakk.update({
        name,
        status: status,
        speakOn: speakOn
      }, {
        where: {
          id: dakkId
        }
      });
  
      console.log('dakk', dakk);

      if (dakkFiles) {
        if(dakkFiles.length > 0) {
          const files = dakkFiles.map(f => {
            const newPath = uploadImages(f.name, f.path, IMAGES_FOLDER_PATH);
          
            return {
              name: f.name,
              file: newPath,
              dakkId: dakkId
            }
          });
  
          await Files.bulkCreate(files);
        }
      }

      if (branches) {
        await DakkUser.destroy({
          where: {
            dakkId
          }
        });
  
        const getBranches = branches.map(b => {
          return {
            userId: b,
            dakkId
          }
        });
  
        await DakkUser.bulkCreate(getBranches);
      }
      const userDetails = await User.findOne({
        attributes: ['id'],
        where: {
          userName
        }
      });

      const getUserId = userDetails.id;

      if (draftFiles) {
        if (draftFiles.length > 0) {
          const drafts = draftFiles.map(f => {
            const newPath = uploadImages(f.name, f.path, DRAFT_FOLDER_PATH);
          
            return {
              fileName: f.name,
              userId: getUserId,
              dakkId: dakkId
            }
          });
  
          console.log('drafts', drafts);
  
          await Draft.bulkCreate(drafts);
        }
      }
      
      return h.response(dakk);
    } catch (e) {
      Boom.badRequest('Error while creating dakk', e);
      console.log(e);
    }
  }
};