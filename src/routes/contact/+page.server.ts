import {
	NTFY_URL,
	BASIC_AUTH_USERNAME,
	BASIC_AUTH_PASSWORD,
	RECAPTCHA_SECRET_KEY,
	RECAPTCHA_SITE_KEY,
} from "$env/static/private";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

export const load: PageServerLoad = async () => {
	return {
		recaptchaSiteKey: RECAPTCHA_SITE_KEY
	};
};

const contactSchema = z.object({
	name: z
		.string({ required_error: "Votre nom est requis" })
		.min(1, { message: "Votre nom est requis" })
		.trim(),
	email: z
		.string({ required_error: "Votre addresse Email est requise" })
		.min(1, { message: "Votre addresse Email est requise" })
		.email()
		.trim(),
	subject: z
		.string({ required_error: "Un sujet est requis" })
		.min(1, { message: "Un sujet est requis" })
		.trim(),
	message: z
		.string({ required_error: "Un message est requis" })
		.min(1, { message: "Un message est requis" })
		.trim(),
	"g-recaptcha-response": z
		.string({ required_error: "Veuillez compléter le CAPTCHA" })
		.min(1, { message: "Veuillez compléter le CAPTCHA" }),
});

async function verifyCaptcha(token: string): Promise<boolean> {
	const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
	
	try {
		const response = await fetch(verifyUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
		});
		
		const data = await response.json();
		return data.success === true;
	} catch (error) {
		console.error('CAPTCHA verification error:', error);
		return false;
	}
}

async function postData(formData: any) {
	return await fetch(NTFY_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${btoa(
				`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`
			)}`,
			Title: "New Contact Form Submission",
			Priority: "4",
		},
		body: `Name: ${formData.get("name")}\nEmail: ${formData.get(
			"email"
		)}\nSubject: ${formData.get("subject")}\nMessage: ${formData.get(
			"message"
		)}`,
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
			// Validate the form data including CAPTCHA token
			const validatedData = contactSchema.parse(zForm);
			
			// Verify CAPTCHA
			const captchaToken = validatedData["g-recaptcha-response"];
			const isCaptchaValid = await verifyCaptcha(captchaToken);
			
			if (!isCaptchaValid) {
				return {
					data: zForm,
					errors: {
						"g-recaptcha-response": ["Veuillez compléter le CAPTCHA correctement"]
					},
					success: false,
				};
			}

			await postData(formData);
			return {
				success: true,
			};
		} catch (error: any) {
			const { fieldErrors: errors } = error.flatten();
			const data = zForm;
			return {
				data,
				errors,
				success: false,
			};
		}
	},
};
