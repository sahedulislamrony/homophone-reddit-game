import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@client': path.resolve(__dirname, '../../src/client'),
      '@server': path.resolve(__dirname, '../../src/server'),
      '@shared': path.resolve(__dirname, '../../src/shared'),
    },
  },
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        sourcemapFileNames: '[name].js.map',
      },
    },
  },
});
