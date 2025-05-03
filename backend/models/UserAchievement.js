module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserAchievement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { 
    tableName: 'UserAchievements' 
  });
};