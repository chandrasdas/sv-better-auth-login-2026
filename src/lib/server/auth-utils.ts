import { error, redirect } from '@sveltejs/kit';
import type { ROLES } from '$lib/server/db/schema';

type Role = (typeof ROLES)[number];

/**
 * Ensures the user is authenticated.
 * Redirects to /login if not.
 * Returns the typed user (never undefined).
 */
export function requireAuth(locals: App.Locals) {
	if (!locals.user || !locals.session) {
		redirect(302, '/login');
	}
	return locals.user;
}

/**
 * Ensures the user has one of the specified roles.
 * Throws 403 if the user's role is not in the allowed list.
 * Returns the typed user (never undefined).
 */
export function requireRole(locals: App.Locals, ...roles: Role[]) {
	const user = requireAuth(locals);
	if (!roles.includes(user.role as Role)) {
		error(403, 'You do not have permission to perform this action');
	}
	return user;
}
