import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In dev mode, serve static files (reset.css, word list json) from the docs folder
  publicDir: command === 'serve' ? '../docs' : false,
  server: {
    open: '/index-react.html',
  },
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    rollupOptions: {
      input: 'index-react.html',
      output: {
        entryFileNames: 'build/bundle-react.js',
        chunkFileNames: 'build/bundle-react-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'build/bundle-react.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));
