import type { MyLocals } from '$lib/types';
import { getLikesForUser } from '@ggzoek/ggz-drizzle/dist/vacatures';
import type { LayoutServerLoad } from './$types';
import { log } from '@ggzoek/logging/src/logger.js';

export const load: LayoutServerLoad = (async (event) => {
	const locals = event.locals as MyLocals;
	let email = undefined;
	let likes = undefined;
	if (locals.user) {
		log.info(`FOUND SESSION`);
		email = locals.user.email;
		likes = await getLikesForUser(locals.user.id);
	} else {
		log.debug(`NO SESSION FOUND`);
	}
	log.debug(`RETURNING EMAIL: ${email}`);
	return { email, likes };
}) satisfies LayoutServerLoad;
