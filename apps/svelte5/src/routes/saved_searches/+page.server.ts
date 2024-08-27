import type { MyLocals, Search } from '$lib/types';
import { searchFromSearchParams } from '$lib/stores/formStore.svelte';
import { error } from '@sveltejs/kit';
import { deleteUserSearch } from '@ggzoek/ggz-drizzle/dist/savedSearches';

export async function load({
	parent
}): Promise<{ savedSearches: { raw: string | null; search: Search | null }[] }> {
	const { savedSearches } = await parent();
	if (!savedSearches) {
		return { savedSearches: [{ raw: null, search: null }] };
	}
	const searches = savedSearches.map((s) => {
		const params = new URLSearchParams(s);
		return { raw: s, search: searchFromSearchParams(params) };
	});

	return { savedSearches: searches };
}

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
