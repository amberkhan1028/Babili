/* eslint-disable consistent-return */
const { Router } = require('express');
require('dotenv').config();

const router = Router();
const { Client } = require('pg');

const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});
// establish DB connections
db.connect()
  .then(() => console.warn('db connected !! :^)'))
  .catch((e) => console.warn(`unable to connect to db: ${e.message}`));
// get all users
router.get('/user', async (req, res) => {
  try {
    const findAll = 'SELECT * FROM users';
    const { rows } = await db.query(findAll);
    if (rows) res.status(200).send(rows);
  } catch (err) {
    res.send({
      message: err.message,
    });
  }
});
// add user
router.post('/login', async (req, res) => {
  const {
    email, name, photoUrl, id, accessToken,
  } = req.body;
  console.warn(req.body);
  const insertOne = 'INSERT into users (email, username, userid, image, session) VALUES ($1, $2, $3, $4, $5)';
  await db.query(insertOne, [email, name, id, photoUrl, accessToken]);
  res.status(201).send({ error: false, message: 'user added successfully!' });
});
// get a specific user
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  const findOne = 'SELECT * FROM Users WHERE email = $1';
  const { rows, rowCount } = await db.query(findOne, [email]);
  if (rowCount > 0) return res.status(200).send(rows[0]);
  res.status(404).send({ error: true, message: 'user with given email not found' });
});
// finds a user based on email and update their profile info
router.patch('/user/:email', async (req, res) => {
  const { email } = req.params;
  const {
    country,
    language,
    aboutme,
  } = req.body;
    // update query
  const updateQuery = 'UPDATE users SET country = $1, language = $2, aboutme = $3 WHERE email = $4';
  // find user
  const findOne = 'SELECT * FROM Users WHERE email = $1';
  const { rows, rowCount } = await db.query(findOne, [email]);
  if (rowCount > 0) {
    const user = rows[0];
    // update user
    const results = await db.query(updateQuery, [country || user.country,
      language || user.language, aboutme || user.aboutme, email]);
    if (results) res.status(200).send(`updated user with email: ${email}`);
  } else {
    res.status(404).send({ error: true, message: 'user with given email not found' });
  }
});
module.exports = router;
