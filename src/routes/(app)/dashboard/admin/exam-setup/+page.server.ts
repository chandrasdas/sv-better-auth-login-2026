import { db } from '$lib/server/db';
import { studSessions, studExamTerms, studClasses, studSubjects } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { desc, asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    // Fetch base data for dropdowns
    const dbSessions = await db.select().from(studSessions).orderBy(desc(studSessions.year));
    const dbTerms = await db.select().from(studExamTerms).orderBy(asc(studExamTerms.id));
    const dbClasses = await db.select().from(studClasses).orderBy(asc(studClasses.id));
    
    // Fetch all subjects for the table
    const dbSubjects = await db.select().from(studSubjects).orderBy(asc(studSubjects.id));

    // Resolve defaults
    const defaultSession = dbSessions.length > 0 ? dbSessions[0].id.toString() : '';
    const defaultTerm = dbTerms.length > 0 ? dbTerms[0].id.toString() : '';
    const defaultClass = dbClasses.length > 0 ? dbClasses[0].id.toString() : '';

    return {
        sessions: dbSessions,
        examTerms: dbTerms,
        classes: dbClasses,
        subjects: dbSubjects,
        defaults: {
            session: defaultSession,
            term: defaultTerm,
            class: defaultClass
        }
    };
};
