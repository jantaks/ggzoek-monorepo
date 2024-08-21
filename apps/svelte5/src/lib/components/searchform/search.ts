import {
	KV_REST_API_TOKEN,
	KV_REST_API_URL,
	MEILISEARCH_KEY,
	MEILISEARCH_URL
} from '$env/static/private';
import {
	type FacetHit,
	type Hit,
	MeiliSearch,
	type SearchForFacetValuesResponse,
	type SearchParams,
	type SearchResponse
} from 'meilisearch';
import { log } from '@ggzoek/logging/src/logger.js';
import { type facet, facets } from '$lib/types';
import { MAXRESULTS, RESULTS_PER_PAGE } from '$lib/constants';
import { createClient } from '@vercel/kv';
import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
import * as crypto from 'crypto';
import { error } from '@sveltejs/kit';

const client = new MeiliSearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY });
const kv = createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
const index = client.index('vacatures');

type QueryResult = ReturnType<typeof index.search<SelectVacature>>;

export async function query(params: { query: string; offset: number; filters?: string }) {
	if (params.offset > MAXRESULTS) {
		error(400, 'Alleen eerste 100 resultaten zijn beschikbaar. Gebruik filters om te verfijnen.');
	}
	const options: SearchParams = {
		limit: RESULTS_PER_PAGE,
		offset: params.offset,
		attributesToHighlight: ['title', 'summary'],
		facets: facets,
		filter: params.filters
	};
	const hash = crypto
		.createHash('sha256')
		.update(JSON.stringify(options) + params.query)
		.digest('hex');
	const cachedResponse = await kv.get(hash);
	if (cachedResponse) {
		log.debug(`Cache hit (key: ${hash}) for query`, params.query, options);
		return cachedResponse as QueryResult;
	}
	const searchResponse = await index.search<SelectVacature>(params.query, options);
	log.debug(`Estimated hits for query "${params.query}": ${searchResponse.estimatedTotalHits}`);
	const cleanedResponse = cleanResponse(searchResponse);
	await kv.set(hash, cleanedResponse);
	return cleanedResponse;
}

function cleanResponse(response: SearchResponse<SelectVacature>) {
	return {
		...response,
		hits: response.hits.map((hit: Hit<SelectVacature>) => {
			if (hit._formatted) {
				const formatted = hit._formatted;
				delete formatted.body;
				return { ...hit._formatted };
			}
			return hit;
		})
	};
}

export async function getFacets() {
	const facets: facet[] = ['organisatie', 'beroepen', 'stoornissen', 'behandelmethoden'];
	const facetMap: Record<string, FacetHit[]> = {};
	for (const facet of facets) {
		const facetValues: SearchForFacetValuesResponse = await index.searchForFacetValues({
			facetName: facet
		});
		facetMap[facet] = facetValues.facetHits;
	}
	return facetMap;
}
