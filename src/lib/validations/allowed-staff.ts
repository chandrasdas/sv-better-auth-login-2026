import * as v from 'valibot';

const rolesEnum = ['admin', 'teacher', 'staff'] as const;

export const addAllowedStaffSchema = v.object({
	name: v.optional(v.string(), ''),
	email: v.pipe(v.string(), v.minLength(1, 'Email is required')),
	role: v.fallback(v.picklist(rolesEnum), 'teacher'),
	isAllowed: v.optional(v.boolean(), true)
});

export const editAllowedStaffSchema = v.object({
	id: v.pipe(v.unknown(), v.transform(Number), v.number('Invalid ID')),
	name: v.optional(v.string(), ''),
	email: v.pipe(v.string(), v.minLength(1, 'Email is required')),
	role: v.fallback(v.picklist(rolesEnum), 'teacher'),
	isAllowed: v.optional(v.boolean(), false)
});

export const deleteAllowedStaffSchema = v.object({
	id: v.pipe(v.unknown(), v.transform(Number), v.number('Invalid ID'))
});

export type AddAllowedStaffInput = v.InferOutput<typeof addAllowedStaffSchema>;
export type EditAllowedStaffInput = v.InferOutput<typeof editAllowedStaffSchema>;
