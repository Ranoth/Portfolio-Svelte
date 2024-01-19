import {
	FORMSPREE_API_URL,
	NTFY_URL,
	BASIC_AUTH_USERNAME,
	BASIC_AUTH_PASSWORD,
} from "$env/static/private";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

// export const load = (async () => {
// 	return {};
// }) satisfies PageServerLoad;

export const load: PageServerLoad = async () => {
	return {};
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
});

// async function postData(formData: any) {
// 	return await fetch(FORMSPREE_API_URL, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			name: formData.get("name"),
// 			email: formData.get("email"),
// 			subject: formData.get("subject"),
// 			message: formData.get("message"),
// 		}),
// 	})
// 		.then((res) => res.json())
// 		.then((data) => console.log(data))
// 		.catch((err) => console.log(err));
// }

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
			contactSchema.parse(zForm);
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
