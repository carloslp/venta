require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'undefined');
// Configurando SSL explicitamente para Supabase (a veces es necesario desde producción o dependiendo de la red)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log('Connection successful:', res.rows[0]);
    }
    pool.end();
});
