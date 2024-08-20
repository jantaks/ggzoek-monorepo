import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
import { type SupabaseClient, type User } from '@supabase/supabase-js';

export const facets: Array<facet> = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];
export type facet = keyof SelectVacature;
export const resultsPerPage = 5;

export type MyLocals = {
	user: User | null;
	supabase: SupabaseClient;
	next?: string;
};
