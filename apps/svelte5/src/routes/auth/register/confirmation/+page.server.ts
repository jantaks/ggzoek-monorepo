import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const load = (async (event) => {
	const locals = event.locals as MyLocals;
	const code = event.url.searchParams.get('code');
	const error_description = event.url.searchParams.get('error_description');
	if (error_description) {
		error(404, { message: error_description });
	}
	if (!code) {
		error(404, { message: 'Geen geldige authorisatiecode' });
	}
	console.log('Email confirmation. Verifying code: ', code);
	const { data, error: err } = await locals.supabase.auth.exchangeCodeForSession(code);
	console.log('Email confirmation. Verifying code result: ', data, err);
	if (err) {
		console.log('Error verifying code: ', err);
		error(404, { message: err.message });
	}
}) satisfies PageServerLoad;

//http://localhost:5173/auth/register/confirmation?code=a293f58a-096b-4c14-844d-6f2add79a799&token_hash=pkce_213ef6ab07a36e2a03fbc1546f971b6b3a656b8678764d08f22eaeb5