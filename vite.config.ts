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
      // Optimize chunk splitting for better loading
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries into separate chunks
            'vendor-motion': ['motion'],
            'vendor-charts': ['recharts'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
      // Reduce chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production (optional, can be disabled for smaller builds)
      sourcemap: false,
      // Minify CSS
      cssCodeSplit: true,
      // Target modern browsers for smaller output
      target: 'es2015',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  };
});
