import { mysqlTable, int, text } from 'drizzle-orm/mysql-core';

export const task = mysqlTable('task', {
	id: int('id').autoincrement().primaryKey(),
	title: text('title').notNull(),
	priority: int('priority').notNull().default(1)
});

export * from './auth.schema';
