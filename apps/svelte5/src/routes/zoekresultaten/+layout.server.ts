import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getFacets, getQueryParams, querySearchEngine } from '$lib/search';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const _12hours = 60 * 60 * 12;
	event.setHeaders({
		'cache-control': `max-age=${_12hours}`
	});
	const { query, options } = await getQueryParams(event.url.searchParams);

	return {
		searchResponse: await querySearchEngine(query, options)
	};
};
