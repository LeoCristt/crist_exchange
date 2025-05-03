module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Resource', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: DataTypes.STRING,
    category: DataTypes.STRING,
    color: DataTypes.STRING,
  }, { 
    tableName: 'Resources' 
  });
};