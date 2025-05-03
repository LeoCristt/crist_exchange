module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Galaxy', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    resources: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    distance: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    image: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  }, {
    tableName: 'Galaxies',
    timestamps: false
  });
};