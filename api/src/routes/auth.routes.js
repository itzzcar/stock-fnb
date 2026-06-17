const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, nextId } = require('../data/store');
const { authRequired, SECRET } = require('../middleware/auth');

const router = express.Router();

// Genera el token con los datos públicos del usuario (nunca la contraseña).
function makeToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    SECRET,
    { expiresIn: '8h' }
  );
}

// Devuelve el usuario sin el campo password.
const publicUser = ({ password, ...rest }) => rest;

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password || '', user.password)) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
  res.json({ token: makeToken(user), user: publicUser(user) });
});

// POST /api/auth/register  (crea siempre usuarios con rol 'user')
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'Ese email ya está registrado' });
  }
  const user = {
    id: nextId(users),
    name,
    email,
    password: bcrypt.hashSync(password, 8),
    role: 'user',
  };
  users.push(user);
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

// GET /api/auth/me  (devuelve el usuario actual a partir del token)
router.get('/me', authRequired, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(publicUser(user));
});

module.exports = router;
