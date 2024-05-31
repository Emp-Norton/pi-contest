const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const app = express();

app.use(express.json());

app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating todo' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const result = await pool.query('UPDATE todos SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.send({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting todo' });
  }
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
