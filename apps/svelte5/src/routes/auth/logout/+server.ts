import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';

export const GET = async ({ locals }: RequestEvent) => {
	console.log('logging out');
	const myLocals = locals as MyLocals;
	await myLocals.supabase.auth.signOut();
	redirect(303, '/?reload=true');
};
