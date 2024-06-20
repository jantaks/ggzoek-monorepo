import type { RequestHandler } from '@sveltejs/kit';
import { getAllPC4 } from '@ggzoek/ggz-drizzle/location_data/repo.js';
import { type Plaatsen } from '@ggzoek/ggz-drizzle/location_data/schema.js';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const _3months = 60 * 60 * 24 * 31 * 3;
	const _1day = 60 * 60 * 24;
	setHeaders({
		'cache-control': `max-age=${_3months}, stale-while-revalidate=${_1day}`
	});
	let result: Plaatsen[] = [];
	const partialPostcode = url.searchParams.get('postcode');
	if (partialPostcode) {
		const postcode = parseInt(partialPostcode, 10);
		result = await getAllPC4(postcode);
	}
	return new Response(JSON.stringify(result));
};
