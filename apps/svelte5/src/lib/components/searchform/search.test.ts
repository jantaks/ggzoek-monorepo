import { describe, it } from 'vitest';
import { getFacets } from '$lib/components/searchform/search';
import { filterStore } from '$lib/stores/stores.svelte';
import { _reconstructFilters } from '../../../routes/+page.server';

describe('sum test', () => {});

describe('filter store', () => {
	it('gets all facets', async () => {
		const result = await getFacets();
		console.log(result);
	});
	it('creates Filter expression', async () => {
		filterStore.add('behandelmethoden', 'EMDR');
		filterStore.add('behandelmethoden', 'ACT');
		filterStore.add('organisatie', 'Arkin');
		filterStore.setOperator('behandelmethoden', 'AND');
		console.log(filterStore.getAllFilterExpressions());
	});
	it('reconstructs filters', async () => {
		const filterString = '(beroepen = "A") AND (stoornissen = "B" AND stoornissen="C")';
		const result = _reconstructFilters(filterString);
		// expect(result).toEqual({ beroepen: ['A'], stoornissen: ['B', 'C'] });
		console.log(result);
	});
});
