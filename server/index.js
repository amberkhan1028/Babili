const express = require('express');
const { sequelize } = require('./db/index');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

async function assertDatabaseConnectionOk() {
  try {
    await sequelize.authenticate();
    console.warn('Database connection OK!');
  } catch (error) {
    console.warn('Unable to connect to the database:');
    console.warn(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.warn(`Starting Sequelize + Express on port ${PORT}...`);

  app.listen(PORT, () => {
    console.warn(`Express server started on port ${PORT}.`);
  });
}

init();
