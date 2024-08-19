import { getVacaturesForUser } from '@ggzoek/ggz-drizzle/dist/vacatures';
import type { MyLocals } from '$lib/types';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const locals = event.locals as MyLocals;
	const userId = locals.userId;
	if (userId) {
		let vacatures = await getVacaturesForUser(userId);
		const result = { vacatures: vacatures, test: 'HALLO' + userId };
		console.log('SERVER RETURNING BEWAARDE VACATURS: ', result);
		return { vacatures: vacatures, test: 'HALLO' + userId };
	}
	return { vacatures: [], test: 'GEEN USER ID' };
};
