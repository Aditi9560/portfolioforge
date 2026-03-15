import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { db } from './db';
import { portfolios } from './schema';
import portfolioRouter from './routes/portfolio';
import uploadRouter    from './routes/upload';

const app = express();
const PORT = process.env.PORT ?? 3001;
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/portfolio', portfolioRouter);
app.use('/api', uploadRouter);

// Ensure table exists on startup
async function ensureSchema() {
  try {
    await db.select().from(portfolios).limit(1);
  } catch {
    // Table doesn't exist yet — drizzle-kit push should be run separately.
    console.warn('[db] portfolios table not found. Run: npm run db:push');
  }
}

app.listen(PORT, async () => {
  await ensureSchema();
  console.log(`Server running on http://localhost:${PORT}`);
});
