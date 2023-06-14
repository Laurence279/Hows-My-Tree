const pg = require('pg');
function createPool() {
  return new pg.Pool({
    port: 5432,
    host: process.env.DBHOST,
    database: process.env.DATABASE,
    user: process.env.DBUSER,
    password: process.env.PASSWORd,
    ssl: {
        rejectUnauthorized: false,
    }
  })
}
function query(pool, text, params) {
    return pool.query(text, params);
  }
  
  async function close(pool) {
    return await pool.end();
  }
  
  module.exports = { createPool, query, close };