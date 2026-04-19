import { sqliteTable, text, integer, unique, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Classes ---
export const studClasses = sqliteTable('stud_classes', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull(),
});

// --- Exam Terms ---
export const studExamTerms = sqliteTable('stud_exam_terms', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull(),
});

// --- Sessions ---
export const studSessions = sqliteTable('stud_sessions', {
  id: integer('id').primaryKey(),
  year: integer('year').notNull(),
  name: text('name', { length: 9 }).notNull(),
});

// --- Students ---
export const studInfo = sqliteTable('stud_info', {
  sid: integer('sid').primaryKey(),
  portalId: text('portal_id', { length: 14 }).notNull().unique(),
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
}, (table) => [
  index('idx_student_search_name').on(table.name),
]);

// --- Subjects ---
export const studSubjects = sqliteTable('stud_subjects', {
  id: integer('id').primaryKey(),
  name: text('name', { length: 20 }).notNull().unique(),
  code: text('code', { length: 4 }).notNull().unique(),
});

// --- Class Sections ---
export const studSections = sqliteTable('stud_sections', {
  id: integer('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => studClasses.id),
  letter: text('letter', { length: 1 }).notNull(),
  fullName: text('full_name', { length: 30 }).notNull(),
  medium: text('medium', { length: 15 }).notNull().default('Bengali'),
});

// --- Exam Setups ---
export const studExamSetups = sqliteTable('stud_exam_setups', {
  setupId: integer('setup_id').primaryKey(),
  classId: integer('class_id').notNull().references(() => studClasses.id),
  sessionId: integer('session_id').notNull().references(() => studSessions.id),
  examTermId: integer('exam_term_id').notNull().references(() => studExamTerms.id),
  subjectId: integer('subject_id').notNull().references(() => studSubjects.id),
  fullMark: integer('full_mark').notNull(),
}, (table) => [
  unique('uq_exam_config').on(
    table.classId, 
    table.sessionId, 
    table.examTermId, 
    table.subjectId
  ),
]);

// --- Session Enrollments ---
export const studSessionEnrollments = sqliteTable('stud_session_enrollments', {
  seid: integer('seid').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => studInfo.sid),
  sessionId: integer('session_id').notNull().references(() => studSessions.id),
  sectionId: integer('section_id').notNull().references(() => studSections.id),
  rollNo: integer('roll_no').notNull(),
}, (table) => [
  unique('uq_student_session').on(table.studentId, table.sessionId),
  index('idx_enroll_student').on(table.studentId),
]);

// --- Marks Entries ---
export const studMarksEntries = sqliteTable('stud_marks_entries', {
  mid: integer('mid').primaryKey({ autoIncrement: true }),
  sessionEnrollId: integer('session_enroll_id').notNull().references(() => studSessionEnrollments.seid),
  examSetupId: integer('exam_setup_id').notNull().references(() => studExamSetups.setupId),
  marksObtained: integer('marks_obtained').notNull().default(0),
  isPresent: integer('is_present', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, (table) => [
  // FIX: Prevents duplicate marks for same student/subject/term combo
  unique('uq_marks_student_setup').on(table.sessionEnrollId, table.examSetupId),
  index('idx_marks_enrollment').on(table.sessionEnrollId),
  index('idx_marks_setup').on(table.examSetupId),
]);
