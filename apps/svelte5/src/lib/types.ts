import type { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';
import { type SupabaseClient } from '@supabase/supabase-js';

export const facets: Array<facet> = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];
export type facet = keyof SelectVacature;
export const resultsPerPage = 5;

export type MyLocals = {
	userId: string | undefined;
	supabase: SupabaseClient;
	getSession: () => any;
	next?: string;
};
