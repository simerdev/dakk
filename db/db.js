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
db.models.Files = db.import('./models/files');
db.models.DakkUser = db.import('./models/dakkuser');
db.models.Draft = db.import('./models/draft');
db.models.Comments = db.import('./models/comments');
db.models.SpeakOn = db.import('./models/speakon');

module.exports = db;