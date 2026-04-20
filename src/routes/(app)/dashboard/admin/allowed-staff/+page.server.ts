import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { allowedStaff } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '$lib/server/auth-utils';
import { addAllowedStaffSchema, editAllowedStaffSchema, deleteAllowedStaffSchema } from '$lib/validations/allowed-staff';
import * as v from 'valibot';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireRole(locals, 'admin');

	const staffList = await db.select().from(allowedStaff).orderBy(allowedStaff.id);

	return {
		user,
		staffList
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		requireRole(locals, 'admin');

		const formData = await request.formData();
		const raw = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			role: formData.get('role') as string,
			isAllowed: formData.get('isAllowed') === 'on' || formData.get('isAllowed') === 'true'
		};

		const result = v.safeParse(addAllowedStaffSchema, raw);
		if (!result.success) {
			const fieldErrors = v.flatten(result.issues).nested ?? {};
			const firstError = Object.values(fieldErrors).flat()[0] || 'Invalid input.';
			return fail(400, { message: firstError });
		}

		const validated = result.output;

		try {
			await db.insert(allowedStaff).values({
				name: validated.name || null,
				email: validated.email,
				role: validated.role,
				isAllowed: validated.isAllowed
			});
			return { success: true, message: 'Staff member added successfully.' };
		} catch (error: unknown) {
			if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
				return fail(400, { message: 'A staff member with this email already exists.' });
			}
			return fail(500, { message: 'Failed to add staff member.' });
		}
	},

	edit: async ({ request, locals }) => {
		requireRole(locals, 'admin');

		const formData = await request.formData();
		const raw = {
			id: formData.get('id') as string,
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			role: formData.get('role') as string,
			isAllowed: formData.has('isAllowed')
		};

		const result = v.safeParse(editAllowedStaffSchema, raw);
		if (!result.success) {
			const fieldErrors = v.flatten(result.issues).nested ?? {};
			const firstError = Object.values(fieldErrors).flat()[0] || 'Invalid input.';
			return fail(400, { message: firstError });
		}

		const validated = result.output;

		try {
			await db.update(allowedStaff)
				.set({
					name: validated.name || null,
					email: validated.email,
					role: validated.role,
					isAllowed: validated.isAllowed
				})
				.where(eq(allowedStaff.id, validated.id));
			
			return { success: true, message: 'Staff member updated successfully.' };
		} catch (error: unknown) {
			if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
				return fail(400, { message: 'A staff member with this email already exists.' });
			}
			return fail(500, { message: 'Failed to update staff member.' });
		}
	},

	delete: async ({ request, locals }) => {
		requireRole(locals, 'admin');

		const formData = await request.formData();
		const raw = { id: formData.get('id') as string };

		const result = v.safeParse(deleteAllowedStaffSchema, raw);
		if (!result.success) {
			return fail(400, { message: 'Invalid ID' });
		}

		try {
			await db.delete(allowedStaff).where(eq(allowedStaff.id, result.output.id));
			return { success: true, message: 'Staff member deleted successfully.' };
		} catch {
			return fail(500, { message: 'Failed to delete staff member.' });
		}
	}
};
