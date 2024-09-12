import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getFacets, getQueryParams, querySearchEngine } from '$lib/search';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {};
