//Database connection configuration
const { Pool } = require('pg');
require('dotenv').config();
//Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
//Test database connection
pool.connect((err, _client, release) => {
  if (err) {
    console.error( 'Connection failed' );
    console.error( 'Error details', err );
    return;
  }
  console.log('Connection success');
  release();
});

module.exports = pool;
