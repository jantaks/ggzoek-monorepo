import type { PageServerLoad } from './$types.js';
import { query } from '$lib/components/searchform/search';
import { log } from '@ggzoek/logging/src/logger.js';
import type { PageServerLoadEvent } from './$types';
import type { SearchResponse } from 'meilisearch';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const q = event.url.searchParams.get('fullText');
	const selectedBeroepen = event.url.searchParams.get('beroepen');
	log.info(selectedBeroepen);
	const selectedStoornissen = event.url.searchParams.get('stoornissen');
	log.info(selectedStoornissen);
	let queryResult: SearchResponse | null = null;
	if (q != undefined) {
		queryResult = await query(q, 1);
		log.info('query', q);
	}
	const beroepen = queryResult?.facetDistribution?.beroepen;
	const stoornissen = queryResult?.facetDistribution?.stoornissen;
	log.info(beroepen);
	return { beroepen: beroepen, stoornissen: stoornissen };
};
