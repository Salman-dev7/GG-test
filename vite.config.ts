import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Matches your repository name 'GG-test'
  base: '/GG-test/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
