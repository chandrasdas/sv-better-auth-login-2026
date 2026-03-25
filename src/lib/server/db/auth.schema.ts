import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  mysqlEnum,
  date,
  int,
  unique,
} from "drizzle-orm/mysql-core";

// --- AUTH TABLES ---

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => [
  unique("user_email_unique").on(table.email),
]);

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3, mode: 'date' }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  index("session_userId_idx").on(table.userId),
  unique("session_token_unique").on(table.token),
]);

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3, mode: 'date' }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3, mode: 'date' }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => [
  index("account_userId_idx").on(table.userId),
]);

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3, mode: 'date' }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier),
]);

// --- APPLICATION TABLES ---

export const staff = mysqlTable("staff", {
  empId: varchar("emp_id", { length: 8 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["Permanent", "Contractual"]).notNull(),
  designation: mysqlEnum("designation", [
    "Headmaster",
    "Assistant Teacher",
    "Librarian",
    "Clerk",
    "Group-D",
  ]).notNull(),
  email: varchar("email", { length: 255 }),
  phoneNo: varchar("phone_no", { length: 15 }),
  dateOfBirth: date("date_of_birth", { mode: "date" }),
  dateOfJoining: date("date_of_joining", { mode: "date" }),
  qualification: varchar("qualification", { length: 255 }),
  primarySubject: varchar("primary_subject", { length: 100 }),
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => [
  unique("staff_email_unique").on(table.email),
  index("staff_userId_idx").on(table.userId),
]);

export const task = mysqlTable("task", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  priority: int("priority").default(1).notNull(),
});

// --- RELATIONS ---

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  staff: one(staff, {
    fields: [user.id],
    references: [staff.userId],
  }),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(user, {
    fields: [staff.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
