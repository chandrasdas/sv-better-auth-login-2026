import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { isUniqueConstraintError } from '$lib/server/db/utils';
import { staff } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '$lib/server/auth-utils';
import * as v from 'valibot';
import { staffEntrySchema } from '$lib/validations/staff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireAuth(locals);
	
	// Pre-fetch if the user has already filled the form
	const existingStaff = await db.query.staff.findFirst({
		where: eq(staff.userId, user.id)
	});

	let existingStaffFormatted = null;
	if (existingStaff) {
		existingStaffFormatted = {
			...existingStaff,
			dateOfBirthFormatted: existingStaff.dateOfBirth ? existingStaff.dateOfBirth.toISOString().split('T')[0] : '',
			dateOfJoiningFormatted: existingStaff.dateOfJoining ? existingStaff.dateOfJoining.toISOString().split('T')[0] : ''
		};
	}

	return {
		user: user,
		hasFilledForm: !!existingStaff,
		existingStaff: existingStaffFormatted
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = requireAuth(locals);

		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const result = v.safeParse(staffEntrySchema, raw);
		if (!result.success) {
			const flatErrors = v.flatten(result.issues);
			const firstError = Object.values(flatErrors.nested ?? {}).flat()[0] || 'Invalid input.';
			return fail(400, {
				error: firstError,
				data: raw
			});
		}

		const validated = result.output;

		try {
			const staffData = {
				empId: validated.empId,
				name: validated.name,
				status: validated.status,
				designation: validated.designation,
				email: validated.email || null,
				phoneNo: validated.phoneNo || null,
				dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
				dateOfJoining: validated.dateOfJoining ? new Date(validated.dateOfJoining) : null,
				qualification: validated.qualification || null,
				primarySubject: validated.primarySubject || null,
				userId: user.id
			};

			const existingStaff = await db.query.staff.findFirst({
				where: eq(staff.userId, user.id)
			});

			if (existingStaff) {
				const normalizeDate = (d: Date | null) => d ? d.toISOString().split('T')[0] : null;
				const hasChanges = 
					existingStaff.empId !== staffData.empId ||
					existingStaff.name !== staffData.name ||
					existingStaff.status !== staffData.status ||
					existingStaff.designation !== staffData.designation ||
					(existingStaff.email || null) !== (staffData.email || null) ||
					(existingStaff.phoneNo || null) !== (staffData.phoneNo || null) ||
					(existingStaff.qualification || null) !== (staffData.qualification || null) ||
					(existingStaff.primarySubject || null) !== (staffData.primarySubject || null) ||
					normalizeDate(existingStaff.dateOfBirth) !== normalizeDate(staffData.dateOfBirth as Date | null) ||
					normalizeDate(existingStaff.dateOfJoining) !== normalizeDate(staffData.dateOfJoining as Date | null);

				if (hasChanges) {
					await db.update(staff).set(staffData).where(eq(staff.userId, user.id));
				} else {
					return { success: true, noChanges: true };
				}
			} else {
				await db.insert(staff).values(staffData);
			}

			return { success: true, noChanges: false };
		} catch (error: unknown) {
			console.error('Error inserting staff data:', error);
			if (isUniqueConstraintError(error)) {
				return fail(400, {
					error: 'A staff member with this Employee ID or Email already exists.',
					data: raw
				});
			}
			return fail(500, {
				error: 'An unexpected error occurred while saving the data.',
				data: raw
			});
		}
	}
};
