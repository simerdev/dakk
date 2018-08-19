module.exports = {
  development: {
    username: 'admin',
    password: 'root',
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
  }
};
