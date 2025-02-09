import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/debtomate/',
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
    server: {
      deps: {
        inline: ['moneyfunx'],
      },
    },
    environment: 'jsdom',
    exclude: ['build', 'node_modules'],
    root: '.',
  },
});
