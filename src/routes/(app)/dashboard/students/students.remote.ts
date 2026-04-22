import { query } from '$app/server';
import { db } from '$lib/server/db';
import { studClasses, studSections, studInfo, studSessionEnrollments } from '$lib/server/db/schema/marksheet';
import { eq, asc, like, or, and, sql } from 'drizzle-orm';
import * as v from 'valibot';

export const getClasses = query(async () => {
    return await db.select().from(studClasses).orderBy(asc(studClasses.id));
});

export const getSections = query(v.number(), async (classId: number) => {
    return await db.select()
        .from(studSections)
        .where(eq(studSections.classId, classId))
        .orderBy(asc(studSections.id));
});

export const getFilteredStudents = query(
    v.object({
        q: v.string(),
        session: v.string(),
        class: v.string(),
        section: v.string(),
        page: v.number()
    }),
    async (params) => {
        const { q, session: sessionFilter, class: classFilter, section: sectionFilter } = params;
        const limit = 80;
        let page = params.page;

        const conditions = [];
        if (q) {
            conditions.push(or(
                like(studInfo.name, `%${q}%`),
                like(studInfo.portalId, `%${q}%`)
            ));
        }
        if (sessionFilter) {
            conditions.push(eq(studSessionEnrollments.sessionId, parseInt(sessionFilter)));
        }
        if (classFilter) {
            conditions.push(eq(studClasses.id, parseInt(classFilter)));
        }
        if (sectionFilter) {
            conditions.push(eq(studSections.id, parseInt(sectionFilter)));
        }
        
        const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;
        
        const countResult = await db.select({ count: sql<number>`count(distinct ${studInfo.sid})` })
            .from(studInfo)
            .leftJoin(studSessionEnrollments, eq(studInfo.sid, studSessionEnrollments.studentId))
            .leftJoin(studSections, eq(studSessionEnrollments.sectionId, studSections.id))
            .leftJoin(studClasses, eq(studSections.classId, studClasses.id))
            .where(finalCondition);

        const totalRecords = countResult[0]?.count || 0;
        const totalPages = Math.ceil(totalRecords / limit) || 1;

        if (page > totalPages) {
            page = totalPages;
        }
        if (page < 1) {
            page = 1;
        }

        const results = await db.select({
            sid: studInfo.sid,
            portalId: studInfo.portalId,
            name: studInfo.name,
            dob: studInfo.dob,
            fname: studInfo.fname,
            className: studClasses.name,
            sectionLetter: studSections.letter,
            rollNo: studSessionEnrollments.rollNo,
        })
        .from(studInfo)
        .leftJoin(studSessionEnrollments, eq(studInfo.sid, studSessionEnrollments.studentId))
        .leftJoin(studSections, eq(studSessionEnrollments.sectionId, studSections.id))
        .leftJoin(studClasses, eq(studSections.classId, studClasses.id))
        .where(finalCondition)
        .groupBy(studInfo.sid)
        .limit(limit)
        .offset((page - 1) * limit);

        return {
            students: results,
            page,
            totalPages,
            hasNextPage: page < totalPages
        };
    }
);
