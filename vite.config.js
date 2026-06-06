import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: process.env.PAGES_BASE || './',
  build: {
    outDir: 'dist',
  },
});
