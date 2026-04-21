import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const client = createClient({
	url: env.DATABASE_URL || 'file:sqlite.db',
	authToken: env.DATABASE_AUTH_TOKEN
});

// Enable WAL mode and Foreign Keys for local libSQL/SQLite
await client.execute('PRAGMA journal_mode = WAL;');
await client.execute('PRAGMA foreign_keys = ON;');

export const db = drizzle(client, { schema });
