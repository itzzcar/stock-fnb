# Stock F&B — Gestión de inventario

Aplicación web (React) para la gestión de stock de **Food & Beverage**: control de
niveles de inventario en tiempo real, registro de movimientos de stock y
administración de productos, con autenticación y dos áreas diferenciadas
(usuario y administrador).

El proyecto incluye además una **API REST** propia con autenticación JWT y una
**app móvil** (React Native) que consume la misma API.

## Demo

- **Web (GitHub Pages):** https://itzzcar.github.io/stock-fnb/
- **API (Render):** https://stock-fnb.onrender.com

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@bernabeu.com | admin123 |
| Usuario | user@bernabeu.com | user123 |

## Características

- Rutas con `react-router-dom` y guardas por autenticación y por rol.
- Consumo de API con `fetch` (GET, POST, PUT, PATCH, DELETE).
- Login y registro contra una API con JWT. Área de usuario y área de admin.
- Diseño responsive con Bootstrap adaptado a los anchos: 1920, 990, 767, 510 y 480 px.
- PWA instalable (manifest + service worker).
- App Android con React Native (Expo) sobre la misma API.
- Estructura profesional por responsabilidades (servicios, contexto, hooks, páginas, componentes).

## Framework + librerías y versiones

### Web (`/web`)

| Paquete | Versión | Uso |
|---------|---------|-----|
| react | ^18.3.1 | Librería base |
| react-dom | ^18.3.1 | Render en navegador |
| vite | ^5.3.4 | Bundler y servidor de desarrollo |
| react-router-dom | ^6.25.1 | Rutas y guardas |
| bootstrap | ^5.3.3 | Estilos y rejilla responsive |
| react-bootstrap | ^2.10.4 | Componentes Bootstrap para React |
| @tanstack/react-query | ^5.51.1 | Consumo de API con caché y estados |
| react-hook-form | ^7.52.1 | Formularios y validación |
| recharts | ^2.12.7 | Gráfico de niveles de stock |
| vite-plugin-pwa | ^0.20.1 | Generación de la PWA |
| gh-pages | ^6.1.1 | Despliegue en GitHub Pages |

> No se usa Axios (requisito): el consumo de API se hace con `fetch` nativo
> envuelto en una capa de servicios propia (`src/services`).

### API (`/api`)

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | ^4.19.2 | Servidor HTTP y rutas |
| jsonwebtoken | ^9.0.2 | Generación y verificación de JWT |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| cors | ^2.8.5 | Permitir peticiones desde el front |

## Estructura del proyecto

```
stock-fnb/
├── api/                       # API REST (Express + JWT)
│   ├── server.js
│   └── src/
│       ├── data/store.js      # datos semilla en memoria
│       ├── middleware/auth.js # JWT + control de rol
│       └── routes/            # auth.routes.js, products.routes.js
├── web/                       # Front React (Vite)
│   └── src/
│       ├── services/          # capa de acceso a la API (fetch)
│       ├── context/           # AuthContext (sesión global)
│       ├── hooks/             # useProducts (react-query)
│       ├── router/            # AppRouter + ProtectedRoute
│       ├── components/        # NavBar, Layout, ProductCard
│       ├── pages/             # Landing, Login, Register, user/, admin/
│       └── styles/
└── mobile/                    # App React Native (Expo) — ver fase 2
```

## Guía de instalación

### Requisitos previos
- Node.js 18 o superior y npm.

### 1) API
```bash
cd api
npm install
npm run dev          # arranca en http://localhost:4000
```

### 2) Web
```bash
cd web
npm install
cp .env.example .env # ajusta VITE_API_URL si hace falta
npm run dev          # arranca en http://localhost:5173
```

### 3) Build de producción
```bash
cd web
npm run build        # genera /dist (incluye 404.html para el routing en GitHub Pages)
npm run preview      # previsualiza el build
```

## Despliegue

- **Web:** GitHub Pages. Ajustar `base` en `vite.config.js` al nombre del repo y
  ejecutar `npm run deploy` (usa `gh-pages`).
- **API:** Render (servicio web gratuito). Comando de arranque: `npm start`,
  variable de entorno `JWT_SECRET`.

## Licencia

Distribuido bajo licencia **MIT**. Ver el archivo [LICENSE](./LICENSE).
