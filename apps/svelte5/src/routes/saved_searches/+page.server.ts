import type { MyLocals } from '$lib/types';
import { error } from '@sveltejs/kit';
import { deleteUserSearch } from '@ggzoek/ggz-drizzle/dist/savedSearches';

export const actions = {
	delete: async (event) => {
		console.log('deleteSearch');
		const locals = event.locals as MyLocals;
		const data = await event.request.formData();
		const search = data.get('search') as string;
		console.log(search);
		if (!search) {
			return error(400, 'search parameters are required');
		}
		if (!locals.user) {
			return error(401, 'Unauthorized');
		}
		await deleteUserSearch({ userId: locals.user.id, search });
	}
};
