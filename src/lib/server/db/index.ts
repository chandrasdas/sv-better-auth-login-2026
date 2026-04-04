import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const client = mysql.createPool({
	host: 'localhost',
	user: 'rkmvvmm1_tuser',
	password: 'Test_2026',
	database: 'rkmvvmm1_test2026',
	port: env.DB_PORT ? Number(env.DB_PORT) : 3306
});

export const db = drizzle(client, { schema, mode: 'default' });
