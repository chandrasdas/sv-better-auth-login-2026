import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  unique,
} from "drizzle-orm/sqlite-core";

// --- AUTH TABLES ---

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: text("image"),
  role: text("role", { enum: ["admin", "teacher", "staff"] }).default("teacher").notNull(),
  failedOtpAttempts: integer("failed_otp_attempts").default(0).notNull(),
  lockedUntil: integer("locked_until", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => [
  unique("user_email_unique").on(table.email),
]);

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  token: text("token").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  index("session_userId_idx").on(table.userId),
  unique("session_token_unique").on(table.token),
]);

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: 'timestamp' }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("account_userId_idx").on(table.userId),
]);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier),
]);

// --- APPLICATION TABLES ---

export const allowedStaff = sqliteTable("allowed_staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  name: text("name"),
  role: text("role", { enum: ["admin", "teacher", "staff"] }).default("teacher").notNull(),
  isAllowed: integer("is_allowed", { mode: "boolean" }).default(true).notNull(),
});

export const staff = sqliteTable("staff", {
  empId: text("emp_id").primaryKey(),
  name: text("name").notNull(),
  status: text("status", { enum: ["Permanent", "Contractual"] }).notNull(),
  designation: text("designation", { enum: [
    "Headmaster",
    "Assistant Teacher",
    "Librarian",
    "Clerk",
    "Group-D",
  ] }).notNull(),
  email: text("email"),
  phoneNo: text("phone_no"),
  dateOfBirth: integer("date_of_birth", { mode: "timestamp" }),
  dateOfJoining: integer("date_of_joining", { mode: "timestamp" }),
  qualification: text("qualification"),
  primarySubject: text("primary_subject"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => [
  unique("staff_email_unique").on(table.email),
  index("staff_userId_idx").on(table.userId),
]);

export const task = sqliteTable("task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  priority: integer("priority").default(1).notNull(),
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
