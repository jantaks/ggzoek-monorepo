import { redirect, type RequestEvent } from '@sveltejs/kit';
import supabase from '@supabase/supabase-js';


type MyLocals = {
	supabase: supabase.SupabaseClient;
};

export const GET = async ({ locals }: RequestEvent) => {
	console.log('logging out');
	const myLocals = locals as MyLocals;
	await myLocals.supabase.auth.signOut();
	redirect(303, '/');
};
