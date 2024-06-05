import type { LayoutServerLoad } from './$types';
import type { MyLocals } from '$lib/types';
import vacatures from '@ggzoek/ggz-drizzle/src/vacatures.js';

// async function imgUrls() {
// 	const data = await allScreenshotUrls()
// 	const url = data ?? [];
// 	return url.map((x: { screenshot_url: string }) => x.screenshot_url);
// }

export const load: LayoutServerLoad = async ({ locals }) => {
	const myLocals = locals as MyLocals;
	const session = await myLocals.getSession();
	const email = session ? session.user?.email : null;
	const likes = await myLocals.supabase
		.from('likes')
		.select('vacature')
		.eq('user_id', myLocals.userId);
	const likesList = likes.data?.map((x: { vacature: string }) => x.vacature) as string[];
	return {
		likes: likesList ? likesList : [],
		imageUrls: await vacatures.allScreenshotUrls(),
		email: email ? email : null
	};
};
