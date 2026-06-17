const express = require('express');
const { products, nextId } = require('../data/store');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de productos requieren estar autenticado.
router.use(authRequired);

// GET /api/products  -> lista (cualquier usuario logueado)
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

// PATCH /api/products/:id/stock  -> registrar movimiento de stock (user y admin)
// body: { delta: number }  (positivo = entrada, negativo = salida)
router.patch('/:id/stock', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const delta = Number(req.body.delta);
  if (Number.isNaN(delta)) {
    return res.status(400).json({ message: 'delta debe ser un número' });
  }
  product.stock = Math.max(0, product.stock + delta);
  res.json(product);
});

// --- A partir de aquí, solo administradores ---

// POST /api/products  -> crear producto
router.post('/', adminRequired, (req, res) => {
  const { name, category, stock, min, max, price } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'name y category son obligatorios' });
  }
  const product = {
    id: nextId(products),
    name,
    category,
    stock: Number(stock) || 0,
    min: Number(min) || 0,
    max: Number(max) || 0,
    price: Number(price) || 0,
  };
  products.push(product);
  res.status(201).json(product);
});

// PUT /api/products/:id  -> reemplazar producto completo
router.put('/:id', adminRequired, (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  const { name, category, stock, min, max, price } = req.body;
  products[index] = {
    id: products[index].id,
    name,
    category,
    stock: Number(stock) || 0,
    min: Number(min) || 0,
    max: Number(max) || 0,
    price: Number(price) || 0,
  };
  res.json(products[index]);
});

// DELETE /api/products/:id
router.delete('/:id', adminRequired, (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });
  const [removed] = products.splice(index, 1);
  res.json(removed);
});

module.exports = router;
