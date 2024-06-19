import type { PageServerLoad } from './$types.js';
import { query } from '$lib/components/searchform/search';
import type { PageServerLoadEvent } from './$types';
import { type facet, facets } from '$lib/types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const searchParams = {
		query: event.url.searchParams.get('fullText') || '',
		offset: 1,
		filters: createFilters(event.url.searchParams)
	};
	console.log(searchParams);
	const searchResponse = await query(searchParams);
	return { searchResponse: searchResponse };
};

function createFilters(params: URLSearchParams) {
	const filters: string[] = [];
	let hasFilters = false;
	params.forEach((value, key) => {
		if (facets.includes(key as facet)) {
			hasFilters = true;
			try {
				const values: string[] = JSON.parse(value);
				if (values.length > 0) {
					const predicate = `(${key} = "` + values.join(`" OR ${key}="`) + '")';
					filters.push(predicate);
				}
			} catch (e) {
				console.error('Could not parse searchParameters', e);
			}
		}
	});
	if (!hasFilters) {
		return '';
	}
	return filters.join(' AND ');
}
