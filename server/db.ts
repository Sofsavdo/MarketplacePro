import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema.js';

const sql = neon(process.env.DATABASE_URL || 'postgresql://localhost:5432/uzbek_marketplace');
export const db = drizzle(sql, { schema });

export default db;