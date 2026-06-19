import { connectDb } from '../database/db.js';

export default async function (_req, res, next) {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    res.status(500).json({ error: 'database_unavailable' });
  }
}
