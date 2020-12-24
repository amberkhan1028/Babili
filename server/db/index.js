require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  pool: {
    max: 9,
    min: 0,
    idle: 10000,
  },
});

module.exports = {
  sequelize,
};
