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
    extensions: ['.js', '.ts', '.json'],
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src'],
    },
    deps: {
      inline: ['moneyfunx'],
    },
    environment: 'jsdom',
    exclude: ['build', 'node_modules'],
    root: '.',
  },
});
