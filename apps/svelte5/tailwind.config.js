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
				secondary: { ...colors.blue, DEFAULT: 'rgb(0,49,113)' },
				primary: { light: colors.green[100], DEFAULT: 'rgb(0,127,92)', dark: colors.green[800] }
			},
			fontFamily: {
				sans: ['"Proxima Nova"', ...defaultTheme.fontFamily.sans]
			}
		}
	}
};

export default config;
