import type { PageServerLoad } from './$types.js';
import { getFacets, query } from '$lib/components/searchform/search';
import type { PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	console.log(event.url.searchParams.values());
	const offset = event.url.searchParams.get('offset') || 0;
	const searchParams = {
		query: event.url.searchParams.get('fullText') || '',
		offset: Number(offset),
		filters: event.url.searchParams.get('filters') || ''
	};
	console.log(searchParams);
	const searchResponse = await query(searchParams);
	const facets = await getFacets();
	return {
		searchResponse: searchResponse,
		facets: facets,
		query: event.url.searchParams.get('fullText') || ''
	};
};
