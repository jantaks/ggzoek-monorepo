import { MEILISEARCH_KEY, MEILISEARCH_URL } from '$env/static/private';
import { MeiliSearch, type SearchParams } from 'meilisearch';
import { log } from '@ggzoek/logging/src/logger.js';

const client = new MeiliSearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY });

const facets = ['beroepen', 'organisatie', 'behandelmethoden', 'stoornissen'];
const index = client.index('vacatures');

export async function query(query: string, offset: number) {
	const options: SearchParams = {
		limit: 10,
		offset: offset,
		attributesToHighlight: ['title', 'summary'],
		facets: facets
	};
	const searchResponse = await index.search(query, options);
	log.debug(`Estimated hits for query "${query}": ${searchResponse.estimatedTotalHits}`);
	return searchResponse;
}
