import { type Actions, redirect, type RequestEvent } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const actions = {
	default: async ({  request, locals }: RequestEvent) => {
		const myLocals = locals as MyLocals;
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		if (!email || !password) return ({email, status: 500, errors: "Invalid credentials"})
		const result = await myLocals.supabase.auth.signUp({email, password})
		if (!result.error) {
			redirect(303,"/");
		}
		return ({email, status: 500, errors: "Invalid credentials"})
	},
} satisfies Actions;