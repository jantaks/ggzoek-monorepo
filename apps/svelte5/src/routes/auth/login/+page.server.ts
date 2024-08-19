import { fail, redirect } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const actions = {
	login: async ({ request, locals }) => {
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
	},
	reset: async (event) => {
		const locals = event.locals as MyLocals;
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString();
		if (!email) {
			return fail(400, { email, status: 400, errors: 'Vul a.u.b. een e-mailadres in' });
		}
		const origin = event.url.origin;
		const { data, error } = await locals.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${origin}/auth/resetpassword/form`
		});
		if (error) {
			return fail(400, {
				email,
				status: 500,
				errors: 'Er is iets misgegaan, probeer het later opnieuw. ' + error.message
			});
		}

		return redirect(303, `resetpassword?email=${email}`);
	}
};
