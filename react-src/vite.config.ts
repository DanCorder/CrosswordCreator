import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In dev mode, serve static files (reset.css, word list json) from the docs folder
  publicDir: command === 'serve' ? '../docs' : false,
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'build/bundle.js',
        chunkFileNames: 'build/bundle-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'build/bundle.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));
