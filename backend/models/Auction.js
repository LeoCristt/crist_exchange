const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Auction = sequelize.define('Auction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    artifactId: { type: DataTypes.INTEGER, allowNull: false },
    currentBid: { type: DataTypes.DECIMAL(10, 2), defaultValue: 1000 },
    endTime: { type: DataTypes.DATE, allowNull: false },
    winnerId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('active', 'ended'), defaultValue: 'active' },
  }, {
    tableName: 'Auctions',
    timestamps: false,
  });

  return Auction;
};