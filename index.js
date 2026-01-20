const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Patch para serializar BigInt en JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const port = 3000;

app.use(express.json());

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

app.post('/cartera', async (req, res) => {
  const { nombre, deuda } = req.body;
  try {
    const nuevaCartera = await prisma.cartera.create({
      data: {
        nombre,
        deuda: deuda ? BigInt(deuda) : null,
      },
    });
    res.status(201).json(nuevaCartera);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

app.put('/cartera/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, deuda } = req.body;
  try {
    const carteraActualizada = await prisma.cartera.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        deuda: deuda !== undefined ? BigInt(deuda) : undefined,
      },
    });
    res.json(carteraActualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
