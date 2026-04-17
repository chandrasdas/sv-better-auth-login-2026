import { sqliteTable, text, integer, unique, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Classes ---
export const classes = sqliteTable('classes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull(),
});

// --- Exam Terms ---
export const examTerms = sqliteTable('exam_terms', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull(),
});

// --- Sessions ---
export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey(),
  year: integer('year').notNull(),
  name: text('name', { length: 9 }).notNull(),
});

// --- Students ---
export const students = sqliteTable('students', {
  sid: integer('sid').primaryKey(),
  portalId: integer('portal_id').notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  fname: text('fname', { length: 100 }).notNull(),
  dob: text('dob').notNull(), 
  // Removed is_transfered: transfer_date now handles status logic.
  // NULL = Active, NOT NULL = Transferred
  transferDate: text('transfer_date'), 
  messageNo: integer('message_no').notNull(),
  guardianNo: integer('guardian_no').notNull(),
  penNo: integer('pen_no').unique(),
  caste: text('caste').notNull(), 
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  nameIdx: index('idx_student_search_name').on(table.name),
}));

// --- Subjects ---
export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull().unique(),
  code: text('code', { length: 4 }).notNull().unique(),
});

// --- Class Sections ---
export const classSections = sqliteTable('class_sections', {
  id: integer('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id),
  letter: text('letter', { length: 1 }).notNull(),
  fullName: text('full_name', { length: 30 }).notNull(),
  medium: text('medium', { length: 15 }).notNull().default('Bengali'),
});

// --- Exam Setups ---
export const examSetups = sqliteTable('exam_setups', {
  setupId: integer('setup_id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id),
  sessionId: integer('session_id').notNull().references(() => sessions.id),
  examTermId: integer('exam_term_id').notNull().references(() => examTerms.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  fullMark: integer('full_mark').notNull(),
}, (table) => ({
  uqExamConfig: unique('uq_exam_config').on(
    table.classId, 
    table.sessionId, 
    table.examTermId, 
    table.subjectId
  ),
}));

// --- Session Enrollments ---
export const sessionEnrollments = sqliteTable('session_enrollments', {
  seid: integer('seid').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => students.sid),
  sessionId: integer('session_id').notNull().references(() => sessions.id),
  classSecId: integer('class_sec_id').notNull().references(() => classSections.id),
  rollNo: integer('roll_no').notNull(),
}, (table) => ({
  uqStudentSession: unique('uq_student_session').on(table.studentId, table.sessionId),
  enrollStudentIdx: index('idx_enroll_student').on(table.studentId),
}));

// --- Marks Entries ---
export const marksEntries = sqliteTable('marks_entries', {
  mid: integer('mid').primaryKey({ autoIncrement: true }),
  sessionEnrollId: integer('session_enroll_id').notNull().references(() => sessionEnrollments.seid),
  examSetupId: integer('exam_setup_id').notNull().references(() => examSetups.setupId),
  marksObtained: integer('marks_obtained').notNull().default(0),
  isPresent: integer('is_present', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => ({
  // FIX: Prevents duplicate marks for same student/subject/term combo
  uqMarksStudentSetup: unique('uq_marks_student_setup').on(table.sessionEnrollId, table.examSetupId),
  marksEnrollIdx: index('idx_marks_enrollment').on(table.sessionEnrollId),
  marksSetupIdx: index('idx_marks_setup').on(table.examSetupId),
}));