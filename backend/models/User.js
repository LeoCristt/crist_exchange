module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.ENUM('captain', 'commander', 'admiral'), allowNull: false },
    experience: { type: DataTypes.ENUM('novice', 'intermediate', 'expert'), allowNull: false },
    station: { type: DataTypes.ENUM('alpha', 'proxima', 'trappist'), allowNull: false },
    balance: { type: DataTypes.FLOAT, defaultValue: 10000 },
  }, {
    tableName: 'Users',
    timestamps: true,
  });
};
