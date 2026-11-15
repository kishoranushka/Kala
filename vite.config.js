import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import devApi from './scripts/dev-api.mjs';

export default defineConfig({
  /* devApi (dev server only, never built) runs the /api functions locally */
  plugins: [react(), tailwindcss(), devApi()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    /* the site, and the admin panel (admin.html → /admin, source in src/admin/) */
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
});
