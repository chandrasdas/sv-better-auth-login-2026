import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, varchar, text, unique, int, mysqlEnum, date } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const account = mysqlTable("account", {
	id: varchar({ length: 36 }).notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token").default('NULL'),
	refreshToken: text("refresh_token").default('NULL'),
	idToken: text("id_token").default('NULL'),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3, mode: 'string' }).default('''0000-00-00 00:00:00.000''').notNull(),
	scope: text().default('NULL'),
	password: text().default('NULL'),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
},
(table) => [
	index("account_userId_idx").on(table.userId),
]);

export const allowedStaff = mysqlTable("allowed_staff", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).default('NULL'),
	role: mysqlEnum(['admin','teacher','staff']).default('\'teacher\'').notNull(),
	isAllowed: tinyint("is_allowed").default(1).notNull(),
},
(table) => [
	unique("allowed_staff_email_unique").on(table.email),
]);

export const session = mysqlTable("session", {
	id: varchar({ length: 36 }).notNull(),
	expiresAt: timestamp("expires_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	ipAddress: text("ip_address").default('NULL'),
	userAgent: text("user_agent").default('NULL'),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	index("session_userId_idx").on(table.userId),
	unique("session_token_unique").on(table.token),
]);

export const staff = mysqlTable("staff", {
	empId: varchar("emp_id", { length: 8 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	status: mysqlEnum(['Permanent','Contractual']).notNull(),
	designation: mysqlEnum(['Headmaster','Assistant Teacher','Librarian','Clerk','Group-D']).notNull(),
	email: varchar({ length: 255 }).default('NULL'),
	phoneNo: varchar("phone_no", { length: 15 }).default('NULL'),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateOfBirth: date("date_of_birth", { mode: 'string' }).default('NULL'),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateOfJoining: date("date_of_joining", { mode: 'string' }).default('NULL'),
	qualification: varchar({ length: 255 }).default('NULL'),
	primarySubject: varchar("primary_subject", { length: 100 }).default('NULL'),
	userId: varchar("user_id", { length: 36 }).default('NULL').references(() => user.id, { onDelete: "set null" } ),
	isActive: tinyint("is_active").default(1).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
},
(table) => [
	index("staff_userId_idx").on(table.userId),
	unique("staff_email_unique").on(table.email),
]);

export const task = mysqlTable("task", {
	id: int().autoincrement().notNull(),
	title: text().notNull(),
	priority: int().default(1).notNull(),
});

export const user = mysqlTable("user", {
	id: varchar({ length: 36 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: tinyint("email_verified").default(0).notNull(),
	image: text().default('NULL'),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
},
(table) => [
	unique("user_email_unique").on(table.email),
]);

export const verification = mysqlTable("verification", {
	id: varchar({ length: 36 }).notNull(),
	identifier: varchar({ length: 255 }).notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default('current_timestamp(3)').notNull(),
},
(table) => [
	index("verification_identifier_idx").on(table.identifier),
]);
