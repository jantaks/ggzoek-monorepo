import { facets } from '$lib/types';
import type { Selected } from 'bits-ui';

function createFilterStore() {
	const initialState: Record<string, Selected<string>[]> = {};
	facets.forEach((facet) => {
		initialState[facet] = [];
	});

	const filters = $state<Record<string, Selected<string>[]>>(initialState);

	const add = (facet: string, value: string) => {
		filters[facet].push({ value, label: value });
	};

	const remove = (facet: string, value: Selected<string>) => {
		filters[facet] = filters[facet].filter((v) => v !== value);
	};

	const removeAll = () => {
		Object.keys(filters).forEach((key) => {
			filters[key] = [];
		});
	};

	return {
		get filters() {
			return filters;
		},
		add,
		remove,
		removeAll
	};
}

export const filterStore = createFilterStore();
