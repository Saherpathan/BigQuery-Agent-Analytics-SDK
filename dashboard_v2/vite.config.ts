import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { getDashboardRuntimeStatus, handleAgentDataRequest } from './api/agentData';

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage & { method?: string }, res: ServerResponse, next) => {
        const url = req.url ? new URL(req.url, 'http://localhost') : null;
        if (!url || !url.pathname.startsWith('/api')) {
          next();
          return;
        }

        if (url.pathname === '/api/health') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(getDashboardRuntimeStatus()));
          return;
        }

        const result = await handleAgentDataRequest({
          method: req.method,
          headers: req.headers as Record<string, string | string[] | undefined>,
          query: Object.fromEntries(url.searchParams.entries()),
        });

        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (result.status === 405) {
          res.setHeader('Allow', 'GET');
        }
        res.end(JSON.stringify(result.body));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
    base: './', // CRITICAL for Vercel deployment
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Change this to point to 'src' for cleaner imports
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true, // Cleans the old build before making a new one
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
