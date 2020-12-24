const { Router } = require('express');

const router = Router();
const { Client } = require('pg');

const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});

router.get('/wordbank', async (req, res) => {
  await db.connect();
  const { rows } = await db.query('SELECT * FROM wordbank');
  res.send(rows);
  await db.end();
});

router.post('/wordbank', async (req, res) => {
  await db.connect();
  await db.query(
    `INSERT INTO wordbank (nativeterm, engterm) values ('${req.body.nativeterm}', '${req.body.engterm}')`,
  );
  res.send('success');
  await db.end();
});

module.exports = router;
