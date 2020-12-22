require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  session: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  friends: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
  },
  country: {
    type: DataTypes.STRING,
  },
  aboutMe: {
    type: DataTypes.STRING,
  },
  skillLevel: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
});

const WordBank = sequelize.define('WordBank', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nativeTerm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nativeDef: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engTerm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engDef: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  fav: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = {
  sequelize,
  WordBank,
  User,
};
