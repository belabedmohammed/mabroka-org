import { defineConfig } from 'vite';

const base = process.env.GITHUB_ACTIONS ? '/mabroka-org/' : './';

export default defineConfig({
  root: '.',
  base,
  build: {
    outDir: 'dist',
  },
});
