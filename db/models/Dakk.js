module.exports = function(sequelize, DataTypes) {
  const Dakk = sequelize.define('Dakk', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING
    },
    uploadBy: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    filePath:{
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    tableName: 'dakk'
  });

  return Dakk;
}