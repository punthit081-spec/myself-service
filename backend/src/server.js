import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { env } from './config/env.js';
import { initDb } from './db/client.js';
import formRoutes from './routes/form.routes.js';

const app = express();

fs.mkdirSync(env.outputDir, { recursive: true });
initDb();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/forms', formRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
});
