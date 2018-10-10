import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files, Draft, DakkUser, Comments, User } = db.models;

Dakk.hasMany(Files, {foreignKey: 'dakkId'});
Dakk.hasMany(Draft, {foreignKey: 'dakkId'});
Dakk.hasMany(DakkUser, {foreignKey: 'dakkId'});
Dakk.hasMany(Comments, {foreignKey: 'dakkId'});

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
          { model: Comments, required: false, attributes: ['id', 'userId', 'comment', 'createdAt'] }
        ]
      });

      if (dakks.dataValues.comments.length > 0) {
        const userIds = dakks.dataValues.comments.map(d => d.userId);
          const userNamesArray = await User.findAll({
            attributes: ['userName', 'id'],
            where: {
              id: {
                $in: userIds
              }
            }
          });

          const comments = dakks.dataValues.comments.map(d => {
            const usr = userNamesArray.map(u => u.toJSON()).find(u => u.id === d.userId);
            if (usr) {
              d.dataValues.name = usr.userName;
            }

            return d;
          });

        delete dakks.dataValues.comments;
        dakks.dataValues.comments = comments;

        return h.response(dakks);
      } 

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};