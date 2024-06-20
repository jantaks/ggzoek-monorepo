import type { PageServerLoad } from './$types.js';
import { getFacets, query } from '$lib/components/searchform/search';
import type { PageServerLoadEvent } from './$types';
import { getGeoPointPC4 } from '@ggzoek/ggz-drizzle/location_data/repo';
import { log } from '@ggzoek/logging/src/logger.js';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const _12hours = 60 * 60 * 12;
	event.setHeaders({
		'cache-control': `max-age=${_12hours}`
	});
	const offset = Number(event.url.searchParams.get('offset') || 0);
	let filters = event.url.searchParams.get('filters') || '';
	const postcode = event.url.searchParams.get('postcode') || undefined;
	let distance = event.url.searchParams.get('distance') || undefined;
	if (postcode) {
		distance = distance || '30';
		const pc4 = parseInt(postcode, 10);
		const radius = parseInt(distance, 10) * 1000;
		log.info(`Geopoint for PC4: ${pc4}`);
		const geopoint = getGeoPointPC4(pc4);
		if (geopoint) {
			const [lat, lon] = geopoint.split(',');
			const concatenator = filters.length > 0 ? ' AND ' : '';
			filters += concatenator + `_geoRadius(${lat},${lon},${radius})`;
		}
	}
	const searchParams = {
		query: event.url.searchParams.get('fullText') || '',
		offset: offset,
		filters: filters
	};
	log.info(searchParams);
	let facets = await getFacets();
	return {
		facets: facets,
		searchResponse: await query(searchParams)
	};
};
