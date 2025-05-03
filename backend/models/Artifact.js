const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Artifact = sequelize.define('Artifact', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    rarity: { type: DataTypes.STRING, allowNull: false }, 
    image: { type: DataTypes.STRING },
  }, {
    tableName: 'Artifacts',
    timestamps: false,
  });

  return Artifact;
};