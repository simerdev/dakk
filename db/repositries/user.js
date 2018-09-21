import db from '../db';

const { User } = db.models;

const validUser = async (credentials) => {
  const res = await User.findOne({
    where: {
      userName: credentials.userName,
      password: credentials.password,
      roleId: credentials.roleId
    }
  });

  return res;
}

module.exports = {
  validUser
}