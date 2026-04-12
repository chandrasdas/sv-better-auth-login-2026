import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, verification } from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST({ request }) {
    try {
        const { action, email, otp } = await request.json();

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }

        if (action === 'send') {
            const foundUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.email, email)
            });

            if (!foundUser) {
                return json({ error: 'No account found with this email. Please verify the address or contact the school admin if you believe this is an error.' }, { status: 404 });
            }

            // Check if account is locked
            if (foundUser.lockedUntil && new Date() < foundUser.lockedUntil) {
                return json({ error: 'Account is locked due to too many failed attempts. Try again later.' }, { status: 423 });
            }

            // Generate 6-digit OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Set expiration to 10 minutes from now
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Delete any existing verification codes for this email to prevent overlap
            await db.delete(verification).where(eq(verification.identifier, email));

            // Generate a random UUID
            const verificationId = crypto.randomUUID();

            // Store in verification table
            await db.insert(verification).values({
                id: verificationId,
                identifier: email,
                value: generatedOtp,
                expiresAt: expiresAt,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Send email
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="color: #555; font-size: 16px;">Hello ${foundUser.name || 'User'},</p>
                    <p style="color: #555; font-size: 16px;">Please use the following 6-digit code to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #007bff; background: #f0f8ff; padding: 10px 20px; border-radius: 4px;">${generatedOtp}</span>
                    </div>
                    <p style="color: #777; font-size: 14px; text-align: center;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `;

            await sendEmail({
                to: email,
                subject: 'Password Reset OTP - Darpan Portal',
                html
            });

            return json({ success: true });
        }

        if (action === 'verify') {
            if (!otp) {
                return json({ error: 'OTP is required' }, { status: 400 });
            }

            const foundUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.email, email)
            });

            if (!foundUser) {
                 return json({ error: 'User not found' }, { status: 404 });
            }
            
            if (foundUser.lockedUntil && new Date() < foundUser.lockedUntil) {
                return json({ error: 'Account is locked. Try again later.' }, { status: 423 });
            }

            // Find verification record
            const record = await db.query.verification.findFirst({
                where: (ver, { eq, and }) => and(
                    eq(ver.identifier, email),
                    eq(ver.value, otp)
                )
            });

            // If invalid or expired
            if (!record || new Date() > record.expiresAt) {
                 let attempts = foundUser.failedOtpAttempts + 1;
                 let lockedUntil = foundUser.lockedUntil;
                 let errorMsg = !record ? 'Invalid verification code' : 'Verification code expired';

                 if (attempts >= 5) {
                     lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // lock for 24 hours
                     attempts = 0; // reset for next time after unlock
                     errorMsg = 'Account locked for 24 hours due to too many failed attempts.';
                 }

                 await db.update(user).set({
                     failedOtpAttempts: attempts,
                     lockedUntil
                 }).where(eq(user.id, foundUser.id));

                 return json({ error: errorMsg }, { status: 400 });
            }

            // Success!! Reset the failed attempts
            await db.update(user).set({
                failedOtpAttempts: 0,
                lockedUntil: null
            }).where(eq(user.id, foundUser.id));

            // Delete the OTP after successful verification so it can't be reused
            await db.delete(verification).where(eq(verification.id, record.id));

            // Generate a Better-Auth compatible reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            await db.insert(verification).values({
                id: crypto.randomUUID(),
                identifier: `reset-password:${resetToken}`,
                value: foundUser.id,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins for them to type new password
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return json({ success: true, verifiedToken: resetToken });
        }

        return json({ error: 'Invalid action' }, { status: 400 });
    } catch (err: unknown) {
        console.error('OTP error:', err);
        return json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
    }
}
