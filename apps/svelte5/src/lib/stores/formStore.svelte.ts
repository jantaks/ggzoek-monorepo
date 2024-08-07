import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';

type Operator = 'AND' | 'OR';

export class Filter {
	constructor(facet: string) {
		this._facet = facet;
	}

	_facet = $state('');

	get facet(): string {
		return this._facet;
	}

	set facet(value: string) {
		this._facet = value;
	}

	_selectedValues: Set<string> = $state(new Set([]));

	get selectedValues(): Set<string> {
		return this._selectedValues;
	}

	set selectedValues(values: Set<string>) {
		this._selectedValues = values;
	}

	_operator = $state<Operator>('OR');

	get operator(): 'AND' | 'OR' {
		return this._operator;
	}

	set operator(value: 'AND' | 'OR') {
		this._operator = value;
	}

	_isActive = $derived.by(() => this._selectedValues.size > 0);

	get isActive(): boolean {
		return this._isActive;
	}

	set isActive(value: boolean) {
		this._isActive = value;
	}

	addSelected(value: string) {
		this._selectedValues.add(value);
		this._selectedValues = new Set([...this._selectedValues].sort()); // trigger update
	}

	removeSelected(value: string) {
		this._selectedValues.delete(value);
		this._selectedValues = new Set([...this._selectedValues].sort()); // trigger update
	}

	predicate() {
		if (this._selectedValues) {
			return (
				`(${this._facet} = "` +
				Array.from(this._selectedValues).sort().join(`" ${this._operator} ${this._facet}="`) +
				'")'
			);
		}
		return '';
	}
}

export class SearchForm {
	private loading = $state(false);

	private _filters: Filter[] = $state([]);

	get filters() {
		return this._filters;
	}

	set filters(value: Filter[]) {
		this._filters = value;
	}

	private _postcode = $state('');

	get postcode() {
		return this._postcode;
	}

	set postcode(value: string) {
		this._postcode = value;
	}

	private _query = $state('');

	get query(): string {
		return this._query;
	}

	set query(value: string) {
		this._query = value;
	}

	get isLoading() {
		return this.loading;
	}

	set isLoading(value: boolean) {
		this.loading = value;
	}

	_distance = $state([30]);

	get distance() {
		return this._distance;
	}

	set distance(value: number[]) {
		this._distance = value;
	}

	get filterExpression() {
		return this._filters
			.filter((f) => f.isActive)
			.sort((a, b) => a.facet.localeCompare(b.facet))
			.map((f) => f.predicate())
			.join(' AND ');
	}

	getFilter(facet: string) {
		return this._filters.find((f) => f.facet === facet);
	}

	addFilter(facet: string) {
		let existing = this.getFilter(facet);
		if (existing) {
			return existing;
		}
		const filter = new Filter(facet);
		this._filters.push(filter);
		return filter;
	}

	searchParams() {
		return new URLSearchParams({
			postcode: this._postcode,
			fullText: this._query,
			distance: this._distance.toString(),
			filters: this.filterExpression
		});
	}

	async submit(offset?: number) {
		this.isLoading = true;
		const searchParams = this.searchParams();
		if (offset) searchParams.set('offset', offset.toString());
		await goto('/zoekresultaten?' + searchParams);
		this.isLoading = false;
	}

	clearAllFilters() {
		this._filters.forEach((f) => (f.selectedValues = new Set([])));
	}

	initiate(params: URLSearchParams) {
		this._postcode = params.get('postcode') || '';
		this._query = params.get('fullText') || '';
		this._distance = [parseInt(params.get('distance') || '30')];
		const filters = reconstructFilters(params.get('filters') || '');
		if (!filters) return;
		this._filters = filters.map((f) => {
			const filter = new Filter(f.facet);
			filter.selectedValues = new Set(f.selectedValues);
			filter.operator = f.operator;
			return filter;
		});
	}
}

const CONTEXT_NAME = Symbol('FORMDATA');

export function createSearchForm() {
	return setContext(CONTEXT_NAME, new SearchForm());
}

export function getSearchForm() {
	return getContext<ReturnType<typeof createSearchForm>>(CONTEXT_NAME);
}

export function reconstructFilters(filter: string) {
	//get all strings between brackets
	const regex = /\((.*?)\)/g;
	const matches = filter.match(regex);
	console.log(matches);
	return matches?.map((match) => {
		const words = match.split(' ');
		// get all values between quotes
		const values = match.match(/"(.*?)"/g);
		let cleanedValues: string[] = [];
		if (values) {
			// remove quotes
			cleanedValues = values.map((value) => value.replace(/"/g, ''));
		}
		let sortedValues = cleanedValues.sort(); //Improves caching. BREBURG AND REINIER equals REINIER AND BREBURG
		const operator: Operator = match.includes(' AND ') ? 'AND' : 'OR';
		return { facet: words[0].replace('(', ''), selectedValues: sortedValues, operator: operator };
	});
}
