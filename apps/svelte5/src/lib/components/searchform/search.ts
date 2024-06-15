import { MEILISEARCH_KEY, MEILISEARCH_URL } from '$env/static/private';
import { MeiliSearch, type SearchParams } from 'meilisearch';
import { log } from '@ggzoek/logging/src/logger.js';
import { facets } from '$lib/types';

const client = new MeiliSearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY });
const index = client.index('vacatures');

export async function query(params: { query: string; offset: number; filters?: string }) {
	const options: SearchParams = {
		limit: 10,
		offset: params.offset,
		attributesToHighlight: ['title', 'summary'],
		facets: facets,
		filter: params.filters
	};
	const searchResponse = await index.search(params.query, options);
	log.debug(`Estimated hits for query "${params.query}": ${searchResponse.estimatedTotalHits}`);
	return searchResponse;
}
