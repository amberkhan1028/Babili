/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');
const wordbank = require('./db/Routes/wordBank');
const user = require('./db/Routes/user');

const { sequelize } = require('./db/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', wordbank);
app.use('/', user);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;
// const connectionString = process.env.CONNECTION_STRING;
// const db = new Client({
//   connectionString: 'postgres://bpmlkbxh:m1BaCCNnI-bvaX5VzB1F5Wa5Gnku0C79@suleiman.db.elephantsql.com:5432/bpmlkbxh',
// });

const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});

async function connect() {
  try {
    await db.connect();
    console.warn('connected');
    const { rows } = await db.query('SELECT * FROM Users');
    console.table(rows);
    await db.end();
  } catch (error) {
    console.warn('Unable to connect to the database:');
    console.warn(error.message);
    process.exit(1);
  }
}
async function init() {
  // await connect();
  // require('./db/Routes/user')(app, db);
  console.warn(`Starting Sequelize + Express on port ${PORT}...`);
  app.listen(PORT, () => {
    console.warn(`Express server started on port ${PORT}.`);
  });
}
init();

module.exports = {
  db,
};
