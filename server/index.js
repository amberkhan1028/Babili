const express = require('express');
const { Client } = require('pg');
const { sequelize } = require('./db/index');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
// const connectionString = process.env.CONNECTION_STRING;

const db = new Client({
  connectionString: 'postgres://eewfrwfm:vbozuse9S9WUXM9uCpBzqWhzmyItP1_v@suleiman.db.elephantsql.com:5432/eewfrwfm',
});

db.connect().then(() => console.warn('connected')).catch((err) => console.warn(err));

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
