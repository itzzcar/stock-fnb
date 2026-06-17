// Almacén en memoria con datos semilla.
// Se reinicia al reiniciar el servidor: suficiente para una demo y fácil de defender.
// Para persistencia real se cambiaría por SQLite/lowdb sin tocar las rutas.
const bcrypt = require('bcryptjs');

// Contraseñas hasheadas al arrancar (nunca se guardan en texto plano).
const hash = (pwd) => bcrypt.hashSync(pwd, 8);

const users = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@bernabeu.com',
    password: hash('admin123'),
    role: 'admin',
  },
  {
    id: 2,
    name: 'Usuario Barra',
    email: 'user@bernabeu.com',
    password: hash('user123'),
    role: 'user',
  },
];

// Stock de F&B del estadio (ejemplo realista).
const products = [
  { id: 1, name: 'Cerveza 50cl', category: 'Bebidas', stock: 480, min: 100, max: 600, price: 5.5 },
  { id: 2, name: 'Refresco Cola', category: 'Bebidas', stock: 320, min: 80, max: 500, price: 4.0 },
  { id: 3, name: 'Agua 50cl', category: 'Bebidas', stock: 90, min: 120, max: 700, price: 3.0 },
  { id: 4, name: 'Perrito Caliente', category: 'Comida', stock: 210, min: 60, max: 400, price: 6.5 },
  { id: 5, name: 'Nachos con queso', category: 'Comida', stock: 145, min: 50, max: 300, price: 7.0 },
  { id: 6, name: 'Palomitas', category: 'Snacks', stock: 60, min: 40, max: 250, price: 4.5 },
];

// Generador simple de IDs incrementales.
const nextId = (collection) =>
  collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;

module.exports = { users, products, nextId };
