import express from 'express';
import cors from 'cors';
import connectDbMiddleware from './middleware/connectDb.js';
import healthRouter from './routes/health.js';
import organizationsRouter from './routes/organizations.js';
import authRouter from './routes/auth.js';
import bootstrapRouter from './routes/bootstrap.js';
import opportunitiesRouter from './routes/opportunities.js';
import eventsRouter from './routes/events.js';
import viewsRouter from './routes/views.js';
import registrationsRouter from './routes/registrations.js';
import profilesRouter from './routes/profiles.js';
import usersRouter from './routes/users.js';
import statsRouter from './routes/stats.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(connectDbMiddleware);
app.use('/api', healthRouter);
app.use('/api', organizationsRouter);
app.use('/api', authRouter);
app.use('/api', bootstrapRouter);
app.use('/api', opportunitiesRouter);
app.use('/api', eventsRouter);
app.use('/api', viewsRouter);
app.use('/api', registrationsRouter);
app.use('/api', profilesRouter);
app.use('/api', usersRouter);
app.use('/api', statsRouter);

// Global error handler — 4-argument signature is required by Express.
// Catches any error forwarded via next(err) from route handlers and ensures
// every request always receives a response instead of hanging.
app.use((err, req, res, next) => {
  console.error(
    '[server] unhandled error  method=%s  path=%s  error=%s',
    req.method, req.path, err.message,
  );
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: 'server_error' });
});

export default app;
