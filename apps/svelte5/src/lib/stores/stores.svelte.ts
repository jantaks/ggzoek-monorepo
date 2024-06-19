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

	const hasFilters = () => {
		return Object.keys(filters).some((key) => filters[key].length > 0);
	};

	const filterCount = () => {
		return Object.keys(filters).reduce((acc, key) => acc + filters[key].length, 0);
	};

	return {
		get filters() {
			return filters;
		},
		add,
		remove,
		removeAll,
		hasFilters,
		filterCount
	};
}

export const filterStore = createFilterStore();

function createFormStore() {
	let form = $state<HTMLFormElement>();

	const values: string[] = $state([]);

	const submit = () => {
		if (form) {
			form.requestSubmit();
		} else {
			console.warn('form not set');
		}
	};

	const addInput = (name: string, value: string) => {
		if (form) {
			let element = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
			if (!element) {
				element = document.createElement('input');
			}
			element.name = name;
			element.value = value;
			element.type = 'hidden';
			form.appendChild(element);
		} else {
			console.warn('form not set');
		}
	};

	return {
		set(value: HTMLFormElement) {
			form = value;
		},
		submit,
		addInput
	};
}

export const formStore = createFormStore();
