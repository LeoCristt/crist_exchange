// require('dotenv').config();
// const { Sequelize, DataTypes } = require('sequelize');

// const {
//   DB_HOST,
//   DB_PORT,
//   DB_NAME,
//   DB_USER,
//   DB_PASSWORD,
// } = process.env;

// if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER) {
//   console.error('Ошибка: проверьте, что в .env заданы DB_HOST, DB_PORT, DB_NAME и DB_USER.');
//   process.exit(1);
// }

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: 'postgres',
//   logging: false,
// });

// const modelDefiners = [
//   require('./User'),
//   require('./Resource'),
//   require('./Galaxy'),
//   require('./ResourcePrice'),
//   require('./UserInventory'),
//   require('./Achievement'),
//   require('./UserAchievement'),
//   require('./Transaction'),
//   require('./Artifact'),      // Добавляем новую модель Artifact
//   require('./UserArtifacts'),  // Добавляем новую модель UserArtifact
//   require('./Auction')
// ];

// const models = {};
// for (const defineModel of modelDefiners) {
//   const model = defineModel(sequelize, DataTypes);
//   models[model.name] = model;
// }

// const {
//   User,
//   Resource,
//   Galaxy,
//   ResourcePrice,
//   UserInventory,
//   Achievement,
//   UserAchievement,
//   Transaction,
//   Artifact,
//   UserArtifact,
//   Auction,
// } = models;

// // Связи

// // Пользователь и инвентарь (ресурсы)
// User.hasMany(UserInventory, { foreignKey: 'userId' });
// UserInventory.belongsTo(User, { foreignKey: 'userId' });

// // Пользователь и ресурсы через инвентарь
// User.belongsToMany(Resource, {
//   through: UserInventory,
//   foreignKey: 'userId',
//   otherKey: 'resourceId',
// });
// Resource.belongsToMany(User, {
//   through: UserInventory,
//   foreignKey: 'resourceId',
//   otherKey: 'userId',
// });

// // Пользователь и транзакции
// User.hasMany(Transaction, { foreignKey: 'userId' });
// Transaction.belongsTo(User, { foreignKey: 'userId' });

// // Достижения пользователя
// User.belongsToMany(Achievement, {
//   through: UserAchievement,
//   foreignKey: 'userId',
//   otherKey: 'achievementId',
// });
// Achievement.belongsToMany(User, {
//   through: UserAchievement,
//   foreignKey: 'achievementId',
//   otherKey: 'userId',
// });

// // Ресурсы и их цены
// Resource.hasMany(ResourcePrice, { foreignKey: 'resourceId' });
// ResourcePrice.belongsTo(Resource, { foreignKey: 'resourceId' });
// Galaxy.hasMany(ResourcePrice, { foreignKey: 'galaxyId' });
// ResourcePrice.belongsTo(Galaxy, { foreignKey: 'galaxyId' });

// // Инвентарь и ресурс
// Resource.hasMany(UserInventory, { foreignKey: 'resourceId' });
// UserInventory.belongsTo(Resource, { foreignKey: 'resourceId' });

// // Транзакции и ресурс
// Resource.hasMany(Transaction, { foreignKey: 'resourceId' });
// Transaction.belongsTo(Resource, { foreignKey: 'resourceId' });

// // Ачивки и ачивки в профиле пользователя
// UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId' });
// Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId' });

// // Пользователь и артефакты
// User.hasMany(UserArtifact, { foreignKey: 'userId' });
// UserArtifact.belongsTo(User, { foreignKey: 'userId' });

// // Артефакт и пользовательские артефакты
// Artifact.hasMany(UserArtifact, { foreignKey: 'artifactId' });
// UserArtifact.belongsTo(Artifact, { foreignKey: 'artifactId' });

// Auction.hasMany(Transaction, { foreignKey: 'auctionId' });
// Transaction.belongsTo(Auction, { foreignKey: 'auctionId' });

// module.exports = { sequelize, ...models };  

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER) {
  console.error('Ошибка: проверьте, что в .env заданы DB_HOST, DB_PORT, DB_NAME и DB_USER.');
  process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});

const modelDefiners = [
  require('./User'),
  require('./Resource'),
  require('./Galaxy'),
  require('./ResourcePrice'),
  require('./UserInventory'),
  require('./Achievement'),
  require('./UserAchievement'),
  require('./Transaction'),
  require('./Artifact'),
  require('./UserArtifacts'),
  require('./Auction'),
];

const models = {};
for (const defineModel of modelDefiners) {
  const model = defineModel(sequelize, DataTypes);
  models[model.name] = model;
}

const {
  User,
  Resource,
  Galaxy,
  ResourcePrice,
  UserInventory,
  Achievement,
  UserAchievement,
  Transaction,
  Artifact,
  UserArtifact,
  Auction,
} = models;

// Associations

// User and UserInventory
User.hasMany(UserInventory, { foreignKey: 'userId' });
UserInventory.belongsTo(User, { foreignKey: 'userId' });

// User and Resource through UserInventory
User.belongsToMany(Resource, {
  through: UserInventory,
  foreignKey: 'userId',
  otherKey: 'resourceId',
});
Resource.belongsToMany(User, {
  through: UserInventory,
  foreignKey: 'resourceId',
  otherKey: 'userId',
});

// User and Transaction
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// User and Achievement through UserAchievement
User.belongsToMany(Achievement, {
  through: UserAchievement,
  foreignKey: 'userId',
  otherKey: 'achievementId',
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
  foreignKey: 'achievementId',
  otherKey: 'userId',
});

// Resource and ResourcePrice
Resource.hasMany(ResourcePrice, { foreignKey: 'resourceId' });
ResourcePrice.belongsTo(Resource, { foreignKey: 'resourceId' });

// Galaxy and ResourcePrice
Galaxy.hasMany(ResourcePrice, { foreignKey: 'galaxyId' });
ResourcePrice.belongsTo(Galaxy, { foreignKey: 'galaxyId' });

// Resource and UserInventory
Resource.hasMany(UserInventory, { foreignKey: 'resourceId' });
UserInventory.belongsTo(Resource, { foreignKey: 'resourceId' });

// Resource and Transaction
Resource.hasMany(Transaction, { foreignKey: 'resourceId' });
Transaction.belongsTo(Resource, { foreignKey: 'resourceId' });

// Achievement and UserAchievement
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId' });
Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId' });

// User and UserArtifact
User.hasMany(UserArtifact, { foreignKey: 'userId' });
UserArtifact.belongsTo(User, { foreignKey: 'userId' });

// Artifact and UserArtifact
Artifact.hasMany(UserArtifact, { foreignKey: 'artifactId' });
UserArtifact.belongsTo(Artifact, { foreignKey: 'artifactId' });

// Auction and Transaction
Auction.hasMany(Transaction, { foreignKey: 'auctionId' });
Transaction.belongsTo(Auction, { foreignKey: 'auctionId' });

// Auction and Artifact
Auction.belongsTo(Artifact, { foreignKey: 'artifactId' });
Artifact.hasMany(Auction, { foreignKey: 'artifactId' });

// Auction and User (Winner)
Auction.belongsTo(User, { foreignKey: 'winnerId' });
User.hasMany(Auction, { foreignKey: 'winnerId' });

module.exports = { sequelize, ...models };