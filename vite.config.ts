import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React core - must be checked first to avoid circular deps
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'vendor-react';
              }
              // Animation
              if (id.includes('/motion/') || id.includes('/framer-motion/') || id.includes('/popmotion/')) {
                return 'vendor-motion';
              }
              // Charts
              if (id.includes('/recharts/') || id.includes('/d3-')) {
                return 'vendor-charts';
              }
              // Icons
              if (id.includes('/lucide-react/')) {
                return 'vendor-icons';
              }
              // PDF generation
              if (id.includes('/jspdf/') || id.includes('/html2canvas/')) {
                return 'vendor-pdf';
              }
              // Firebase
              if (id.includes('/firebase/') || id.includes('/@firebase/')) {
                return 'vendor-firebase';
              }
              // Database
              if (id.includes('/mongodb/') || id.includes('/bson/')) {
                return 'vendor-db';
              }
              // State management and utilities
              if (id.includes('/zustand/') || id.includes('/@tanstack/') || id.includes('/lottie-react/')) {
                return 'vendor-utils';
              }
              // Everything else from node_modules
              return 'vendor-misc';
            }
          },
        },
      },
      chunkSizeWarningLimit: 700,
      sourcemap: false,
      cssCodeSplit: true,
      target: 'es2015',
      minify: 'esbuild',
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      exclude: ['node_modules', 'e2e/**'],
    },
  };
});
