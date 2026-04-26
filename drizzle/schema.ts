import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const account = sqliteTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at"),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	token: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	uniqueIndex("session_token_unique").on(table.token),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer("email_verified").default(false).notNull(),
	image: text(),
	role: text().default("teacher").notNull(),
	failedOtpAttempts: integer("failed_otp_attempts").default(0).notNull(),
	lockedUntil: integer("locked_until"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

export const verification = sqliteTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const allowedStaff = sqliteTable("allowed_staff", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	email: text().notNull(),
	name: text(),
	role: text().default("teacher").notNull(),
	isAllowed: integer("is_allowed").default(true).notNull(),
},
(table) => [
	uniqueIndex("allowed_staff_email_unique").on(table.email),
]);

export const staff = sqliteTable("staff", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	empId: text("emp_id").notNull(),
	name: text().notNull(),
	status: text().notNull(),
	designation: text().notNull(),
	email: text(),
	phoneNo: text("phone_no"),
	dateOfBirth: integer("date_of_birth"),
	dateOfJoining: integer("date_of_joining"),
	qualification: text(),
	primarySubject: text("primary_subject"),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" } ),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("staff_email_unique").on(table.email),
	uniqueIndex("staff_emp_id_unique").on(table.empId),
]);

export const studClasses = sqliteTable("stud_classes", {
	id: integer().primaryKey().notNull(),
	name: text({ length: 20 }).notNull(),
});

export const studExamTerms = sqliteTable("stud_exam_terms", {
	id: integer().primaryKey().notNull(),
	name: text({ length: 20 }).notNull(),
});

export const studInfo = sqliteTable("stud_info", {
	sid: integer().primaryKey().notNull(),
	portalId: text("portal_id", { length: 14 }).notNull(),
	name: text({ length: 100 }).notNull(),
	fname: text({ length: 100 }).notNull(),
	dob: text().notNull(),
	transferDate: text("transfer_date"),
	messageNo: integer("message_no").notNull(),
	guardianNo: integer("guardian_no").notNull(),
	penNo: integer("pen_no"),
	caste: text().notNull(),
	createdAt: integer("created_at").default(sql`(unixepoch())`),
},
(table) => [
	index("idx_student_search_name").on(table.name),
	uniqueIndex("stud_info_pen_no_unique").on(table.penNo),
	uniqueIndex("stud_info_portal_id_unique").on(table.portalId),
]);

export const studMarksEntries = sqliteTable("stud_marks_entries", {
	mid: integer().primaryKey({ autoIncrement: true }).notNull(),
	sessionEnrollId: integer("session_enroll_id").notNull().references(() => studSessionEnrollments.seid),
	examSetupId: integer("exam_setup_id").notNull().references(() => studExamSetups.setupId),
	marksObtained: integer("marks_obtained").default(0).notNull(),
	isPresent: integer("is_present").default(true).notNull(),
	createdAt: integer("created_at").default(sql`(unixepoch())`),
	updatedAt: integer("updated_at").default(sql`(unixepoch())`),
},
(table) => [
	uniqueIndex("uq_marks_student_setup").on(table.sessionEnrollId, table.examSetupId),
	index("idx_marks_setup").on(table.examSetupId),
]);

export const studSections = sqliteTable("stud_sections", {
	id: integer().primaryKey().notNull(),
	classId: integer("class_id").notNull().references(() => studClasses.id),
	letter: text({ length: 1 }).notNull(),
	fullName: text("full_name", { length: 30 }).notNull(),
	medium: text({ length: 15 }).default("Bengali").notNull(),
});

export const studSessionEnrollments = sqliteTable("stud_session_enrollments", {
	seid: integer().primaryKey({ autoIncrement: true }).notNull(),
	studentId: integer("student_id").notNull().references(() => studInfo.sid),
	sessionId: integer("session_id").notNull().references(() => studSessions.id),
	sectionId: integer("section_id").notNull().references(() => studSections.id),
	rollNo: integer("roll_no").notNull(),
},
(table) => [
	uniqueIndex("uq_class_roll").on(table.sessionId, table.sectionId, table.rollNo),
	uniqueIndex("uq_student_session").on(table.studentId, table.sessionId),
]);

export const studSessions = sqliteTable("stud_sessions", {
	id: integer().primaryKey().notNull(),
	year: integer().notNull(),
	name: text({ length: 9 }).notNull(),
});

export const studSubjects = sqliteTable("stud_subjects", {
	id: integer().primaryKey().notNull(),
	name: text({ length: 20 }).notNull(),
	code: text({ length: 4 }).notNull(),
},
(table) => [
	uniqueIndex("stud_subjects_code_unique").on(table.code),
	uniqueIndex("stud_subjects_name_unique").on(table.name),
]);

export const studExamSetups = sqliteTable("stud_exam_setups", {
	setupId: integer("setup_id").primaryKey({ autoIncrement: true }).notNull(),
	classId: integer("class_id").notNull().references(() => studClasses.id),
	sessionId: integer("session_id").notNull().references(() => studSessions.id),
	examTermId: integer("exam_term_id").notNull().references(() => studExamTerms.id),
	subjectId: integer("subject_id").notNull().references(() => studSubjects.id),
	fullMark: integer("full_mark").notNull(),
	passMark: integer("pass_mark").default(0).notNull(),
	sortIndex: integer("sort_index").default(0).notNull(),
	includeInTotal: integer("include_in_total").default(true).notNull(),
},
(table) => [
	uniqueIndex("uq_exam_config").on(table.sessionId, table.classId, table.examTermId, table.subjectId),
]);

