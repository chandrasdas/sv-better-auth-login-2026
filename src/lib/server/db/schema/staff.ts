import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { user, ROLES } from "./auth";

// --- APPLICATION TABLES ---

export const allowedStaff = sqliteTable("allowed_staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  name: text("name"),
  role: text("role", { enum: ROLES }).default("teacher").notNull(),
  isAllowed: integer("is_allowed", { mode: "boolean" }).default(true).notNull(),
});

export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  empId: text("emp_id").unique().notNull(), // Business ID
  name: text("name").notNull(),
  status: text("status", { enum: ["Permanent", "Contractual"] }).notNull(),
  designation: text("designation", { enum: [
    "Headmaster",
    "Assistant Teacher",
    "Librarian",
    "Clerk",
    "Group-D",
  ] }).notNull(),
  email: text("email").unique(),
  phoneNo: text("phone_no"),
  dateOfBirth: integer("date_of_birth", { mode: "timestamp" }),
  dateOfJoining: integer("date_of_joining", { mode: "timestamp" }),
  qualification: text("qualification"),
  primarySubject: text("primary_subject"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});
