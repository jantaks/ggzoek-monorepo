import { type Actions, error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';
import { enhancedFormdata } from '$lib/helpers';

const errorResponse = error;

export const actions = {
	toggleLike: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const urlHash = data.get('urlHash') as string;
		const likedString = data.get('liked') as string;
		const liked = JSON.parse(likedString);
		const myLocals = locals as MyLocals;
		const db = myLocals.supabase;
		const user = await db.auth.getUser();
		if (user.error) {
			errorResponse(500, user.error.message);
			return { status: 500, errors: user.error.message };
		}
		let error;
		console.log(`Toggling from ${liked} to ${!liked}`);
		if (liked) {
			({ error } = await db.from('likes').delete().eq('vacature', urlHash).eq('user_id', user.data.user.id));
		} else {
			({ error } = await db.from('likes').insert({ vacature: urlHash, user_id: user.data.user.id }));
		}
		if (error) {
			errorResponse(500, error.message);
			return { status: 500, errors: error.message };
		}
		const { enhanced, next } = await enhancedFormdata(data);
		if (!enhanced) {
			redirect(303, next);
		}
	},
	saveSearch: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const { enhanced, next } = await enhancedFormdata(data);

		if (!enhanced) {
			console.log('Saving search and redirecting to', next);
			redirect(303, next);
		}

		return { greetin: 'HELLO WORLD' };
	}
} satisfies Actions;