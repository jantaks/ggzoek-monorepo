import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';
import { log } from '@ggzoek/logging/src/logger.js';
import { minimatch } from 'minimatch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error('Please set the SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

const protectedPaths: Record<string, string> = {
	'/bewaard': 'U moet ingelogd zijn om uw bewaarde vacatures te kunnen bekijken',
	'**/saveSearch': 'U moet inloggen om een zoekopdracht te kunnen bewaren',
	'**/saveVacature': 'U moet inloggen om vacatures op te kunnen slaan',
	'**/saved_searches': 'U moet ingelogd zijn om uw bewaarde zoekopdrachten te kunnen bekijken'
};

export function authRequired(path: string) {
	for (const key of Object.keys(protectedPaths)) {
		if (minimatch(path, key)) {
			return { required: true, message: protectedPaths[key] };
		}
	}
	return { required: false, message: '' };
}

export const handle: Handle = async ({ event, resolve }) => {
	const { required, message } = authRequired(event.request.url);
	log.info(`Hook handling: ${event.request.url}. Protected? ${required}. Message: ${message}`);
	const locals = event.locals as MyLocals;
	const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * Note: You have to add the `path` variable to the
			 * set and remove method due to sveltekit's cookie API
			 * requiring this to be set, setting the path to an empty string
			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	locals.supabase = supabase;

	const { data, error } = await supabase.auth.getUser();

	if (error) {
		log.info(`Could not get user: ${error.message}`);
	}

	const user = data.user;
	locals.user = data.user;

	if (!user && required) {
		let next: string;
		next = new URL(event.request.url).pathname;
		const location = `/auth/login?next=${encodeURIComponent(next)}&message=${message}`;
		log.debug(`${message}. Redirecting to: ${location}`);
		return redirect(301, location);
	}
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
