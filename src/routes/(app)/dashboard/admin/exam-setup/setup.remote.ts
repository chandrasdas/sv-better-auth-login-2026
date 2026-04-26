import { query } from '$app/server';
import { db } from '$lib/server/db';
import { studExamSetups } from '$lib/server/db/schema/marksheet';
import { eq, and } from 'drizzle-orm';
import * as v from 'valibot';

export const getExistingSetups = query(
    v.object({
        sessionId: v.number(),
        examTermId: v.number(),
        classId: v.number()
    }),
    async (params) => {
        const setups = await db.select()
            .from(studExamSetups)
            .where(
                and(
                    eq(studExamSetups.sessionId, params.sessionId),
                    eq(studExamSetups.examTermId, params.examTermId),
                    eq(studExamSetups.classId, params.classId)
                )
            );
        return setups;
    }
);

export const saveExamSetups = query(
    v.object({
        sessionId: v.number(),
        examTermId: v.number(),
        classId: v.number(),
        setups: v.array(
            v.object({
                subjectId: v.number(),
                fullMark: v.union([v.number(), v.null()]),
                passMark: v.number(),
                sortIndex: v.number(),
                includeInMarksheet: v.boolean(),
                includeInTotal: v.boolean()
            })
        )
    }),
    async (params) => {
        await db.transaction(async (tx) => {
            // 1. Delete existing setups for this specific configuration
            await tx.delete(studExamSetups)
                .where(
                    and(
                        eq(studExamSetups.sessionId, params.sessionId),
                        eq(studExamSetups.examTermId, params.examTermId),
                        eq(studExamSetups.classId, params.classId)
                    )
                );

            // 2. Prepare for insert
            const setupsToInsert = params.setups
                .map(s => ({
                    sessionId: params.sessionId,
                    examTermId: params.examTermId,
                    classId: params.classId,
                    subjectId: s.subjectId,
                    fullMark: s.fullMark as number,
                    passMark: s.passMark,
                    sortIndex: s.sortIndex,
                    includeInMarksheet: s.includeInMarksheet,
                    includeInTotal: s.includeInTotal
                }));

            // 3. Bulk insert if there's anything to insert
            if (setupsToInsert.length > 0) {
                await tx.insert(studExamSetups).values(setupsToInsert);
            }
        });

        return { success: true };
    }
);
