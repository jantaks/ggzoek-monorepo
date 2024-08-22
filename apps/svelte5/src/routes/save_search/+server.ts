import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { saveSearch } from '@ggzoek/ggz-drizzle/dist/savedSearches';
import type { MyLocals } from '$lib/types';

export const POST: RequestHandler = async (event) => {
	const locals = event.locals as MyLocals;
	const userId = locals.user?.id;
	if (!userId) {
		console.debug(
			`${new Date().toLocaleTimeString()} [+server.ts - a8df235b] : Unauthorized request to ${event.request.url} `
		);
		return redirect(301, '/auth/login');
	}
	const data = (await event.request.json()) as { searchParams: string };
	const id = await saveSearch(data.searchParams, userId);
	return json({ id }, { status: 201, statusText: `Created ${id}` });
};
