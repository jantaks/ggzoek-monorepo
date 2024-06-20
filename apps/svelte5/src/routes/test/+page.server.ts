import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const postcode = event.url.searchParams.get('postcode') || undefined;
	const fullText = event.url.searchParams.get('fullText') || '';
	console.log(`LOADING PAGE with postcode: ${postcode} and fullText: ${fullText}`);
	return { postcode, fullText };
}) satisfies PageServerLoad;
