import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: '/',
  plugins: [tailwindcss()],
  server: {
    port: 5500,
  },
  build: {
    outDir: 'dist',
  },
});
