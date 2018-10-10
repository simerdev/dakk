import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Draft, User } = db.models;

module.exports = {
  auth: 'jwt',
  
  tags: ['api', 'dakk'],

  description: 'Get All Drafts Associated to user',

  notes: 'get details of all drafts Associated to user',

  validate: {
    params: {
      userName: joi
        .string()
        .required()
        .description('Username'),

      dakkId: joi
        .number()
        .required()
        .description('Dakk Id')
    }
  },
  handler: async (request, h) => {
    const { userName, dakkId } = request.params;
    let condition;
    try {
      const user = await User.findOne({
        attributes: ['id'],
        where: {
          userName
        }
      });

      if (user) {
        if (user.roleId === 1) {
          condition = {
            dakkId
          };
        } else {
          condition = {
            $and: [
              {dakkId},
              {
                $or: [
                  { userId: user.id },
                  { userId: 1 }
                ]
              }
            ]
          };
        }

        const drafts = await Draft
          .findAll({
            attributes: ['fileName', 'userId', 'createdAt'],
            where: condition
          });

          const userIds = drafts.map(d => d.userId);
          const userNamesArray = await User.findAll({
            attributes: ['userName', 'id'],
            where: {
              id: {
                $in: userIds
              }
            }
          });

          const draftList = drafts.map(d => {
            const usr = userNamesArray.map(u => u.toJSON()).find(u => u.id === d.userId);
            if (usr) {
              d.dataValues.replyBy = usr.userName;
            }

            return d;
          });
      
        return h.response(draftList);
      }
    
      return Boom.badRequest('invalid query');
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};