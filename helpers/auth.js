import Boom from 'boom';
import { JWT_KEY } from '../constants';
import { validUser } from '../db/repositries/user';

const internals = {};

async function register (server, options) {  
  // register dependency to hapi-auth-coolie
  // and make sure it’s available to this plugin
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_KEY,
    validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });
}

const validate = async function (credentials, h) {
  console.log('validating');
  
  const unauthorized = (err) => {
    console.log('err', err);
    console.log('h', h);
    Boom.unauthorized(err || '');
  };

  return internals.checkIfUserValid(credentials)
    .then(user => {
      if (user) {
        return {
          isValid: true,
          credentials
        }
      }

      return {
        isValid: false
      }
    })
    .catch(e => {
      console.log(e);
      unauthorized(e);
      return {
        isValid: false
      }
    });
  // Run any checks here to confirm we want to grant these credentials access
  
};

internals.checkIfUserValid = async (credentials) => {
  const user = await validUser(credentials);
  return user;
}

exports.plugin = {  
  register,
  name: 'authentication',
  version: '1.0.0',
  once: true
}