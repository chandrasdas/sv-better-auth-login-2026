import { query } from '$app/server';
import { db } from '$lib/server/db';
import { studClasses, studSections } from '$lib/server/db/schema/marksheet';
import { eq, asc } from 'drizzle-orm';
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
