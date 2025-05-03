module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  pricePerUnit: { type: DataTypes.FLOAT, allowNull: false },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  transactionType: { type: DataTypes.ENUM('buy', 'sell', 'bid'), allowNull: false },
  auctionId: { type: DataTypes.INTEGER, allowNull: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { 
  tableName: 'Transactions' 
});
};