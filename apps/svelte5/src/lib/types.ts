import type { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';

export const facets: Array<facet> = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];
export type facet = keyof SelectVacature;
export const resultsPerPage = 5;
