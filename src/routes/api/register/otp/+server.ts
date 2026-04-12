import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verification } from '$lib/server/db/schema';
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
            // Check if user is in allowedStaff
            const allowedUser = await db.query.allowedStaff.findFirst({
                where: (staff, { eq }) => eq(staff.email, email)
            });

            if (!allowedUser || !allowedUser.isAllowed) {
                return json({ error: 'Email not authorized for registration' }, { status: 403 });
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
                    <h2 style="color: #333; text-align: center;">Verify Your Registration</h2>
                    <p style="color: #555; font-size: 16px;">Hello ${allowedUser.name || 'Staff Member'},</p>
                    <p style="color: #555; font-size: 16px;">Please use the following 6-digit code to complete your registration:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #007bff; background: #f0f8ff; padding: 10px 20px; border-radius: 4px;">${generatedOtp}</span>
                    </div>
                    <p style="color: #777; font-size: 14px; text-align: center;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `;

            await sendEmail({
                to: email,
                subject: 'Registration Verification Code - Darpan Portal',
                html
            });

            return json({ success: true, name: allowedUser.name || '' });
        }

        if (action === 'verify') {
            if (!otp) {
                return json({ error: 'OTP is required' }, { status: 400 });
            }

            // Find verification record
            const record = await db.query.verification.findFirst({
                where: (ver, { eq, and }) => and(
                    eq(ver.identifier, email),
                    eq(ver.value, otp)
                )
            });

            if (!record) {
                return json({ error: 'Invalid verification code' }, { status: 400 });
            }

            if (new Date() > record.expiresAt) {
                return json({ error: 'Verification code expired' }, { status: 400 });
            }

            // Delete the OTP after successful verification so it can't be reused
            await db.delete(verification).where(eq(verification.id, record.id));

            return json({ success: true });
        }

        return json({ error: 'Invalid action' }, { status: 400 });
    } catch (err: unknown) {
        console.error('OTP error:', err);
        return json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
    }
}
