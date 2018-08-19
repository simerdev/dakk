import db from '../db';

const { User } = db.models;

exports.authenticate = async (userData) => {
  const res = await User.findOne({
    where: {
      userName: userData.username
    }
  });

  return res;
}