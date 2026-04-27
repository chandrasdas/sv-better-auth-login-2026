import { db } from '$lib/server/db';
import { studSessions, studExamTerms, studClasses, studSections, studExamSetups, studSubjects, studSessionEnrollments, studInfo, studMarksEntries } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { desc, asc, eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const dbSessions = await db.select().from(studSessions).orderBy(desc(studSessions.year));
    const dbTerms = await db.select().from(studExamTerms).orderBy(asc(studExamTerms.id));
    const dbClasses = await db.select().from(studClasses).orderBy(asc(studClasses.id));

    const defaultSession = dbSessions.length > 0 ? dbSessions[0].id.toString() : '';
    const defaultTerm = dbTerms.length > 0 ? dbTerms[0].id.toString() : '';
    const defaultClass = dbClasses.length > 0 ? dbClasses[0].id.toString() : '';

    // Pre-fetch sections for default class
    let dbSectionsForClass: Array<{ id: number; classId: number; letter: string; fullName: string; medium: string }> = [];
    if (defaultClass) {
        dbSectionsForClass = await db.select()
            .from(studSections)
            .where(eq(studSections.classId, parseInt(defaultClass)))
            .orderBy(asc(studSections.id));
    }
    const defaultSection = dbSectionsForClass.length > 0 ? dbSectionsForClass[0].id.toString() : '';

    // Pre-fetch subjects for default session + term + class
    let dbSubjectsForExam: Array<{ setupId: number; subjectId: number; subjectName: string; subjectCode: string; fullMark: number; passMark: number }> = [];
    if (defaultSession && defaultTerm && defaultClass) {
        dbSubjectsForExam = await db.select({
            setupId: studExamSetups.setupId,
            subjectId: studExamSetups.subjectId,
            subjectName: studSubjects.name,
            subjectCode: studSubjects.code,
            fullMark: studExamSetups.fullMark,
            passMark: studExamSetups.passMark
        })
        .from(studExamSetups)
        .innerJoin(studSubjects, eq(studExamSetups.subjectId, studSubjects.id))
        .where(
            and(
                eq(studExamSetups.sessionId, parseInt(defaultSession)),
                eq(studExamSetups.classId, parseInt(defaultClass)),
                eq(studExamSetups.examTermId, parseInt(defaultTerm))
            )
        )
        .orderBy(asc(studExamSetups.sortIndex));
    }
    const defaultSubject = dbSubjectsForExam.length > 0 ? dbSubjectsForExam[0].setupId.toString() : '';

    // Pre-fetch students for default session + section + subject
    let dbStudents: Array<{ seid: number; rollNo: number; studentName: string; mid: number | null; isPresent: boolean | null; marksObtained: number | null }> = [];
    if (defaultSession && defaultSection && defaultSubject) {
        dbStudents = await db.select({
            seid: studSessionEnrollments.seid,
            rollNo: studSessionEnrollments.rollNo,
            studentName: studInfo.name,
            mid: studMarksEntries.mid,
            isPresent: studMarksEntries.isPresent,
            marksObtained: studMarksEntries.marksObtained
        })
        .from(studSessionEnrollments)
        .innerJoin(studInfo, eq(studSessionEnrollments.studentId, studInfo.sid))
        .leftJoin(
            studMarksEntries,
            and(
                eq(studMarksEntries.sessionEnrollId, studSessionEnrollments.seid),
                eq(studMarksEntries.examSetupId, parseInt(defaultSubject))
            )
        )
        .where(
            and(
                eq(studSessionEnrollments.sessionId, parseInt(defaultSession)),
                eq(studSessionEnrollments.sectionId, parseInt(defaultSection))
            )
        )
        .orderBy(asc(studSessionEnrollments.rollNo));
    }

    return {
        sessions: dbSessions,
        examTerms: dbTerms,
        classes: dbClasses,
        initialSections: dbSectionsForClass,
        initialSubjects: dbSubjectsForExam,
        initialStudents: dbStudents,
        defaults: {
            session: defaultSession,
            term: defaultTerm,
            class: defaultClass,
            section: defaultSection,
            subject: defaultSubject
        }
    };
};
