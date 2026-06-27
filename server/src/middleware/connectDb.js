// File: server/src/middleware/connectDb.js
// Purpose: connectDb script
// Role: middleware that ensures MongoDB is connected for each request

import { connectDb } from '../db.js';

export default async function (_req, res, next) {
  try {
    // The connector caches a successful connection, so later requests reuse it.
    await connectDb();
    next();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    res.status(500).json({ error: 'database_unavailable' });
  }
}
