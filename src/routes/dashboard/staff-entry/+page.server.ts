import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { staff } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}
	
	// Pre-fetch if the user has already filled the form?
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
		const user = locals.user;
		if (!user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const empId = formData.get('empId')?.toString();
		const name = formData.get('name')?.toString();
		const status = formData.get('status')?.toString() as 'Permanent' | 'Contractual';
		const designation = formData.get('designation')?.toString() as 'Headmaster' | 'Assistant Teacher' | 'Librarian' | 'Clerk' | 'Group-D';
		const email = formData.get('email')?.toString();
		const phoneNo = formData.get('phoneNo')?.toString();
		const dateOfBirthStr = formData.get('dateOfBirth')?.toString();
		const dateOfJoiningStr = formData.get('dateOfJoining')?.toString();
		const qualification = formData.get('qualification')?.toString();
		const primarySubject = formData.get('primarySubject')?.toString();

		if (!empId || !name || !status || !designation) {
			return fail(400, {
				error: 'Employee ID, Name, Status, and Designation are required.',
				data: Object.fromEntries(formData)
			});
		}

		try {
			const staffData = {
				empId,
				name,
				status,
				designation,
				email: email || null,
				phoneNo: phoneNo || null,
				dateOfBirth: dateOfBirthStr ? new Date(dateOfBirthStr) : null,
				dateOfJoining: dateOfJoiningStr ? new Date(dateOfJoiningStr) : null,
				qualification: qualification || null,
				primarySubject: primarySubject || null,
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
			const err = error as { code?: string };
			console.error('Error inserting staff data:', err);
			if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, {
					error: 'A staff member with this Employee ID or Email already exists.',
					data: Object.fromEntries(formData)
				});
			}
			return fail(500, {
				error: 'An unexpected error occurred while saving the data.',
				data: Object.fromEntries(formData)
			});
		}
	}
};
