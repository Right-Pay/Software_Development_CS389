import { Pool } from 'pg';

// Define your PostgreSQL database configuration options
const dbConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PW,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: 5432, // Default PostgreSQL port
};

// Create and export the PostgreSQL pool
const dbPool = new Pool(dbConfig)

// Set the default schema for the connection
dbPool.on('connect', (client) => {
  client.query('SET search_path TO rightpay, public', (error) => {
    if (error) {
      console.error('Error setting search path:', error);
    }
  });
});

export {dbPool};
