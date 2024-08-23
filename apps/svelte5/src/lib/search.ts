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
import { type facet, facets } from '$lib/types';
import { MAXRESULTS, RESULTS_PER_PAGE } from '$lib/constants';
import { createClient } from '@vercel/kv';
import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
import * as crypto from 'crypto';
import { error } from '@sveltejs/kit';
import { log } from '../../../../packages/logging/dist/logger';
import { getGeoPointPC4 } from '@ggzoek/ggz-drizzle/dist/location_data/repo';

const client = new MeiliSearch({ host: MEILISEARCH_URL, apiKey: MEILISEARCH_KEY });
const kv = createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
const index = client.index('vacatures');

type QueryResult = Awaited<ReturnType<typeof index.search<SelectVacature>>>;

// query?: string | null,     options?: SearchParams | undefined
export async function querySearchEngine(query?: string | null, options?: SearchParams | undefined) {
	if (options?.offset && options.offset > MAXRESULTS) {
		error(400, 'Alleen eerste 100 resultaten zijn beschikbaar. Gebruik filters om te verfijnen.');
	}

	const updatedOptions: SearchParams = {
		...options,
		limit: options?.limit ? options.limit : RESULTS_PER_PAGE,
		attributesToHighlight: ['title', 'summary'],
		facets: facets
	};
	log.info(`Querying with options: ${JSON.stringify(updatedOptions)}`);
	const { hash, cachedItem } = await getCachedResponse(query, options);
	// if (cachedItem !== null) {
	// 	log.debug(`returning  ${JSON.stringify(cachedItem.estimatedTotalHits)} cached items:`);
	// 	log.info(`FacetDistribution: ${JSON.stringify(cachedItem.facetDistribution)}`);
	// 	return cachedItem;
	// }
	const searchResponse = await index.search<SelectVacature>(query, updatedOptions);
	log.debug(`Estimated hits for query "${query}": ${searchResponse.estimatedTotalHits}`);
	log.info(`FacetDistribution: ${JSON.stringify(searchResponse.facetDistribution)}`);
	const cleanedResponse = cleanResponse(searchResponse);
	await kv.set(hash, cleanedResponse);
	return cleanedResponse;
}

async function getCachedResponse(query?: string | null, options?: SearchParams) {
	const hash = crypto
		.createHash('sha256')
		.update(JSON.stringify(options) + query)
		.digest('hex');
	const cachedItem = (await kv.get(hash)) as QueryResult;
	return { hash, cachedItem };
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

/**
 * Converts URLSearchParams to query parameters for MEILI SEARCH
 */
export async function getQueryParams(urlSearchParams: URLSearchParams) {
	const offset = Number(urlSearchParams.get('offset') || 0);
	let filters = urlSearchParams.get('filters') || '';
	const postcode = urlSearchParams.get('postcode') || undefined;
	let distance = urlSearchParams.get('distance') || undefined;
	if (postcode) {
		distance = distance || '30';
		const pc4 = parseInt(postcode, 10);
		const radius = parseInt(distance, 10) * 1000;
		log.info(`Geopoint for PC4: ${pc4}`);
		const geopoint = await getGeoPointPC4(pc4);
		if (geopoint) {
			const [lat, lon] = geopoint.split(',');
			const concatenator = filters.length > 0 ? ' AND ' : '';
			filters += concatenator + `_geoRadius(${lat},${lon},${radius})`;
		}
	}
	return {
		query: urlSearchParams.get('fullText') || '',
		options: {
			offset: offset,
			filter: filters
		}
	};
}
