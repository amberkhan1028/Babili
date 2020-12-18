const express = require('express');
// const pg = require('pg');
// const sequelize = require('sequelize');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.warn(`listening on ${PORT}`);
});
