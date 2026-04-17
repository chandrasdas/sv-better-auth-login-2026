import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { staff } from "./staff";
import {
  classes,
  examTerms,
  sessions,
  students,
  subjects,
  classSections,
  examSetups,
  sessionEnrollments,
  marksEntries,
} from "./marksheet";

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

// --- MARKSHEET RELATIONS ---

export const classesRelations = relations(classes, ({ many }) => ({
  classSections: many(classSections),
  examSetups: many(examSetups),
}));

export const examTermsRelations = relations(examTerms, ({ many }) => ({
  examSetups: many(examSetups),
}));

export const sessionsRelations = relations(sessions, ({ many }) => ({
  examSetups: many(examSetups),
  sessionEnrollments: many(sessionEnrollments),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  sessionEnrollments: many(sessionEnrollments),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  examSetups: many(examSetups),
}));

export const classSectionsRelations = relations(classSections, ({ one, many }) => ({
  class: one(classes, {
    fields: [classSections.classId],
    references: [classes.id],
  }),
  sessionEnrollments: many(sessionEnrollments),
}));

export const examSetupsRelations = relations(examSetups, ({ one, many }) => ({
  class: one(classes, {
    fields: [examSetups.classId],
    references: [classes.id],
  }),
  session: one(sessions, {
    fields: [examSetups.sessionId],
    references: [sessions.id],
  }),
  examTerm: one(examTerms, {
    fields: [examSetups.examTermId],
    references: [examTerms.id],
  }),
  subject: one(subjects, {
    fields: [examSetups.subjectId],
    references: [subjects.id],
  }),
  marksEntries: many(marksEntries),
}));

export const sessionEnrollmentsRelations = relations(sessionEnrollments, ({ one, many }) => ({
  student: one(students, {
    fields: [sessionEnrollments.studentId],
    references: [students.sid],
  }),
  session: one(sessions, {
    fields: [sessionEnrollments.sessionId],
    references: [sessions.id],
  }),
  classSection: one(classSections, {
    fields: [sessionEnrollments.classSecId],
    references: [classSections.id],
  }),
  marksEntries: many(marksEntries),
}));

export const marksEntriesRelations = relations(marksEntries, ({ one }) => ({
  sessionEnrollment: one(sessionEnrollments, {
    fields: [marksEntries.sessionEnrollId],
    references: [sessionEnrollments.seid],
  }),
  examSetup: one(examSetups, {
    fields: [marksEntries.examSetupId],
    references: [examSetups.setupId],
  }),
}));
