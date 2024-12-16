import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          store: ['zustand'],
          utils: ['date-fns']
        },
      },
    },
    sourcemap: true,
    minify: 'terser'
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      timeout: 5000
    }
  },
  preview: {
    port: 3000,
    strictPort: true
  }
});