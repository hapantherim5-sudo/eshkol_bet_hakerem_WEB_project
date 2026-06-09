import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
