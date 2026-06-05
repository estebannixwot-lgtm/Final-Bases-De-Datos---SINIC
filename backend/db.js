const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'catastro_sinic',
  password: 'admin',
  port: 5433,
});

module.exports = pool;
