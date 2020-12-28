const { Router } = require('express');
const Pusher = require('pusher');

const { Client } = require('pg');
const pusherConfig = require('../../../pusher.json');

const pusherClient = new Pusher(pusherConfig);
const router = Router();

const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});

router.put('/users/:name', (req, res) => {
  console.warn(`User is online: ${req.params.name}`);
  const online = async () => {
    await db.connect();
    await db.query(
      `UPDATE users SET online = 'true' WHERE USERNAME = ${req.params.name}`,
    );
    await db.end();
  };
  online();
  pusherClient.trigger('chat_channel', 'join', {
    name: req.params.name,
  });
  res.sendStatus(204);
});

router.delete('/users/:name', (req, res) => {
  console.warn(`User has logged off: ${req.params.name}`);
  const offline = async () => {
    await db.connect();
    await db.query(
      `UPDATE users SET online = 'false' WHERE USERNAME = ${req.params.name}`,
    );
    await db.end();
  };
  offline();
  pusherClient.trigger('chat_channel', 'part', {
    name: req.params.name,
  });
  res.sendStatus(204);
});

router.post('/users/:name/messages', (req, res) => {
  console.warn(`User ${req.params.name} sent message: ${req.body.message}`);
  const message = JSON.stringify(req.body.message);
  const insertMessage = async () => {
    await db.connect();
    await db.query(
      `UPDATE users SET messages = '${message}' WHERE USERNAME = ${req.params.name}`,
    );
    await db.end();
  };
  insertMessage();
  pusherClient.trigger('chat_channel', 'message', {
    name: req.params.name,
    message: req.body.message,
  });
  res.sendStatus(204);
});
