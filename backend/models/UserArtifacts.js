const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserArtifact = sequelize.define('UserArtifact', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    artifactId: { type: DataTypes.INTEGER, allowNull: false },
    acquiredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'UserArtifacts',
    timestamps: false,
    uniqueKeys: {
      user_artifact_unique: {
        fields: ['userId', 'artifactId']
      }
    }
  });

  return UserArtifact;
};