import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// IMPORTANTE: 'base' debe coincidir con el nombre del repositorio en GitHub Pages.
// Si el repo es https://github.com/usuario/stock-fnb -> base: '/stock-fnb/'
export default defineConfig({
  base: '/stock-fnb/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Stock F&B Bernabéu',
        short_name: 'Stock F&B',
        description: 'Gestión de stock de Food & Beverage',
        theme_color: '#0a1f44',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/stock-fnb/',
        scope: '/stock-fnb/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
