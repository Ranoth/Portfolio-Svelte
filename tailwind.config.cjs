/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				dark: {
					primary: "#C82828",

					secondary: "#FF005A",

					accent: "#B45A5A",

					neutral: "#191D24",

					"base-100": "#2A303C",

					info: "#3ABFF8",

					success: "#36D399",

					warning: "#FBBD23",

					error: "#F87272",

					// background: "linear-gradient(to right bottom, skyblue, teal)",
				},
			},
		],
	},
};
