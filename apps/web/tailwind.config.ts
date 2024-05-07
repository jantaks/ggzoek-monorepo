import { join } from 'path';
import type { Config } from 'tailwindcss';
import { addDynamicIconSelectors } from '@iconify/tailwind';
// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
// @ts-ignore
import forms from '@tailwindcss/forms';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
				'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {}
	},
	plugins: [
		// 4. Append the Skeleton plugin (after other plugins)
		forms,
		addDynamicIconSelectors(),
		skeleton({
			themes: { preset: ['skeleton', 'modern', 'gold-nouveau'] }
		})
	]
} satisfies Config;

export default config;

