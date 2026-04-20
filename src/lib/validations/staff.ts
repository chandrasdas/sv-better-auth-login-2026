import * as v from 'valibot';

export const staffEntrySchema = v.object({
	empId: v.pipe(v.string(), v.minLength(1, 'Employee ID is required')),
	name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
	status: v.picklist(['Permanent', 'Contractual'], 'Status must be Permanent or Contractual'),
	designation: v.picklist(
		['Headmaster', 'Assistant Teacher', 'Librarian', 'Clerk', 'Group-D'],
		'Invalid designation'
	),
	email: v.optional(v.string(), ''),
	phoneNo: v.optional(v.string(), ''),
	dateOfBirth: v.optional(v.string(), ''),
	dateOfJoining: v.optional(v.string(), ''),
	qualification: v.optional(v.string(), ''),
	primarySubject: v.optional(v.string(), '')
});

export type StaffEntryInput = v.InferOutput<typeof staffEntrySchema>;
