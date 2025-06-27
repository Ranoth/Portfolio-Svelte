import { BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME, NTFY_URL, RECAPTCHA_SECRET_KEY } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';

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
		.string({ required_error: 'Veuillez compléter le CAPTCHA' })
		.min(1, { message: 'Veuillez compléter le CAPTCHA' })
});

// Use appropriate schema based on whether reCAPTCHA is configured
const contactSchema = RECAPTCHA_SECRET_KEY ? contactSchemaWithCaptcha : baseContactSchema;

async function verifyCaptcha(token: string): Promise<boolean> {
	// If no secret key is configured, skip CAPTCHA verification
	if (!RECAPTCHA_SECRET_KEY) {
		return true;
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

		const data = await response.json();
		
		// For reCAPTCHA v3, also check the score and action
		if (data.success) {
			// Check if score is above threshold (0.5 is a common threshold)
			if (data.score && data.score < 0.5) {
				console.log('reCAPTCHA score too low:', data.score);
				return false;
			}
			
			// Check if action matches (optional but recommended)
			if (data.action && data.action !== 'contact_form') {
				console.log('reCAPTCHA action mismatch:', data.action);
				return false;
			}
			
			return true;
		}
		
		console.log('reCAPTCHA verification failed:', data['error-codes']);
		return false;
	} catch (error) {
		console.error('CAPTCHA verification error:', error);
		return false;
	}
}

async function postData(formData: any) {
	return await fetch(NTFY_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`)}`,
			Title: 'New Contact Form Submission',
			Priority: '4'
		},
		body: `Name: ${formData.get('name')}\nEmail: ${formData.get(
			'email'
		)}\nSubject: ${formData.get('subject')}\nMessage: ${formData.get('message')}`
	})
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
}

/** @type {import('./$types').Actions} */
export const actions: Actions = {
	postContact: async ({ request }) => {
		const formData = await request.formData();
		const zForm = Object.fromEntries(formData);

		try {
			// Validate the form data
			const validatedData = contactSchema.parse(zForm);

			// Verify CAPTCHA if it's enabled
			if (RECAPTCHA_SECRET_KEY) {
				const captchaToken = (zForm as any)['g-recaptcha-response'];
				if (!captchaToken) {
					return {
						data: zForm,
						errors: {
							'g-recaptcha-response': ['Veuillez compléter le CAPTCHA']
						},
						success: false
					};
				}

				const isCaptchaValid = await verifyCaptcha(captchaToken);
				if (!isCaptchaValid) {
					return {
						data: zForm,
						errors: {
							'g-recaptcha-response': ['Veuillez compléter le CAPTCHA correctement']
						},
						success: false
					};
				}
			}

			await postData(formData);
			return {
				success: true
			};
		} catch (error: any) {
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
