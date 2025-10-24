import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@admiral': path.resolve(__dirname, './src/admiral'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@providers': path.resolve(__dirname, './src/providers'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // Handle environment variables
  define: {
    'process.env': {},
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Handling chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
});
