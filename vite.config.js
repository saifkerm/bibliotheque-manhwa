import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/bibliotheque-manhwa/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        lang: 'fr',
        name: 'Ma bibliothèque de manhwas',
        short_name: 'Manhwas',
        description: 'Suivi personnel de ma bibliothèque de manhwas',
        start_url: '/bibliotheque-manhwa/',
        scope: '/bibliotheque-manhwa/',
        display: 'standalone',
        background_color: '#0c0a14',
        theme_color: '#1b1030',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
