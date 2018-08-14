import Boom from 'boom';

const USERNAME = 'admin';
const PASSWORD = '12345';

async function register (server, options) {  
  // register dependency to hapi-auth-basic
  // and make sure it’s available to this plugin
  await server.register({
    plugin: require('hapi-auth-cookie')
  })

  /*
    Baisc authendication using basic scheme. Basic scheme is auto used when
    we use simple startegy.
  */
  server.auth.strategy('session', 'cookie', {
    password: 'thisistestingpassword',
    cookie: 'sid',
    redirectTo: '/login',
    isSecure: false,
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid);
      const out = {
          valid: !!cached
      };

      if (out.valid) {
          out.credentials = cached.account;
      }

      return out;
    }
  });

  server.auth.default('session');
}

/* 
  Authendication using hapi auth basic plugin
*/
async function register (server, options) {  
  // register dependency to hapi-auth-basic
  // and make sure it’s available to this plugin
  await server.register({
    plugin: require('hapi-auth-basic')
  })

  /*
    Baisc authendication using basic scheme. Basic scheme is auto used when
    we use simple startegy.
  */
  server.auth.strategy('simple', 'basic', {
    validate: async (request, username, password,  h) => {
      if (username !== USERNAME) {
        h.unauthenticated(Boom.unauthorized('Username is not correct'));
      }

      if (username === USERNAME && password !== PASSWORD) {
        return Boom.unauthorized('Password is incorrect for this username');
      }

      const isValid = username === USERNAME && password === PASSWORD;

      return { isValid, credentials: { id: '1', username: 'Ham Hai Admin' }};
    }
  });
}

exports.plugin = {  
  register,
  name: 'authentication',
  version: '1.0.0',
  once: true
}