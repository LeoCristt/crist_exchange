module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserInventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, 
  { tableName: 'UserInventories' });
};