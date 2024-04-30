import 'dotenv/config';
import { type Hit, MeiliSearch, type SearchResponse } from 'meilisearch';
import type { PageServerLoad } from './$types';
import type { MyLocals, SearchData, Vacature } from '$lib/types';
import { kv } from '@vercel/kv';
import * as crypto from 'crypto';

const url = process.env.MEILISEARCH_URL;
const key = process.env.MEILISEARCH_KEY;

if (!key || !url) {
	throw new Error('CHECK YOU ENV VARIABLES!');
}

const client = new MeiliSearch({ host: url, apiKey: key });
const vercelKV = kv;
const facets = ['beroepen', 'organisatie', 'behandelmethoden', 'stoornissen'];

function createFilters(params: URLSearchParams) {
	const filters: { [key: string]: string[] } = {};
	facets.forEach(facet => {
		filters[facet] = [];
	});
	let hasFilters = false;
	params.forEach((value, key) => {
		if (facets.includes(key)) {
			hasFilters = true;
			filters[key].push(value);
		}
	});
	if (!hasFilters) {
		return undefined;
	}
	const filterPredicates: string[] = [];
	Object.keys(filters).forEach((key) => {
		if (filters[key].length > 0) {
			const subPredicates: string[] = [];
			filters[key].forEach(filter => {
				subPredicates.push(`${key} = "${filter}"`);
			});
			filterPredicates.push('(' + subPredicates.join(' OR ') + ')');
		}

	});
	return filterPredicates.join(' AND ');
}

function cleanResponse(response: SearchResponse<Vacature>) {
	return {
		...response, hits: response.hits.map((x: Hit<Vacature>) => {
			if (x._formatted) {
				const formatted = x._formatted;
				delete formatted.body;
				return { _formatted: x._formatted };
			}
		})
	};
}

export const load: PageServerLoad = async ({ url }): Promise<SearchData> => {
	const query = url.searchParams.get('search');
	const offset = (url.searchParams.get('page') !== null ? url.searchParams.get('page') : '0') as string;
	const filters = createFilters(url.searchParams);
	const searchCommand = {
		query: query,
		options: {
			limit: 10,
			offset: parseInt(offset),
			attributesToHighlight: ['title', 'summary'],
			facets: facets,
			filter: filters
		}
	};
	const searchCommandString = JSON.stringify(searchCommand);
	const hash = crypto.createHash('sha256').update(searchCommandString).digest('hex');
	let response: SearchResponse<Vacature> | null = await vercelKV.get(hash);
	if (!response) {
		response = await client.index<Vacature>('vacatures').search(searchCommand.query, searchCommand.options);
		const cleanedResponse = cleanResponse(response);
		vercelKV.set(hash, cleanedResponse);
		console.log('Saved search result in KV');
	} else {
		console.log('Retrieved search result from KV');

	}
	return {
		searchCommand: searchCommand,
		response
	};
};