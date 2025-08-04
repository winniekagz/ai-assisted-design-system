import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        // SVGR options
        icon: true,
        svgo: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'next/dist/client/components/is-next-router-error': path.resolve(
        __dirname,
        '../src/lib/empty-module.js'
      ),
    },
  },
  define: {
    global: 'globalThis',
  },
});
