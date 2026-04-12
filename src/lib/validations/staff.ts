import { z } from 'zod';

export const staffEntrySchema = z.object({
	empId: z.string().min(1, { error: 'Employee ID is required' }),
	name: z.string().min(1, { error: 'Name is required' }),
	status: z.enum(['Permanent', 'Contractual'], { error: 'Status must be Permanent or Contractual' }),
	designation: z.enum(
		['Headmaster', 'Assistant Teacher', 'Librarian', 'Clerk', 'Group-D'],
		{ error: 'Invalid designation' }
	),
	email: z.string().optional().default(''),
	phoneNo: z.string().optional().default(''),
	dateOfBirth: z.string().optional().default(''),
	dateOfJoining: z.string().optional().default(''),
	qualification: z.string().optional().default(''),
	primarySubject: z.string().optional().default('')
});

export type StaffEntryInput = z.infer<typeof staffEntrySchema>;
