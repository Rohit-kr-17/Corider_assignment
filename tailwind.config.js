/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				top: "0 -1px 1px rgba(0, 0, 0, 0.2)",
				// You can adjust the values (e.g., the shadow size and color) as needed.
			},
		},
	},
	plugins: [],
};
