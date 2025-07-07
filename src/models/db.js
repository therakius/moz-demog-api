import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

// const db = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "moz-demog-api",
  password: "sic parvis magna",
  port: 5432
})


db.connect()
  .then(() => console.log('🟢 Connected to neon successfully'))
  .catch(err => console.error('🔴 Error connecting', err));

  // Global error handling
db.on('error', (err) => {
  console.error('🔴 Pool error:', err.message);
});

// ✅ Keep-alive: prevent Neon from dropping all idle connections
setInterval(() => {
  db.query('SELECT 1').catch(err => {
    console.warn('⚠️ Keep-alive query failed:', err.message);
  });
}, 240_000); // every 4 minutes

export default db;
