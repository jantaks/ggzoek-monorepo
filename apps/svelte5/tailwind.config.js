import colors from 'tailwindcss/colors.js';
import { fontFamily } from 'tailwindcss/defaultTheme';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark', 'bg-primary/50', 'bg-secondary-900/50'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				secondary: { ...colors.indigo, DEFAULT: colors.indigo[400] },
				primary: { light: colors.pink[100], DEFAULT: colors.pink[400], dark: colors.pink[800] }
			},
			fontFamily: {
				sans: ['"Proxima Nova"', ...defaultTheme.fontFamily.sans]
			}
		}
	}
};

export default config;
