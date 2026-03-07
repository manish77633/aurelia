/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'gold': '#CFA052',
				'gold-light': '#D9B06A',
				'gold-dark': '#B8883A',
				'cream': '#FAFAFA',
				'cream-dark': '#F0EBE3',
				'charcoal': '#1A1A1A',
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
			},
		},
	},
	plugins: [],
}


