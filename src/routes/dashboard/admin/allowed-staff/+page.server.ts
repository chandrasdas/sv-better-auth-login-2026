import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { allowedStaff } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	// Protect the route: redirect to login if not authenticated
	if (!locals.user) {
		redirect(302, '/login');
	}

	// Double check role
	if (locals.user.role !== 'admin') {
		redirect(302, '/dashboard'); // Or show 403 Forbidden
	}

	const staffList = await db.select().from(allowedStaff).orderBy(allowedStaff.id);

	return {
		user: locals.user,
		staffList
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as "admin" | "teacher" | "staff";
		const isAllowed = formData.get('isAllowed') === 'on' || formData.get('isAllowed') === 'true';

		if (!email) {
			return fail(400, { message: 'Email is required' });
		}

		try {
			await db.insert(allowedStaff).values({
				name: name || null,
				email,
				role: role || 'teacher',
				isAllowed
			});
			return { success: true, message: 'Staff member added successfully.' };
		} catch (error: unknown) {
			if (error instanceof Error && error.message.includes('Duplicate')) {
				return fail(400, { message: 'A staff member with this email already exists.' });
			}
			return fail(500, { message: 'Failed to add staff member.' });
		}
	},

	edit: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idStr = formData.get('id') as string;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as "admin" | "teacher" | "staff";
		// The checkbox might only send a value if checked. If we have a hidden input or handle it via a boolean dropdown, we must handle it correctly.
		// For a checkbox, if checked, we receive 'on'. If not, we receive nothing.
		const isAllowed = formData.has('isAllowed'); 

		if (!idStr || !email) {
			return fail(400, { message: 'ID and Email are required for edit' });
		}

		const id = parseInt(idStr, 10);
		if (isNaN(id)) {
            return fail(400, { message: 'Invalid ID' });
        }

		try {
			await db.update(allowedStaff)
				.set({
					name: name || null,
					email,
					role: role || 'teacher',
					isAllowed
				})
				.where(eq(allowedStaff.id, id));
			
			return { success: true, message: 'Staff member updated successfully.' };
		} catch (error: unknown) {
			if (error instanceof Error && error.message.includes('Duplicate')) {
				return fail(400, { message: 'A staff member with this email already exists.' });
			}
			return fail(500, { message: 'Failed to update staff member.' });
		}
	},

	delete: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idStr = formData.get('id') as string;

		if (!idStr) {
			return fail(400, { message: 'ID is required to delete' });
		}

		const id = parseInt(idStr, 10);
		if (isNaN(id)) {
            return fail(400, { message: 'Invalid ID' });
        }

		try {
			await db.delete(allowedStaff).where(eq(allowedStaff.id, id));
			return { success: true, message: 'Staff member deleted successfully.' };
		} catch (error) {
			return fail(500, { message: 'Failed to delete staff member.' });
		}
	}
};
