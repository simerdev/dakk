async function register (server, options) {  
  // register dependency to hapi-auth-coolie
  // and make sure it’s available to this plugin
  await server.register(require('hapi-auth-jwt2'));
}

exports.plugin = {  
  register,
  name: 'authentication',
  version: '1.0.0',
  once: true
}