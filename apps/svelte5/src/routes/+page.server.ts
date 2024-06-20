import type { PageServerLoad } from './$types.js';
import { getFacets, query } from '$lib/components/searchform/search';
import type { PageServerLoadEvent } from './$types';
import type { Operator } from '$lib/stores/stores.svelte';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	console.log(event.url.searchParams.values());
	const offset = Number(event.url.searchParams.get('offset') || 0);
	const filters = event.url.searchParams.get('filters') || '';
	const searchParams = {
		query: event.url.searchParams.get('fullText') || '',
		offset: offset,
		filters: filters
	};
	console.log(searchParams);
	const searchResponse = await query(searchParams);
	const facets = await getFacets();
	return {
		offset: offset,
		searchResponse: searchResponse,
		facets: facets,
		filterDefinition: _reconstructFilters(filters),
		query: event.url.searchParams.get('fullText') || ''
	};
};

export type FilterDefinition = ReturnType<typeof _reconstructFilters>;

export function _reconstructFilters(filter: string) {
	//get all strings between brackets
	const regex = /\((.*?)\)/g;
	const matches = filter.match(regex);
	console.log(matches);
	return matches?.map((match) => {
		const words = match.split(' ');
		// get all values between quotes
		const values = match.match(/"(.*?)"/g);
		let cleanedValues: string[] = [];
		if (values) {
			// remove quotes
			cleanedValues = values.map((value) => value.replace(/"/g, ''));
		}
		const operator: Operator = (match.includes(' AND ') ? 'AND' : 'OR') as Operator;
		return { facet: words[0].replace('(', ''), filters: cleanedValues, operator: operator };
	});
}
