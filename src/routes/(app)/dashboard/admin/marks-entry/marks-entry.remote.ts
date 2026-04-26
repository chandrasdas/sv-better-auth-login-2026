import { query } from '$app/server';
import { db } from '$lib/server/db';
import {
    studExamSetups,
    studSubjects,
    studSessionEnrollments,
    studInfo,
    studMarksEntries,
    studSections
} from '$lib/server/db/schema/marksheet';
import { eq, and, asc, sql } from 'drizzle-orm';
import * as v from 'valibot';

/**
 * Fetches subjects that have been configured in exam setups
 * for a given session + class + exam term combination.
 */
export const getSubjectsForExam = query(
    v.object({
        sessionId: v.number(),
        classId: v.number(),
        examTermId: v.number()
    }),
    async (params) => {
        const results = await db.select({
            setupId: studExamSetups.setupId,
            subjectId: studExamSetups.subjectId,
            subjectName: studSubjects.name,
            subjectCode: studSubjects.code,  //code is not required
            fullMark: studExamSetups.fullMark,
            passMark: studExamSetups.passMark
        })
        .from(studExamSetups)
        .innerJoin(studSubjects, eq(studExamSetups.subjectId, studSubjects.id))
        .where(
            and(
                eq(studExamSetups.sessionId, params.sessionId),
                eq(studExamSetups.classId, params.classId),
                eq(studExamSetups.examTermId, params.examTermId)
            )
        )
        .orderBy(asc(studExamSetups.sortIndex));

        return results;
    }
);

/**
 * Fetches all enrolled students for a given session + section,
 * and left-joins their marks for the selected exam setup.
 */
export const getStudentsForMarks = query(
    v.object({
        sessionId: v.number(),
        sectionId: v.number(),
        examSetupId: v.number()
    }),
    async (params) => {
        const results = await db.select({
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
                eq(studMarksEntries.examSetupId, params.examSetupId)
            )
        )
        .where(
            and(
                eq(studSessionEnrollments.sessionId, params.sessionId),
                eq(studSessionEnrollments.sectionId, params.sectionId)
            )
        )
        .orderBy(asc(studSessionEnrollments.rollNo));

        return results;
    }
);

/**
 * Fetches sections for a given class (reused from students.remote pattern).
 */
export const getSectionsForClass = query(
    v.number(),
    async (classId: number) => {
        return await db.select()
            .from(studSections)
            .where(eq(studSections.classId, classId))
            .orderBy(asc(studSections.id));
    }
);

/**
 * Upserts a single mark entry.
 * Uses INSERT ... ON CONFLICT ... DO UPDATE for atomic save.
 */
export const saveSingleMark = query(
    v.object({
        sessionEnrollId: v.number(),
        examSetupId: v.number(),
        marksObtained: v.number(),
        isPresent: v.boolean()
    }),
    async (params) => {
        await db.insert(studMarksEntries)
            .values({
                sessionEnrollId: params.sessionEnrollId,
                examSetupId: params.examSetupId,
                marksObtained: params.marksObtained,
                isPresent: params.isPresent,
            })
            .onConflictDoUpdate({
                target: [studMarksEntries.sessionEnrollId, studMarksEntries.examSetupId],
                set: {
                    marksObtained: params.marksObtained,
                    isPresent: params.isPresent,
                    updatedAt: sql`(unixepoch())`
                }
            });

        return { success: true };
    }
);
