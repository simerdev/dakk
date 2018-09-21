import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Draft, User } = db.models;

module.exports = {
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

          const draftList = await Promise.all(drafts.map(async d => {
            const user = await User.findOne({
              attributes: ['userName'],
              where: {
                id: d.userId
              }
            });

            d.dataValues.replyBy = user.userName;
            return d;
          }));
      
        return h.response(draftList);
      }
    
      return Boom.badRequest('invalid query');
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};