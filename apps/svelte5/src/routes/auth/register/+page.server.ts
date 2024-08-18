import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const actions = {
	default: async ({ request, locals }: RequestEvent) => {
		const myLocals = locals as MyLocals;
		const form = await request.formData();
		const email = form.get('email') as string;
		const password1 = form.get('password1') as string;
		if (password1 !== form.get('password2')) return fail(400, { email, passwordMismatch: true });
		const { data, error } = await myLocals.supabase.auth.signUp({ email, password: password1 });
		console.log('SIGNUP RESULT: ', data);
		if (data.user && data.user.identities && data.user.identities.length === 0) {
			return fail(400, { email, error: 'Er bestaat al een account met deze gebruikersnaam' });
		}
		if (!error) {
			redirect(303, '/');
		} else {
			console.log(error);
			return fail(400, { email, error: error.message });
		}
	}
};
