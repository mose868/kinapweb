const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');
require('dotenv').config();

// Create a connection pool using the existing MySQL env vars
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'ajira_digital_kinap',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(pool);

module.exports = { db, pool };
