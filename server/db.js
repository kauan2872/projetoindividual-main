const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'mkjs',
      password: process.env.DB_PASSWORD || 'mkjs',
      database: process.env.DB_NAME || 'mkjsdb',
    });

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        game_name TEXT NOT NULL,
        winner_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.warn('Database not available, running without persistence:', err.message);
  }
}

async function saveMatch(gameName, winnerIndex) {
  await pool.query(
    'INSERT INTO matches (game_name, winner_index) VALUES ($1, $2)',
    [gameName, winnerIndex]
  );
}

async function getMatches() {
  const result = await pool.query('SELECT * FROM matches ORDER BY created_at DESC');
  return result.rows;
}

module.exports = { initDB, saveMatch, getMatches, pool };
