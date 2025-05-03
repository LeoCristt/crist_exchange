module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Achievement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
  }, {
    tableName: 'Achievements',
    timestamps: false,
  });
};
