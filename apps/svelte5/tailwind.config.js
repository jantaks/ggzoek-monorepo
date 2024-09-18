import { colors } from './farrow_ball_colors.js';
import { fontFamily } from 'tailwindcss/defaultTheme';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	experimental: {
		classRegex: ['cva\\(([^)]*)\\)', '["\'`]([^"\'`]*).*?["\'`]']
	},
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
				secondary: { ...colors.bluemaize },
				primary: {
					...colors.ciarayellow,
					light: colors.ciarayellow[100],
					dark: colors.ciarayellow[900]
				},
				grijs: { ...colors.parmagray }
			},
			fontFamily: {
				sans: ['Reddit Sans Condensed', ...defaultTheme.fontFamily.sans],
				serif: ['Roboto Slab', ...defaultTheme.fontFamily.serif],
				mono: ['Kalam', ...defaultTheme.fontFamily.mono]
			}
		}
	}
};

export default config;

// Fonts: Proxima Nova,
