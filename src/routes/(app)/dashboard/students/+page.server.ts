import { db } from '$lib/server/db';
import { studInfo, studSessionEnrollments, studSections, studClasses, studSessions } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { like, or, and, eq, desc, asc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q') || '';
    
    // Fetch base data for defaults and dropdowns
    const dbSessions = await db.select().from(studSessions).orderBy(desc(studSessions.year));
    const dbClasses = await db.select().from(studClasses).orderBy(asc(studClasses.id));

    // Resolve defaults if not in URL
    let sessionFilter = url.searchParams.get('session');
    if (!sessionFilter && dbSessions.length > 0) {
        sessionFilter = dbSessions[0].id.toString();
    }

    let classFilter = url.searchParams.get('class');
    if (!classFilter && dbClasses.length > 0) {
        // We use the ID for the session/class/section filters now for consistency
        classFilter = dbClasses[0].id.toString();
    }

    // Fetch sections for the selected class to determine default section
    const dbSectionsList = classFilter 
        ? await db.select().from(studSections).where(eq(studSections.classId, parseInt(classFilter))).orderBy(asc(studSections.id))
        : [];

    let sectionFilter = url.searchParams.get('section');
    if (!sectionFilter && dbSectionsList.length > 0) {
        sectionFilter = dbSectionsList[0].id.toString();
    }
    
    // pagination
    let page = parseInt(url.searchParams.get('page') || '1');
    if (isNaN(page) || page < 1) page = 1;
    const limit = 20;

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
        conditions.push(eq(studClasses.id, parseInt(classFilter)));
    }
    if (sectionFilter) {
        conditions.push(eq(studSections.id, parseInt(sectionFilter)));
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

    const hasNextPage = page < totalPages;

    return {
        students: results,
        sessions: dbSessions,
        classes: dbClasses,
        sections: dbSectionsList,
        query,
        filters: { 
            session: sessionFilter || '', 
            class: classFilter || '', 
            section: sectionFilter || '' 
        },
        page,
        totalPages,
        hasNextPage
    };
};
