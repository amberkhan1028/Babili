module.exports = (app, db) => {
  // get all users
  app.get('/api/users', async (req, res) => {
    const findAll = 'SELECT * FROM Users';
    const { rows, rowCount } = await db.query(findAll);
    if (rows) res.status(200).send(rows);
  });

  // get a specific user
  app.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const findOne = 'SELECT * FROM Users WHERE userId = $1';
    const { rows, rowCount } = await db.query(findOne, [id]);
    if (rows) res.status(200).send(rows[0]);
  });

  // update a specific user's profile info
  app.patch('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {
      country,
      language,
      aboutme,
    } = req.body;
    // update query
    const updateQuery = 'UPDATE users SET country = $1, language = $2, aboutme = $3 WHERE userId = $4';
    // find user
    const findOne = 'SELECT * FROM Users WHERE userId = $1';
    const { rows, rowCount } = await db.query(findOne, [id]);
    if (rows) {
      const user = rows[0];
      // update user
      const results = await db.query(updateQuery, [country || user.country,
        language || user.language, aboutme || user.aboutme, id]);
      if (results) res.status(200).send(`user modified with ID: ${id}`);
    } else {
      res.status(404).send({ message: 'user with given not found' });
    }
  });
};
