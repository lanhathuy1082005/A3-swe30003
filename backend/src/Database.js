import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'swe30003_db',
  password: 'lanhathuy2005',
  port: 5432,
  max: 10, // max connections in the pool
});

// Use the pool elsewhere
export default pool;
