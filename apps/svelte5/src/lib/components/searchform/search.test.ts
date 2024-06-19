import { describe, it } from 'vitest';
import { getFacets } from '$lib/components/searchform/search';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', async () => {
		const result = await getFacets();
		console.log(result);
	});
});
