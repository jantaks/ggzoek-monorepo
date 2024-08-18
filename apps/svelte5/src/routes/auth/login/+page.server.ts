import { fail, redirect } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const load = async ({ url }) => {
	const next = url.searchParams.get('next') || '/';
	console.log('NEXT (LOGINPAGE): ', next);
	return { next: next };
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		let next = data.get('next')?.toString();
		next = next ? next : '/';
		const myLocals = locals as MyLocals;
		if (!email || !password) {
			return fail(400, { email, status: 400, errors: 'Vul a.u.b. alle velden in' });
		} else {
			const result = await myLocals.supabase.auth.signInWithPassword({ email, password });
			if (!result.error) {
				console.log('LOGIN SUCCESS, redirecting to: ', next);
				redirect(303, next);
			}
			console.log('LOGIN FAILED: ', result.error);
			return fail(400, { email, status: 500, errors: 'Ongeldige gebruikersnaam en/of wachtwoord' });
		}
	}
};
