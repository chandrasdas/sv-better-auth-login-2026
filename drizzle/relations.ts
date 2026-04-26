import { relations } from "drizzle-orm/relations";
import { user, account, session, staff, studExamSetups, studMarksEntries, studSessionEnrollments, studClasses, studSections, studSessions, studInfo, studSubjects, studExamTerms } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	staff: many(staff),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const staffRelations = relations(staff, ({one}) => ({
	user: one(user, {
		fields: [staff.userId],
		references: [user.id]
	}),
}));

export const studMarksEntriesRelations = relations(studMarksEntries, ({one}) => ({
	studExamSetup: one(studExamSetups, {
		fields: [studMarksEntries.examSetupId],
		references: [studExamSetups.setupId]
	}),
	studSessionEnrollment: one(studSessionEnrollments, {
		fields: [studMarksEntries.sessionEnrollId],
		references: [studSessionEnrollments.seid]
	}),
}));

export const studExamSetupsRelations = relations(studExamSetups, ({one, many}) => ({
	studMarksEntries: many(studMarksEntries),
	studSubject: one(studSubjects, {
		fields: [studExamSetups.subjectId],
		references: [studSubjects.id]
	}),
	studExamTerm: one(studExamTerms, {
		fields: [studExamSetups.examTermId],
		references: [studExamTerms.id]
	}),
	studSession: one(studSessions, {
		fields: [studExamSetups.sessionId],
		references: [studSessions.id]
	}),
	studClass: one(studClasses, {
		fields: [studExamSetups.classId],
		references: [studClasses.id]
	}),
}));

export const studSessionEnrollmentsRelations = relations(studSessionEnrollments, ({one, many}) => ({
	studMarksEntries: many(studMarksEntries),
	studSection: one(studSections, {
		fields: [studSessionEnrollments.sectionId],
		references: [studSections.id]
	}),
	studSession: one(studSessions, {
		fields: [studSessionEnrollments.sessionId],
		references: [studSessions.id]
	}),
	studInfo: one(studInfo, {
		fields: [studSessionEnrollments.studentId],
		references: [studInfo.sid]
	}),
}));

export const studSectionsRelations = relations(studSections, ({one, many}) => ({
	studClass: one(studClasses, {
		fields: [studSections.classId],
		references: [studClasses.id]
	}),
	studSessionEnrollments: many(studSessionEnrollments),
}));

export const studClassesRelations = relations(studClasses, ({many}) => ({
	studSections: many(studSections),
	studExamSetups: many(studExamSetups),
}));

export const studSessionsRelations = relations(studSessions, ({many}) => ({
	studSessionEnrollments: many(studSessionEnrollments),
	studExamSetups: many(studExamSetups),
}));

export const studInfoRelations = relations(studInfo, ({many}) => ({
	studSessionEnrollments: many(studSessionEnrollments),
}));

export const studSubjectsRelations = relations(studSubjects, ({many}) => ({
	studExamSetups: many(studExamSetups),
}));

export const studExamTermsRelations = relations(studExamTerms, ({many}) => ({
	studExamSetups: many(studExamSetups),
}));