

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/timetracker/',
  integrations: [react(), tailwind()],
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
        manifest: {
          name: 'TimeTracker Progressive Web App',
          short_name: 'PWA TimeTracker',
          description: 'TimeTracker progressive web app',
          theme_color: '#9333ea',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/timetracker/',
          icons: [
            {
              src: '/timetracker/pwa-icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/timetracker/pwa-icon-512Asset 2.png',
              sizes: '512x512',
              type: 'image/png',
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          cleanupOutdatedCaches: true,
          sourcemap: true
        }
      })
    ]
  }
});
