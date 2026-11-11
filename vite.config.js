import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import worksAdmin from './scripts/admin/plugin.mjs';
import devApi from './scripts/dev-api.mjs';

export default defineConfig({
  /* dev server only (never built): worksAdmin = painting editor at /__admin; devApi = runs /api functions locally */
  plugins: [react(), tailwindcss(), worksAdmin(), devApi()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
