import { db } from '$lib/server/db';
import { studInfo, studSessionEnrollments, studSections, studClasses, studSessions } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { like, or, and, eq, desc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q') || '';
    const sessionFilter = url.searchParams.get('session') || '';
    const classFilter = url.searchParams.get('class') || '';
    const sectionFilter = url.searchParams.get('section') || '';
    
    // pagination
    let page = parseInt(url.searchParams.get('page') || '1');
    if (isNaN(page) || page < 1) page = 1;
    const limit = 20;
    //const offset = (page - 1) * limit;

    // Fetch static data for dropdowns
    const dbSessions = await db.select().from(studSessions).orderBy(desc(studSessions.year));

    const conditions = [];
    
    if (query) {
        conditions.push(or(
            like(studInfo.name, `%${query}%`),
            like(studInfo.portalId, `%${query}%`)
        ));
    }
    
    if (sessionFilter) {
        conditions.push(eq(studSessionEnrollments.sessionId, parseInt(sessionFilter)));
    }
    if (classFilter) {
        conditions.push(eq(studClasses.name, classFilter));
    }
    if (sectionFilter) {
        conditions.push(eq(studSections.letter, sectionFilter));
    }
    
    const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Total count calculation
    const countResult = await db.select({ count: sql<number>`count(distinct ${studInfo.sid})` })
        .from(studInfo)
        .leftJoin(studSessionEnrollments, eq(studInfo.sid, studSessionEnrollments.studentId))
        .leftJoin(studSections, eq(studSessionEnrollments.sectionId, studSections.id))
        .leftJoin(studClasses, eq(studSections.classId, studClasses.id))
        .where(finalCondition);

    const totalRecords = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    // We can cap the page to totalPages if they overshoot
    if (page > totalPages) {
        page = totalPages;
    }

    const results = await db.select({
        sid: studInfo.sid,
        portalId: studInfo.portalId,
        name: studInfo.name,
        dob: studInfo.dob,
        fname: studInfo.fname,
    })
    .from(studInfo)
    .leftJoin(studSessionEnrollments, eq(studInfo.sid, studSessionEnrollments.studentId))
    .leftJoin(studSections, eq(studSessionEnrollments.sectionId, studSections.id))
    .leftJoin(studClasses, eq(studSections.classId, studClasses.id))
    .where(finalCondition)
    .groupBy(studInfo.sid)
    .limit(limit)
    .offset((page - 1) * limit);

    const students = results;
    const hasNextPage = page < totalPages;

    return {
        students,
        sessions: dbSessions,
        query,
        filters: { session: sessionFilter, class: classFilter, section: sectionFilter },
        page,
        totalPages,
        hasNextPage
    };
};
