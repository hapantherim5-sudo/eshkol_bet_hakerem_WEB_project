import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'auto-express',
      // Automatically start the Express API server alongside the Vite dev server.
      // Uses the same node binary as Vite to avoid PATH resolution issues on Windows.
      configureServer(server) {
        const serverEntry = path.resolve(__dirname, 'server', 'src', 'index.js')
        const proc = spawn(process.execPath, [serverEntry], {
          stdio: 'inherit',
          env: process.env,
        })
        proc.on('error', err =>
          console.warn('[vite] Express auto-start failed:', err.message)
        )
        const stop = () => { try { proc.kill() } catch (_) {} }
        server.httpServer?.once('close', stop)
        process.once('exit', stop)
      },
    },
  ],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
