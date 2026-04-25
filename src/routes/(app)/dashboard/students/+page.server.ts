import { db } from '$lib/server/db';
import { studSections, studClasses, studSessions } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { eq, desc, asc } from 'drizzle-orm';
import { getFilteredStudents } from './students.remote';

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

    const classFilter = url.searchParams.get('class') || '';

    // Fetch sections for the selected class to determine default section
    const dbSectionsList = classFilter 
        ? await db.select().from(studSections).where(eq(studSections.classId, parseInt(classFilter))).orderBy(asc(studSections.id))
        : [];

    const sectionFilter = url.searchParams.get('section') || '';
    
    // pagination
    let page = parseInt(url.searchParams.get('page') || '1');
    if (isNaN(page) || page < 1) page = 1;

    const studentData = await getFilteredStudents({
        q: query,
        session: sessionFilter || '',
        class: classFilter || '',
        section: sectionFilter || '',
        page
    });

    return {
        students: studentData.students,
        sessions: dbSessions,
        classes: dbClasses,
        sections: dbSectionsList,
        query,
        filters: { 
            session: sessionFilter || '', 
            class: classFilter || '', 
            section: sectionFilter || '' 
        },
        page: studentData.page,
        totalPages: studentData.totalPages,
        totalRecords: studentData.totalRecords,
        hasNextPage: studentData.hasNextPage
    };
};
