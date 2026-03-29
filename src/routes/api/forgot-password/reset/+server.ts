import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

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
    } catch (err: any) {
        console.error('Password reset Server API error:', err);
        // Better Auth throws APIError for validation errors (e.g. short password)
        const errorMessage = err.body?.message || err.message || 'Failed to update password. Please try again.';
        const status = typeof err.status === 'number' ? err.status : 400;
        return json({ error: errorMessage }, { status });
    }
}
