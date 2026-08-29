import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5174,
    strictPort: true
  },
  preview: {
    port: 5174,
    strictPort: true
  }
});
