import { FORMSPREE_API_URL } from "$env/static/private";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const express = require("express");
const cors = require("cors");

const app = express();

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

async function postData(formData: any) {

	app.use(cors());
	return await app.post(FORMSPREE_API_URL, async (req: any, res: any) => {
		return await fetch(FORMSPREE_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: formData.get("name"),
				email: formData.get("email"),
				subject: formData.get("subject"),
				message: formData.get("message"),
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	});
};

export const actions: Actions = {
	postContact: async ({ request }) => {
		const formData = await request.formData();

		const zForm = Object.fromEntries(formData);

		try {
			const result = contactSchema.parse(zForm);
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
