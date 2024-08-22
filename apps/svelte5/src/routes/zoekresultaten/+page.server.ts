import { getFacets, getQueryParams, query } from '$lib/search';
import { log } from '@ggzoek/logging/dist/logger.js';
import type { PageServerLoad, PageServerLoadEvent } from './$types.js';
import type { MyLocals } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { saveSearch } from '@ggzoek/ggz-drizzle/dist/savedSearches';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const { email } = await event.parent();
	log.debug(`zoekresultaten page load. Email: ${email}`);
	const _12hours = 60 * 60 * 12;
	event.setHeaders({
		'cache-control': `max-age=${_12hours}`
	});
	const searchParams = await getQueryParams(event.url.searchParams);
	log.info(searchParams);
	let facets = await getFacets();
	return {
		facets: facets,
		searchResponse: await query(searchParams)
	};
};

export const actions = {
	saveSearch: async (event) => {
		console.debug(
			`${new Date().toLocaleTimeString()} [+page.server.ts - e6701fa3] : Saving search `
		);
		const locals = event.locals as MyLocals;
		const userId = locals.user?.id;
		if (!userId) {
			console.debug(
				`${new Date().toLocaleTimeString()} [+server.ts - a8df235b] : Unauthorized request to ${event.request.url} `
			);
			return redirect(301, '/auth/login');
		}
		const formData = await event.request.formData();
		const id = await saveSearch(formData.get('searchParams') as string, userId);
		return { id };
	}
};
