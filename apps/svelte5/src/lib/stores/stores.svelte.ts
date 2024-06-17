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

function createFormStore() {
	let form = $state<HTMLFormElement>();

	const submit = () => {
		if (form) {
			console.log('submitting form');
			form.requestSubmit();
		} else {
			console.warn('form not set');
		}
	};

	return {
		set(value: HTMLFormElement) {
			form = value;
		},
		submit
	};
}

export const formStore = createFormStore();
