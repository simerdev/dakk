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
        .description('Array of files having name and path'),
      
      userName: joi
        .string()
        .max(20)
        .required()
        .description('Username'),

      branches: joi
        .array()
        .required()
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
        .description('Required to speak on ?'),

      comment: joi
        .optional()
        .description('Comments')
    },
    options: { abortEarly: false }
  },

  handler: async (request, h) => {
    const { name, userName, dakkFiles, branches, draftFiles, speakOn, comment } = request.payload;
    try {
      const dakk = await Dakk.create({
        name,
        type: 'pdf',
        uploadBy: userName,
        status: 'open',
        speakOn
      });
  
      console.log('dakk', dakk);

      /* 
        Added Speak On time
      */
      await SpeakOn.create({
        dakkId: dakk.id
      });

      /* 
        Add Files entries
      */

      const files = dakkFiles.map(f => {
        // const newPath = uploadImages(f.name, f.path, IMAGES_FOLDER_PATH);
      
        return {
          name: f.name,
          file: '',
          dakkId: dakk.id
        }
      });
  
      /* 
        Assign Dakk to Branches
      */

      const getBranches = branches.map(b => {
        return {
          userId: b,
          dakkId: dakk.id
        }
      });

      await Files.bulkCreate(files);
      await DakkUser.bulkCreate(getBranches);

      console.log('draftFiles', draftFiles);
      const userDetails = await User.findOne({
        attributes: ['id'],
        where: {
          userName
        }
      });

      const getUserId = userDetails.id;
      console.log('getUserId', userDetails);

      /* 
        Add Dakk Drafts
      */

      if (draftFiles && draftFiles.length > 0) {
        const drafts = draftFiles.map(f => {
          // const newPath = uploadImages(f.name, f.path, DRAFT_FOLDER_PATH);
        
          return {
            fileName: f.name,
            userId: getUserId,
            dakkId: dakk.id
          }
        });

        console.log('drafts', drafts);

        await Draft.bulkCreate(drafts);
      }

      /* 
        Add Comments for Dakk
      */
      if (comment !== null && comment !== '' && comment !== undefined) {
        await Comments.create({
          userId: getUserId,
          dakkId: dakk.id,
          comment
        });
      }

    /* 
      Add Notification
    */
    await addNotification({
      assignedTo: branches,
      message: `New Dakk ${dakk.name} is assigned to you`
    });

      return h.response(dakk);
    } catch (e) {
      Boom.badRequest('Error while creating dakk', e);
      console.log(e);
    }
  }
};