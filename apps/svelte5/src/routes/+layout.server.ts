import type { MyLocals } from '$lib/types';
import { getLikesForUser } from '@ggzoek/ggz-drizzle/dist/vacatures';
import type { LayoutServerLoad } from './$types';
import { log } from '@ggzoek/logging/src/logger.js';
import { getSavedSearchesForUser } from '@ggzoek/ggz-drizzle/dist/savedSearches';
import { searchFromSearchParams } from '$lib/stores/formStore.svelte';
import { getFacets, getQueryParams, indexSize, querySearchEngine } from '$lib/search';

export const load: LayoutServerLoad = (async (event) => {
	log.debug(`layout load`);
	event.depends('data:root');
	const _12hours = 60 * 60 * 12;
	// event.setHeaders({
	// 	'cache-control': `max-age=${_12hours}`
	// });
	const { query, options } = await getQueryParams(event.url.searchParams);

	const locals = event.locals as MyLocals;
	let email = undefined;
	let likes = undefined;
	let savedSearches = undefined;
	if (locals.user) {
		log.info(`FOUND SESSION`);
		email = locals.user.email;
		likes = await getLikesForUser(locals.user.id);
		savedSearches = await getSavedSearchesForUser(locals.user.id);
		savedSearches = savedSearches.map((search) => {
			return {
				...search,
				search: searchFromSearchParams(new URLSearchParams(search.searchUrlParams))
			};
		});
	} else {
		log.debug(`NO SESSION FOUND`);
	}
	log.debug(`RETURNING EMAIL: ${email}`);
	const facets = await getFacets();
	return {
		email,
		likes,
		savedSearches,
		facets,
		indexSize: await indexSize(),
		searchResponse: await querySearchEngine(query, options)
	};
}) satisfies LayoutServerLoad;
