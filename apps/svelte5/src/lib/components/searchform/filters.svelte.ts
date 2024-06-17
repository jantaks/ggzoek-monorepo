function createFilterStore() {
	const filters = $state<Record<string, string[]>>({});
	const add = (facet: string, value: string) => {
		if (!filters[facet]) filters[facet] = [];
		filters[facet].push(value);
	};

	const addAll = (facet: string, values: string[]) => {
		if (!filters[facet]) filters[facet] = [];
		filters[facet].push(...values);
		filters[facet] = Array.from(new Set(filters[facet]));
	};

	const remove = (facet: string, value: string) => {
		if (filters[facet]) filters[facet] = filters[facet].filter((v) => v !== value);
	};

	const removeAll = () => {
		Object.keys(filters).forEach((key) => {
			delete filters[key];
		});
	};

	return {
		get filters() {
			return filters;
		},
		add,
		addAll,
		remove,
		removeAll
	};
}

export const filterStore = createFilterStore();
