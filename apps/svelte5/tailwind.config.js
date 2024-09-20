import { colors } from './farrow_ball_colors.js';
import { fontFamily } from 'tailwindcss/defaultTheme';
import fluid, { extract, screens, fontSize } from 'fluid-tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	experimental: {
		classRegex: ['cva\\(([^)]*)\\)', '["\'`]([^"\'`]*).*?["\'`]']
	},
	content: { files: ['./src/**/*.{html,js,svelte,ts}'], extract },
	safelist: ['dark', 'bg-primary/50', 'bg-secondary-900/50'],
	plugins: [fluid],
	theme: {
		screens,
		fontSize,
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
				sans: ['Reddit Sans Condensed'],
				serif: ['Roboto Slab'],
				mono: ['Kalam']
			}
		}
	}
};

export default config;

// Fonts: Proxima Nova,
