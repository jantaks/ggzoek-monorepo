import 'dotenv/config';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';
import { likesCounter } from '$lib/stores';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error('Please set the SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

const public_paths = ['/', '/__data.json', '/auth/login', '/auth/register', '/auth/confirm', '/auth/logout'];

function isPathAllowed(path: string) {
	return public_paths.some(allowedPath =>
		path === allowedPath || path.startsWith(allowedPath + '/')
	);
}

export const handle: Handle = async ({ event, resolve }) => {
	const myLocals = event.locals as MyLocals;
	const supabaseClient = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

	myLocals.supabase = supabaseClient;

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	myLocals.getSession = async () => {
		const {
			data: { session }
		} = await supabaseClient.auth.getSession();
		return session;
	};
	const url = new URL(event.request.url);
	if (!await myLocals.getSession() && !isPathAllowed(url.pathname)) {
		let next = '/';
		if (event.request.method === 'POST') {
			const data = await event.request.formData();
			next = data.get('next') as string;
			console.log('NEXT: (HOOK): ', next);
		} else {
			next = url.pathname;
		}
		const location = `/auth/login?next=${encodeURIComponent(next)}`;
		console.log(location);
		redirect(301, location);
	}

	myLocals.userId = (await supabaseClient.auth.getUser()).data.user?.id;

	likesCounter.set(100);


	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};