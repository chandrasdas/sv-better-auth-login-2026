import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export async function POST({ request }) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return json({ error: 'Token and new password required' }, { status: 400 });
        }

        // Call the internal Server API provided by Better-Auth
        // Passing the original request headers ensures the framework validates IP and Origins properly
        const response = await auth.api.resetPassword({
            body: { token, newPassword },
            headers: request.headers
        });

        if (response?.status) {
            return json({ success: true, message: "Password updated successfully." });
        } else {
            return json({ error: "Failed to reset password, the reset window may have expired." }, { status: 400 });
        }
    } catch (err: unknown) {
        console.error('Password reset Server API error:', err);
        
        let errorMessage = 'Failed to update password. Please try again.';
        const status = 400;

        if (err instanceof APIError) {
            errorMessage = err.message || errorMessage;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        return json({ error: errorMessage }, { status });
    }
}
