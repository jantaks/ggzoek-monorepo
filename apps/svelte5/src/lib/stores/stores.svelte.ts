import { type facet, facets } from '$lib/types';
import type { Selected } from 'bits-ui';

export type Operator = 'AND' | 'OR';

function createFilterStore() {
	const initialFilters: Record<string, Selected<string>[]> = {};
	const initialOperators: Record<string, Operator> = {};

	facets.forEach((facet) => {
		initialFilters[facet] = [];
		initialOperators[facet] = 'OR';
	});

	const filters = $state<Record<facet, Selected<string>[]>>(initialFilters);
	const operators = $state<Record<string, Operator>>(initialOperators);

	function setOperator(facet: facet, operator: Operator) {
		operators[facet] = operator;
	}

	function getOperator(facet: facet) {
		return operators[facet];
	}

	function nonEmptyFilters() {
		const facets = Object.keys(filters) as facet[];
		return facets.filter((key) => filters[key].length > 0);
	}

	function getFilterExpression(facet: facet) {
		const values = filters[facet].map((v) => v.value);
		return `(${facet} = "` + values.join(`" ${operators[facet]} ${facet}="`) + '")';
	}

	function getAllFilterExpressions() {
		const facets = Object.keys(filters) as facet[];
		return facets
			.map((facet) => {
				if (filters[facet].length === 0) {
					return null;
				}
				return getFilterExpression(facet);
			})
			.filter((v) => v !== null)
			.join(' AND ');
	}

	const add = (facet: facet, value: string) => {
		if (!filters[facet]) {
			filters[facet] = [];
		}
		filters[facet].push({ value, label: value });
	};

	const remove = (facet: facet, value: Selected<string>) => {
		filters[facet] = filters[facet].filter((v) => v !== value);
	};

	const removeAll = () => {
		const facets = Object.keys(filters) as facet[];
		facets.forEach((key) => {
			filters[key] = [];
		});
	};

	const hasFilters = () => {
		return Object.keys(filters).some((key) => filters[key].length > 0);
	};

	const filterCount = () => {
		const facets = Object.keys(filters) as facet[];
		return facets.reduce((acc, key) => acc + filters[key].length, 0);
	};

	function get(facet: facet) {
		return filters[facet] || [];
	}

	function addAll(facet: facet, values: Selected<string>[]) {
		filters[facet] = values;
	}

	function toggleOperator(facet: facet) {
		operators[facet] = operators[facet] === 'AND' ? 'OR' : 'AND';
	}

	return {
		get filters() {
			return filters;
		},
		get,
		add,
		remove,
		removeAll,
		hasFilters,
		filterCount,
		getAllFilterExpressions,
		setOperator,
		addAll,
		getOperator,
		toggleOperator,
		nonEmptyFilters
	};
}

export const filterStore = createFilterStore();

function createFormStore() {
	let form = $state<HTMLFormElement>();

	const submitForPage = () => {
		if (form) {
			form.requestSubmit();
		} else {
			console.warn('form not set');
		}
	};

	const submit = () => {
		if (form) {
			const element = form.querySelector(`input[name="offset"]`) as HTMLInputElement;
			if (element) {
				element.value = '0';
			}
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
		submitForPage,
		addInput
	};
}

export const formStore = createFormStore();
