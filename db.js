import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM tasks');
  if (parseInt(rows[0].count, 10) === 0) {
    await pool.query(
      `INSERT INTO tasks (title, done) VALUES
        ('Learn Docker', false),
        ('Connect Postgres', false),
        ('Ship the API', false)`
    );
    console.log('Seeded 3 example tasks');
  }
}
