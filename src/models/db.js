import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const db = new pg.Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

db.connect();

export default db;
