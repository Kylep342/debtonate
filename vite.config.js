import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/debtonate/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.ts', '.json'], // Ensure file extensions are resolved
  },
  test: {
    deps: {
      inline: ['moneyfunx'], // Ensure moneyfunx is processed correctly
    },
    exclude: ['node_modules'],
  },
});
