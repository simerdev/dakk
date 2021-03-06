import joi from 'joi';
import { uploadImages } from '../../helpers/processFiles';
import Boom from 'boom';
import db from '../../db';
import { IMAGES_FOLDER_PATH, DRAFT_FOLDER_PATH } from '../../constants';
import { addNotification } from '../../db/repositries/notification';

const { Dakk, Files, DakkUser, Draft, User, Comments, SpeakOn } = db.models;

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
        .description('Required to speak on ?'),

      comment: joi
        .optional()
        .description('Comments')
    },
    options: { abortEarly: false }
  },

  handler: async (request, h) => {
    const { name, dakkFiles, branches, draftFiles, status, speakOn, comment } = request.payload;
    const { dakkId, userName } = request.params;
    
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

      /* 
        Update Speak On time
      */
      await SpeakOn.update({
        updatedAt: new Date()
      }, {
        where: {
          dakkId
        }
      });

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
        attributes: ['id', 'adminId'],
        where: {
          userName
        }
      });

      const getUserId = userDetails.id;
      const getAdminId = userDetails.adminId;

      if (draftFiles) {
        if (draftFiles.length > 0) {
          const drafts = draftFiles.map(f => {
            return {
              fileName: f.name,
              userId: getUserId,
              dakkId: dakkId
            }
          });
  
          if (getAdminId !== 0) {
            await addNotification({
              assignedTo: branches,
              message: `New Draft on Dakk ${name}`
            });
          } else {
            await addNotification({
              assignedTo: [getAdminId],
              message: `New Draft on Dakk ${name}`
            });
          }
          

          console.log('drafts', drafts);
  
          await Draft.bulkCreate(drafts);
        }
      }
      
      if (comment !== null && comment !== '' && comment !== undefined) {
        await Comments.create({
          userId: getUserId,
          dakkId: dakkId,
          comment
        });

        if (getAdminId === 0) {
          await addNotification({
            assignedTo: branches,
            message: `New Comment on Dakk ${name}`
          });
        } else {
          console.log('getAdminId', getAdminId);

          await addNotification({
            assignedTo: [getAdminId],
            message: `New Comment on Dakk ${name}`
          });
        }
      }

      return h.response(dakk);
    } catch (e) {
      Boom.badRequest('Error while creating dakk', e);
      console.log(e);
    }
  }
};