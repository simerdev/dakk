module.exports = {
  development: {
    username: 'root',
    password: 'admin',
    database: 'Dakk',
    host: 'localhost',
    dialect: 'mysql',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      max: 50,
      acquire: 300000,
      idleTimeoutMillis: 300000,
      idle: 10000
    }
  },
  production: {
    username: 'dakk_admin1',
    password: 'admin_123',
    database: 'dakk_demo1',
    host: 'db4free.net',
    dialect: 'mysql',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      max: 50,
      acquire: 300000,
      idleTimeoutMillis: 300000,
      idle: 10000
    }
  }
};
