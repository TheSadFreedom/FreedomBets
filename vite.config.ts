import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { eventsManifestPlugin } from './vite-plugins/eventsManifest';
import { teamsManifestPlugin } from './vite-plugins/teamsManifest';

export default defineConfig({
  plugins: [react(), eventsManifestPlugin(), teamsManifestPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: true,
    port: Number(process.env.CLOUDPUB_PORT ?? 8080),
    strictPort: true,
    // CloudPub assigns a new *.cloudpub.ru subdomain each session
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
