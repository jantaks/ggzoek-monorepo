import { describe, expect, it } from 'vitest';
import { getFacets } from '$lib/search';
import {
	reconstructFilters,
	SearchForm,
	searchFromSearchParams
} from '$lib/stores/formStore.svelte.js';

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
	});
	it('Reconstructs a Search from UrlSearchParameters', () => {
		const parmams = 'postcode=5232AB&fullText=zoekterm1&distance=30&filters=';
		const results = searchFromSearchParams(new URLSearchParams(parmams));
		const expected = {
			query: 'zoekterm1',
			postcode: '5232AB',
			distance: 30,
			estimatedResults: 0,
			filters: []
		};
		expect(results).toEqual(expected);
	});
	it('Reconstructs a Search from UrlSearchParameters 2', () => {
		const parmams =
			'postcode=5258&fullText=hallo&distance=60&filters=%28organisatie+%3D+%22Accare%22+OR+organisatie%3D%22Altrecht%22+OR+organisatie%3D%22De+Hoop%22%29+AND+%28stoornissen+%3D+%22AD%28H%29D%22%29';
		const results = searchFromSearchParams(new URLSearchParams(parmams));
		console.log(JSON.stringify(results));
		const expected = {
			query: 'hallo',
			postcode: '5258',
			distance: 60,
			estimatedResults: 0,
			filters: [
				{ facet: 'organisatie', selectedValues: ['Accare', 'Altrecht', 'De Hoop'], operator: 'OR' },
				{ facet: 'stoornissen', selectedValues: [], operator: 'OR' }
			]
		};
		expect(results).toEqual(expected);
	});
});
