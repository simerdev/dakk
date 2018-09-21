import joi from 'joi';
import Boom from 'boom';
import db from '../../db';
const { Dakk, Files, DakkUser } = db.models;

Dakk.hasMany(Files, {foreignKey: 'dakkId'});
Files.belongsTo(Dakk, { foreignKey: 'dakkId' });

module.exports = {
  tags: ['api', 'dakk', 'branch'],

  description: 'Get All Dakks of Particular Branch',

  notes: 'get details of all dakks of Particular Branch',

  validate: {
    params: {
      branchId: joi
        .number()
        .required()
        .description('Branch Id')
    }
  },

  handler: async (request, h) => {
    const { branchId } = request.params;

    try {
      const findDakks = await DakkUser.findAll({
        where: {
          userId: branchId
        }
      });

      const dakkIds = findDakks.map(d => d.dakkId);

      const dakks = await Dakk
        .findAll({
          attributes: ['name', 'status', 'id', 'createdAt', 'updatedAt'],
          where: {
            id: {
              $in: dakkIds
            }
          },
          include: [
            Files
          ],
          order: [['createdAt', 'DESC']],
        });

      return h.response(dakks);
    } catch (e) {
      console.log(e);
      Boom.badRequest('invalid query');
    }
  }
};