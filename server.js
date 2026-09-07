import 'dotenv/config';
import express from 'express';
import { initDb, pool } from './db.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/tasks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks');
  res.json(rows);
});

app.get('/tasks/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(rows[0]);
});

app.post('/tasks', async (req, res) => {
  const { title, done = false } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const { rows } = await pool.query(
    'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
    [title, done]
  );
  res.status(201).json(rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
  const { title, done } = req.body;
  const { rows } = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [title, done, req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

async function start() {
  await initDb();
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
