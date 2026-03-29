import { db } from '$lib/server/db';
import { allowedStaff, verification } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail } from '$lib/server/email';
import { fail } from '@sveltejs/kit';
import crypto from 'crypto';

export const actions = {
    default: async ({ request, url }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString().toLowerCase();

        if (!email) return fail(400, { message: "Email is required" });

        // 1. Check the whitelist
        const [staff] = await db.select().from(allowedStaff)
            .where(and(eq(allowedStaff.email, email), eq(allowedStaff.isAllowed, true)));

        if (!staff) {
            return fail(403, { message: "Access Denied. Your email is not on the approved list." });
        }

        // 2. Create a verification token for the password setup link
        const token = crypto.randomBytes(32).toString('hex');
        await db.insert(verification).values({
            id: crypto.randomUUID(),
            identifier: email,
            value: token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
        });

        // 3. Send the email
        const setupUrl = `${url.origin}/register/setup-password?token=${token}&email=${email}`;
        await sendEmail({
            to: email,
            subject: "Complete your Darpan Registration",
            html: `<p>Hello ${staff.name}, click <a href="${setupUrl}">here</a> to set your password.</p>`
        });

        return { success: true };
    }
};