import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const dbUrl = process.env.NODE_ENV === 'production'
  ? 'file:/opt/render/project/src/server/portfolioforge.db'
  : 'file:./portfolioforge.db';

const client = createClient({ url: dbUrl });
export const db = drizzle(client);
