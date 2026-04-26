import { db } from '$lib/server/db';
import { studSessions, studExamTerms, studClasses } from '$lib/server/db/schema/marksheet';
import type { PageServerLoad } from './$types';
import { desc, asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const dbSessions = await db.select().from(studSessions).orderBy(desc(studSessions.year));
    const dbTerms = await db.select().from(studExamTerms).orderBy(asc(studExamTerms.id));
    const dbClasses = await db.select().from(studClasses).orderBy(asc(studClasses.id));

    const defaultSession = dbSessions.length > 0 ? dbSessions[0].id.toString() : '';
    const defaultTerm = dbTerms.length > 0 ? dbTerms[0].id.toString() : '';
    const defaultClass = dbClasses.length > 0 ? dbClasses[0].id.toString() : '';

    return {
        sessions: dbSessions,
        examTerms: dbTerms,
        classes: dbClasses,
        defaults: {
            session: defaultSession,
            term: defaultTerm,
            class: defaultClass
        }
    };
};
