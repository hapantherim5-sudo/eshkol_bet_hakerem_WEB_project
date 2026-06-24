import app from './app.js';
import { connectDb } from './db.js';

const PORT = Number(process.env.PORT) || 3001;

// Connect to MongoDB once before accepting any requests.
// This prevents the race condition where concurrent early requests each
// attempt their own MongoClient connection.
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('[startup] failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
