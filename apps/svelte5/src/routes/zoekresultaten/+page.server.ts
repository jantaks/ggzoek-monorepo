import { getFacets, getQueryParams, querySearchEngine } from '$lib/search';
import { log } from '@ggzoek/logging/dist/logger.js';
import type { PageServerLoad, PageServerLoadEvent } from './$types.js';
import type { MyLocals } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { createSavedSearch } from '@ggzoek/ggz-drizzle/dist/savedSearches';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const { email } = await event.parent();
	log.debug(`zoekresultaten page load. Email: ${email}`);
	const _12hours = 60 * 60 * 12;
	event.setHeaders({
		'cache-control': `max-age=${_12hours}`
	});
	const { query, options } = await getQueryParams(event.url.searchParams);
	let facets = await getFacets();
	return {
		facets: facets,
		searchResponse: await querySearchEngine(query, options)
	};
};

/*
 The MEILI HITSPERPAGE LIMIT is 1000, the default is 20.
 In theory the number of results for a saved Searches could increase dramatically after creation,
 so we need to be able to handle this.
 At creation time the maximum is MAXRESULTS (100)
*/
const HITS_PER_PAGE = 1000;

export const actions = {
	saveSearch: async (event) => {
		const locals = event.locals as MyLocals;
		const userId = locals.user?.id;
		if (!userId) {
			return redirect(301, '/auth/login');
		}
		const formData = await event.request.formData();

		let searchParams = formData.get('searchParams');
		if (searchParams === null) {
			return error(400, 'searchParams is required');
		}
		log.info(`saving search with searchParams: ${searchParams}`);
		const urlSearchParams = new URLSearchParams(searchParams as string);
		const { query, options } = await getQueryParams(urlSearchParams);

		const updatedOptions = {
			...options,
			offset: undefined,
			hitsPerPage: HITS_PER_PAGE,
			attributesToRetrieve: ['urlHash'],
			noLimit: true
		};
		const results = await querySearchEngine(query, updatedOptions);
		const urlHashes = results.hits.filter((hit) => hit !== undefined).map((hit) => hit.urlHash);
		const id = await createSavedSearch(searchParams.toString(), userId, urlHashes as string[]);
		return { id };
	}
};
