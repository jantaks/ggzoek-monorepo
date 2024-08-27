import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	return {
		savedSearches: [
			{
				query: 'Term 1',
				postcode: '1234AB',
				distance: '30',
				filters: [
					{ attribute: 'beroepen', values: ['Psychiater'], predicate: 'AND' },
					{
						attribute: 'organisatie',
						values: ['Altrecht', 'De Forensische Zorgspecialisten'],
						predicate: 'OR'
					}
				]
			},
			{
				query: 'Eestoornissen, forensisch',
				postcode: '1234AB',
				distance: '30',
				filters: [
					{ attribute: 'beroepen', values: ['Psychiater'], predicate: 'AND' },
					{
						attribute: 'organisatie',
						values: ['Altrecht', 'De Forensische Zorgspecialisten'],
						predicate: 'OR'
					}
				]
			}
		]
	};
}) satisfies PageServerLoad;
