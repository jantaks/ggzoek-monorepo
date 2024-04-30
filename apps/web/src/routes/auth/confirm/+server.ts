import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { type EmailOtpType, type VerifyTokenHashParams } from '@supabase/supabase-js';
import type { MyLocals } from '$lib/types';

const respondWithError = error;

export const GET: (event: RequestEvent) => Promise<void> = async ({ url, locals }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const myLocals: MyLocals = locals as MyLocals;
	if (token_hash && type && myLocals.supabase) {
		const auth = myLocals.supabase.auth;
		const verifyParams: VerifyTokenHashParams = {
			type,
			token_hash
		};
		const { data, error } = await auth.verifyOtp(verifyParams);
		if (!error) {
			redirect(303, '/');
		} else {
			respondWithError(500, error);
		}
	}
	respondWithError(500, 'Oeps, er is iets verkeerd gegaan... Probeer het opnieuw.');
};