// File: server/src/index.js
// Purpose: index script
// Role: server startup and MongoDB bootstrap

import app from './app.js';
import { connectDb } from './db.js';

const PORT = Number(process.env.PORT) || 3001;

// Kick off the MongoDB connection eagerly so the first real request is fast.
// The connectDbMiddleware in app.js awaits this cached promise on every request.
// We do NOT block server startup on this — the middleware handles reconnects.
connectDb().catch(err => {
  console.error('[startup] initial MongoDB connection failed (will retry on demand):', err.message);
});

const httpServer = app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});

httpServer.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[server] Port ${PORT} already in use — existing server will handle requests.`);
    process.exit(0);
  } else {
    console.error('[server] Fatal startup error:', err.message);
    process.exit(1);
  }
});
