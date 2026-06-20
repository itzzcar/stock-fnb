// Capa de servicios de la app móvil.
// Consume la MISMA API que la web (desplegada en Render), con fetch nativo.
// No usamos axios, igual que en la web (requisito del proyecto).

const BASE_URL = 'https://stock-fnb.onrender.com';

// POST /api/auth/login -> { token, user }
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}

// GET /api/products -> lista de productos (requiere token)
export async function getProducts(token) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error al cargar el stock');
  return data;
}

// PATCH /api/products/:id/stock -> ajusta el stock (delta +/-). Devuelve el producto actualizado.
export async function adjustStock(token, id, delta) {
  const res = await fetch(`${BASE_URL}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delta }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error al ajustar el stock');
  return data;
}
