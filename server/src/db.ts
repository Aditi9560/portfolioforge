import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({ url: 'file:./portfolioforge.db' });
export const db = drizzle(client);
