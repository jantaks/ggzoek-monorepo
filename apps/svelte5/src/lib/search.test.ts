import { describe, expect, it } from 'vitest';
import { getFacets } from '$lib/search';
import { reconstructFilters, SearchForm } from '$lib/stores/formStore.svelte.js';

describe('sum test', () => {});

describe('filter store', () => {
	it('gets all facets', async () => {
		const result = await getFacets();
		console.log(result);
	});
	it('Creates Filter expression and sorts facets and values', async () => {
		const form = new SearchForm();
		const behandelmethoden = form.addFilter('behandelmethoden');
		behandelmethoden.selectedValues = new Set(['EMDR', 'ACT']);
		const beroepen = form.addFilter('beroepen');
		beroepen.selectedValues = new Set(['Psychiater', 'GZ-psycholoog']);
		expect(form.filterExpression).toBe(
			'(behandelmethoden = "ACT" OR behandelmethoden="EMDR") AND (beroepen = "GZ-psycholoog" OR beroepen="Psychiater")'
		);
	});
	it('reconstructs filters', async () => {
		const filterString = '(beroepen = "A") AND (stoornissen = "B" AND stoornissen="C")';
		const result = reconstructFilters(filterString);
		const expected = [
			{ facet: 'beroepen', selectedValues: ['A'], operator: 'OR' },
			{
				facet: 'stoornissen',
				selectedValues: ['B', 'C'],
				operator: 'AND'
			}
		];
		expect(result).toEqual(expected);
		console.log(result);
	});
});
