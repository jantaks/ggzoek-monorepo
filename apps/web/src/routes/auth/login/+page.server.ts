import { type Actions, redirect } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const load = async ({ url }) => {
	const next = url.searchParams.get('next') || '/';
	console.log("NEXT (LOGINPAGE): ", next);
	return { next: next };
};

export const actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		let next = data.get('next')?.toString();
		next = next ? next : '/';
		const myLocals = locals as MyLocals;
		if (myLocals.supabase && email && password) {
			const result = await myLocals.supabase.auth.signInWithPassword({ email, password });
			if (!result.error) {
				redirect(303, next);
			}
			return ({ email, status: 500, errors: 'Ongeldige gebruikersnaam en/of wachtwoord' });
		}
		return ({ email, status: 500, errors: 'Oeps, er is iets verkeerd gegaan. Probeer het opnieuw.' });
	}
} satisfies Actions;