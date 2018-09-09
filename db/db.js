const Sequelize = require('sequelize');

const settings = require('config');

const db = new Sequelize(settings.db.database, settings.db.username, settings.db.password, {
  host: settings.db.host,
  dialect: settings.db.dialect,
  pool: {
    max: 5,
    min: 0
  }
});

db.models.Dakk = db.import('./models/Dakk');
db.models.User = db.import('./models/User');
db.models.Files = db.import('./models/Files');
db.models.DakkUser = db.import('./models/DakkUser');
db.models.Draft = db.import('./models/Draft');

module.exports = db;