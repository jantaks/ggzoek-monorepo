import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
import { type SupabaseClient, type User } from '@supabase/supabase-js';

export const facets: Array<facet> = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];
export type facet = keyof SelectVacature;
export const RESULTS_PER_PAGE = 5;

export type MyLocals = {
	user: User | null;
	supabase: SupabaseClient;
	next?: string;
};

export type Operator = 'AND' | 'OR';

export type FilterDefinition = {
	facet: string;
	selectedValues: string[];
	operator: Operator;
};

export type Search = {
	query: string;
	postcode: string;
	distance: number;
	estimatedResults: number;
	filters: FilterDefinition[];
};
