import { json, type RequestEvent } from '@sveltejs/kit';
import { getQueryParams, querySearchEngine } from '$lib/search';

export async function GET(event: RequestEvent) {
	const _12hours = 60 * 60 * 12;
	event.setHeaders({
		'cache-control': `max-age=${_12hours}`
	});
	const { query, options } = await getQueryParams(event.url.searchParams);
	return json({
		searchResponse: await querySearchEngine(query, options)
	});
}
