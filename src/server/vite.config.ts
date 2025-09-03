import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import path from 'path';

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@client': path.resolve(__dirname, '../../src/client'),
      '@server': path.resolve(__dirname, '../../src/server'),
      '@shared': path.resolve(__dirname, '../../src/shared'),
    },
  },
  build: {
    emptyOutDir: false,
    ssr: 'index.ts',
    outDir: '../../dist/server',
    target: 'node22',
    sourcemap: true,
    rollupOptions: {
      external: [...builtinModules],

      output: {
        format: 'cjs',
        entryFileNames: 'index.cjs',
        inlineDynamicImports: true,
      },
    },
  },
});
