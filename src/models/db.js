import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 60000,
});

// const db = new pg.Pool({
//   user: process.env.DB_USER,
//   host:  process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT
// })


db.connect()
  .then((client) => {
    console.log('🟢 Connected to neon successfully');
    client.release();
  })
  .catch(err => console.error('🔴 Error connecting', err.message));

db.on('error', (err) => {
  console.error('🔴 Pool error:', err.message);
});

setInterval(() => {
  db.query('SELECT 1').catch(err => {
    console.warn('⚠️ Keep-alive query failed:', err.message);
  });
}, 240_000);

export default db;