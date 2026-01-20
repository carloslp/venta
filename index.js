const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3000;

console.log('Environment check:');
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
} else {
  console.error('CRITICAL: DATABASE_URL is missing!');
}

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo API REST con Node.js!' });
});

app.get('/cartera', async (req, res) => {
  try {
    const carteras = await prisma.cartera.findMany();
    res.json(carteras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
