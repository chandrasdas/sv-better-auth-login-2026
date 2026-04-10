import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
//import { emailVerification } from 'better-auth/plugins';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	trustedOrigins: ['http://localhost:5173'],
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite', schema }),
	emailAndPassword: { enabled: true },
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "teacher"
			}
		}
	},
	
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					// Check if user is in allowedStaff and isAllowed is true
					const allowedUser = await db.query.allowedStaff.findFirst({
						where: (staff, { eq }) => eq(staff.email, user.email)
					});
					
					if (!allowedUser || !allowedUser.isAllowed) {
						throw new Error("You are not authorized to create an account.");
					}
					
					// Set the user's role from the allowedStaff table
					user.role = allowedUser.role;
					
					// Mark email as verified since they already passed the OTP check
					user.emailVerified = true;
					
					return {
						data: user
					};
				}
			}
		}
	},
	
	// Disabled auto-send on signup since we verify BEFORE signup via OTP
	emailVerification: {
		sendOnSignUp: false,
	},

	plugins: [
		sveltekitCookies(getRequestEvent) // SvelteKit cookies must stay here
	]
});
