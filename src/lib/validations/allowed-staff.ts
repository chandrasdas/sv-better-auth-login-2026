import { z } from 'zod';

export const addAllowedStaffSchema = z.object({
	name: z.string().optional().default(''),
	email: z.string().min(1, { error: 'Email is required' }),
	role: z.enum(['admin', 'teacher', 'staff']).default('teacher'),
	isAllowed: z.boolean().default(true)
});

export const editAllowedStaffSchema = z.object({
	id: z.coerce.number({ error: 'Invalid ID' }),
	name: z.string().optional().default(''),
	email: z.string().min(1, { error: 'Email is required' }),
	role: z.enum(['admin', 'teacher', 'staff']).default('teacher'),
	isAllowed: z.boolean().default(false)
});

export const deleteAllowedStaffSchema = z.object({
	id: z.coerce.number({ error: 'Invalid ID' })
});

export type AddAllowedStaffInput = z.infer<typeof addAllowedStaffSchema>;
export type EditAllowedStaffInput = z.infer<typeof editAllowedStaffSchema>;
