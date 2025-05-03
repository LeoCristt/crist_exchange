module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ResourcePrice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    change: DataTypes.FLOAT,
    volume: DataTypes.STRING,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { 
    tableName: 'ResourcePrices'
  });
};
