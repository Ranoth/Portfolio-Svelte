// import { BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME, NTFY_URL, RECAPTCHA_SECRET_KEY } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';

const NTFY_URL = process.env.NTFY_URL;
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Base schema without reCAPTCHA
const baseContactSchema = z.object({
	name: z
		.string({ required_error: 'Votre nom est requis' })
		.min(1, { message: 'Votre nom est requis' })
		.trim(),
	email: z
		.string({ required_error: 'Votre addresse Email est requise' })
		.min(1, { message: 'Votre addresse Email est requise' })
		.email()
		.trim(),
	subject: z
		.string({ required_error: 'Un sujet est requis' })
		.min(1, { message: 'Un sujet est requis' })
		.trim(),
	message: z
		.string({ required_error: 'Un message est requis' })
		.min(1, { message: 'Un message est requis' })
		.trim(),
});

// Schema with reCAPTCHA validation
const contactSchemaWithCaptcha = baseContactSchema.extend({
	'g-recaptcha-response': z
		.string({ required_error: 'Protection anti-spam requise - veuillez réessayer' })
		.min(1, { message: 'Vérification de sécurité manquante' })
});

// Use appropriate schema based on whether reCAPTCHA is configured
const contactSchema = RECAPTCHA_SECRET_KEY ? contactSchemaWithCaptcha : baseContactSchema;

async function verifyCaptcha(token: string): Promise<{ success: boolean; error?: string }> {
	// If no secret key is configured, skip CAPTCHA verification
	if (!RECAPTCHA_SECRET_KEY) {
		console.warn('reCAPTCHA secret key not configured - skipping verification');
		return { success: true };
	}

	if (!token) {
		return { success: false, error: 'Token de sécurité manquant' };
	}

	const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

	try {
		const response = await fetch(verifyUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
		});

		if (!response.ok) {
			console.error('reCAPTCHA API request failed:', response.status, response.statusText);
			return { success: false, error: 'Service de vérification temporairement indisponible' };
		}

		const data = await response.json();
		console.log('reCAPTCHA response:', { 
			success: data.success, 
			score: data.score, 
			action: data.action,
			errors: data['error-codes']
		});
		
		// For reCAPTCHA v3, check success first
		if (!data.success) {
			const errorCodes = data['error-codes'] || [];
			console.error('reCAPTCHA verification failed:', errorCodes);
			
			// Handle specific error codes
			if (errorCodes.includes('invalid-input-secret')) {
				return { success: false, error: 'Configuration du service anti-spam incorrecte' };
			}
			if (errorCodes.includes('invalid-input-response')) {
				return { success: false, error: 'Token de sécurité invalide - veuillez réessayer' };
			}
			if (errorCodes.includes('timeout-or-duplicate')) {
				return { success: false, error: 'Token de sécurité expiré - veuillez réessayer' };
			}
			
			return { success: false, error: 'Vérification de sécurité échouée - veuillez réessayer' };
		}
		
		// Check score for v3 (0.5 is a reasonable threshold)
		if (data.score !== undefined) {
			if (data.score < 0.5) {
				console.log('reCAPTCHA score too low:', data.score);
				return { success: false, error: 'Vérification de sécurité échouée - comportement suspect détecté' };
			}
		}
		
		// Check action matches (optional but recommended for v3)
		if (data.action && data.action !== 'contact_form') {
			console.log('reCAPTCHA action mismatch:', data.action, 'expected: contact_form');
			return { success: false, error: 'Contexte de sécurité invalide' };
		}
		
		return { success: true };
		
	} catch (error) {
		console.error('CAPTCHA verification error:', error);
		return { success: false, error: 'Service de vérification temporairement indisponible' };
	}
}

async function postData(formData: FormData) {
	try {
		if (!NTFY_URL || !BASIC_AUTH_USERNAME || !BASIC_AUTH_PASSWORD) {
			console.warn('Notification service not configured - message will not be sent');
			return;
		}

		const response = await fetch(NTFY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
				Authorization: `Basic ${btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`)}`,
				Title: 'New Contact Form Submission',
				Priority: '4'
			},
			body: `Name: ${formData.get('name')}\nEmail: ${formData.get(
				'email'
			)}\nSubject: ${formData.get('subject')}\nMessage: ${formData.get('message')}`
		});

		if (!response.ok) {
			throw new Error(`Notification service responded with status: ${response.status}`);
		}

		const result = await response.json();
		console.log('Notification sent successfully:', result);
		return result;
	} catch (error) {
		console.error('Failed to send notification:', error);
		throw error;
	}
}

/** @type {import('./$types').Actions} */
export const actions: Actions = {
	postContact: async ({ request }) => {
		const formData = await request.formData();
		const zForm = Object.fromEntries(formData);

		try {
			// Handle CAPTCHA verification before Zod validation to avoid required_error
			if (RECAPTCHA_SECRET_KEY) {
				const captchaToken = (zForm as any)['g-recaptcha-response'];
				console.log('Received reCAPTCHA token:', captchaToken ? 'Token present' : 'No token');
				
				if (!captchaToken) {
					console.warn('No reCAPTCHA token received in form submission');
					return {
						data: zForm,
						errors: {
							'g-recaptcha-response': ['Protection anti-spam requise - veuillez réessayer']
						},
						success: false
					};
				}

				const captchaResult = await verifyCaptcha(captchaToken);
				if (!captchaResult.success) {
					console.error('reCAPTCHA verification failed:', captchaResult.error);
					return {
						data: zForm,
						errors: {
							'g-recaptcha-response': [captchaResult.error || 'Échec de la vérification anti-spam']
						},
						success: false
					};
				}
				
				console.log('reCAPTCHA verification successful');
			}

			// Validate the form data (this will now pass for reCAPTCHA since we handled it above)
			const validatedData = contactSchema.parse(zForm);

			// Send notification
			try {
				await postData(formData);
				console.log('Contact form submitted successfully');
			} catch (notificationError) {
				console.error('Failed to send notification, but form was valid:', notificationError);
				// Continue anyway - don't fail the form submission if notification fails
			}

			return {
				success: true
			};
		} catch (error: any) {
			console.error('Form validation error:', error);
			const { fieldErrors: errors } = error.flatten();
			const data = zForm;
			return {
				data,
				errors,
				success: false
			};
		}
	}
};
