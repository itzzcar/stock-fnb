const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clave-secreta-demo-cambiar-en-produccion';

// Comprueba que llega un token válido en la cabecera Authorization: Bearer <token>.
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  try {
    req.user = jwt.verify(token, SECRET); // { id, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o caducado' });
  }
}

// Solo permite continuar si el usuario tiene rol admin.
function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  next();
}

module.exports = { authRequired, adminRequired, SECRET };
