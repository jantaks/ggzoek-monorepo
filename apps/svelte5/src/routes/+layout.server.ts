import type { MyLocals } from '$lib/types';
import { getLikesForUser } from '@ggzoek/ggz-drizzle/dist/vacatures';
import type { LayoutServerLoad } from './$types';
import { log } from '@ggzoek/logging/src/logger.js';
import { getSavedSearchesForUser } from '@ggzoek/ggz-drizzle/dist/savedSearches';

export const load: LayoutServerLoad = (async (event) => {
	log.debug(`layout load`);
	event.depends('data:root');

	const locals = event.locals as MyLocals;
	let email = undefined;
	let likes = undefined;
	let savedSearches = undefined;
	if (locals.user) {
		log.info(`FOUND SESSION`);
		email = locals.user.email;
		likes = await getLikesForUser(locals.user.id);
		savedSearches = await getSavedSearchesForUser(locals.user.id);
	} else {
		log.debug(`NO SESSION FOUND`);
	}
	log.debug(`RETURNING EMAIL: ${email}`);
	return { email, likes, savedSearches };
}) satisfies LayoutServerLoad;
