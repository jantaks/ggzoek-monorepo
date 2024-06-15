import type { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';

export const facets: facet[] = ['beroepen', 'behandelmethoden', 'organisatie', 'stoornissen'];
export type facet = keyof SelectVacature;
