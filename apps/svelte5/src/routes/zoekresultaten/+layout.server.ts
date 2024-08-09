import type { MyLocals } from '$lib/types';
import { getLikesForUser } from '@ggzoek/ggz-drizzle/dist/vacatures';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (async (event) => {
	const myLocals = event.locals as MyLocals;
	const session = await myLocals.getSession();
	let email = undefined;
	let likes = undefined;
	if (session && session.user) {
		console.log(`FOUND SESSION`);
		email = session.user.email;
		likes = await getLikesForUser(session.user.id);
	} else {
		console.log(`NO SESSION FOUND`);
	}
	console.log(`RETURNING EMAIL: ${email}`);
	return { email, likes };
}) satisfies LayoutServerLoad;
