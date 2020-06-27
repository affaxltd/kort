const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	purge: ["./components/**/*.tsx", "./pages/**/*.tsx", "./styles/**/*.scss"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {},
	plugins: [require("@tailwindcss/ui")],
};
