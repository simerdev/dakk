import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files, DakkUser } = db.models;

Dakk.hasMany(Files, {foreignKey: 'dakkId'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });

module.exports = {
  auth: 'jwt',
  
  tags: ['api', 'dakk', 'branch'],

  description: 'Get All Dakks of Particular Branch',

  notes: 'get details of all dakks of Particular Branch',

  validate: {
    params: {
      branchId: joi
        .number()
        .required()
        .description('Branch Id')
    },
    query: {
      page: joi
        .number()
        .default(1)
        .description('Page No.'),

      offset: joi
        .number()
        .default(10)
        .description('Offset number')
    }
  },

  handler: async (request, h) => {
    const { branchId } = request.params;
    const {page, offset} = request.query;

    try {
      const findDakks = await DakkUser.findAll({
        where: {
          userId: branchId
        }
      });
      
      const dakkIds = findDakks.map(d => d.dakkId);

      const dakks = await Dakk
        .findAll({
          attributes: ['name', 'status', 'id', 'speakOn', 'createdAt', 'updatedAt'],
          where: {
            id: {
              $in: dakkIds
            }
          },
          include: [
            Files
          ],
          offset: page === 0 ? 0 : (page * offset),
          limit: offset,
          order: [['createdAt', 'DESC']],
        });

        const count = await Dakk.count({
          where: {
            id: {
              $in: dakkIds
            }
          }
        });
                
      return h.response({
        rows: dakks,
        count
      });
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};