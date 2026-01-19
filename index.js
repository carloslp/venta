const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo API REST con Node.js!' });
});

app.get('/cartera', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, deuda FROM cartera');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
