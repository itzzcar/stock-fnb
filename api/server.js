const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/products.routes');

const app = express();

app.use(cors()); // permite peticiones desde el dominio del front
app.use(express.json());

// Comprobación rápida de que la API está viva.
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Stock F&B API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
