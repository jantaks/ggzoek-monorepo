import { error, fail, type RequestEvent } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export async function load(event: RequestEvent) {
	const locals = event.locals as MyLocals;
	if (locals.user) {
		return {};
	}
	const code = event.url.searchParams.get('code');
	const error_description = event.url.searchParams.get('error_description');
	if (error_description) {
		error(404, { message: error_description });
	}
	if (!code) {
		error(404, { message: 'No code provided' });
	}
	console.log('Verifying code: ', code);
	const { data, error: err } = await locals.supabase.auth.exchangeCodeForSession(code);
	if (err) {
		error(404, { message: err.message });
	}
	return { data };
}

export const actions = {
	default: async (event: RequestEvent) => {
		const locals = event.locals as MyLocals;
		const token = event.url.searchParams.get('token');
		console.log(token);
		const form = await event.request.formData();
		const email = form.get('email') as string;
		const password1 = form.get('password1') as string;
		if (password1 !== form.get('password2')) {
			return fail(400, { error: 'De wachtwoorden komen niet overeen.' });
		}
		const { data, error: err } = await locals.supabase.auth.updateUser({
			email,
			password: password1
		});
		if (err) {
			return fail(400, { error: err.message });
		}
		return { success: true };
	}
};

// https://qxinxsmiwfvlvprnouva.supabase.co/auth/v1/verify?token=pkce_338e2230ca731ac7ad9178ba5461c8c7c3c1167bc28023ea18b41261&type=recovery&redirect_to=http://localhost:5173/auth/resetpassword/form