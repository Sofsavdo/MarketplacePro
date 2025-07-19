import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { cartographer } from '@replit/vite-plugin-cartographer';
// import { runtimeErrorModal } from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [
    react(),
    // cartographer(),
    // runtimeErrorModal(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@assets': path.resolve(__dirname, '../attached_assets'),
    },
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
