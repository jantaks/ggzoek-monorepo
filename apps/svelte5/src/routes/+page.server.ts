import type { PageServerLoad } from './$types.js';
import { query } from '$lib/components/searchform/search';
import { log } from '@ggzoek/logging/src/logger.js';
import type { PageServerLoadEvent } from './$types';
import type { SearchResponse } from 'meilisearch';
import type { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';

type facet = keyof SelectVacature;

const facets: facet[] = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const q = event.url.searchParams.get('fullText');
	facets.forEach((facet) => {
		const facetValue = event.url.searchParams.get(facet);
		log.info(`${facet}: ${facetValue}`);
	});
	let queryResult: SearchResponse | undefined = undefined;
	if (q != undefined) {
		queryResult = await query(q, 1);
		log.info('query', q);
	}
	return { result: queryResult };
};
