import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants';

const generatePass = async (pass) => {
  const generateSalt = await bcrypt.genSalt(SALT_ROUNDS);
  const generateHash = await bcrypt.hash(pass, generateSalt);

  return generateHash;
};

const comparePass = async (requestPass, dbPass) => {
  const match = await bcrypt.compare(requestPass, dbPass);
  return match;
};

module.exports = {
  generatePass,
  comparePass
}