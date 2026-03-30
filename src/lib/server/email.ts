import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT) || 465,
	secure: true,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	}
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
	try {
		const info = await transporter.sendMail({
			from: `"Darpan Portal" <${env.SMTP_USER}>`,
			to,
			subject,
			html
		});
		console.log('Message sent: %s', info.messageId);
		return info;
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}
