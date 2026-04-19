import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { staff } from "./staff";
import {
  studClasses,
  studExamTerms,
  studSessions,
  studInfo,
  studSubjects,
  studSections,
  studExamSetups,
  studSessionEnrollments,
  studMarksEntries,
} from "./marksheet";

// --- RELATIONS ---

export const userRelations = relations(user, ({ many, one }) => ({
  studSessions: many(session),
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

export const studClassesRelations = relations(studClasses, ({ many }) => ({
  studSections: many(studSections),
  studExamSetups: many(studExamSetups),
}));

export const studExamTermsRelations = relations(studExamTerms, ({ many }) => ({
  studExamSetups: many(studExamSetups),
}));

export const studSessionsRelations = relations(studSessions, ({ many }) => ({
  studExamSetups: many(studExamSetups),
  studSessionEnrollments: many(studSessionEnrollments),
}));

export const studInfoRelations = relations(studInfo, ({ many }) => ({
  studSessionEnrollments: many(studSessionEnrollments),
}));

export const studSubjectsRelations = relations(studSubjects, ({ many }) => ({
  studExamSetups: many(studExamSetups),
}));

export const studSectionsRelations = relations(studSections, ({ one, many }) => ({
  class: one(studClasses, {
    fields: [studSections.classId],
    references: [studClasses.id],
  }),
  studSessionEnrollments: many(studSessionEnrollments),
}));

export const studExamSetupsRelations = relations(studExamSetups, ({ one, many }) => ({
  class: one(studClasses, {
    fields: [studExamSetups.classId],
    references: [studClasses.id],
  }),
  session: one(studSessions, {
    fields: [studExamSetups.sessionId],
    references: [studSessions.id],
  }),
  examTerm: one(studExamTerms, {
    fields: [studExamSetups.examTermId],
    references: [studExamTerms.id],
  }),
  subject: one(studSubjects, {
    fields: [studExamSetups.subjectId],
    references: [studSubjects.id],
  }),
  studMarksEntries: many(studMarksEntries),
}));

export const studSessionEnrollmentsRelations = relations(studSessionEnrollments, ({ one, many }) => ({
  student: one(studInfo, {
    fields: [studSessionEnrollments.studentId],
    references: [studInfo.sid],
  }),
  session: one(studSessions, {
    fields: [studSessionEnrollments.sessionId],
    references: [studSessions.id],
  }),
  classSection: one(studSections, {
    fields: [studSessionEnrollments.sectionId],
    references: [studSections.id],
  }),
  studMarksEntries: many(studMarksEntries),
}));

export const studMarksEntriesRelations = relations(studMarksEntries, ({ one }) => ({
  sessionEnrollment: one(studSessionEnrollments, {
    fields: [studMarksEntries.sessionEnrollId],
    references: [studSessionEnrollments.seid],
  }),
  examSetup: one(studExamSetups, {
    fields: [studMarksEntries.examSetupId],
    references: [studExamSetups.setupId],
  }),
}));
