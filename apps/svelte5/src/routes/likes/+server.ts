import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { MyLocals } from '$lib/types';
import { likeVacature, unlikeVacature } from '@ggzoek/ggz-drizzle/dist/vacatures';
import { log } from '@ggzoek/logging/dist/logger.js';

type Body = { vacature: string };

export const POST: RequestHandler = async (event) => {
	return await execute(event, 'CREATE');
};

export const DELETE: RequestHandler = async (event) => {
	return await execute(event, 'DELETE');
};

async function execute(event: RequestEvent, type: 'CREATE' | 'DELETE') {
	log.debug(`Executing ${type} like`);
	const locals = event.locals as MyLocals;
	const userId = locals.userId;
	if (!userId) {
		log.debug(`Unauthorized request to ${event.request.url}`);
		return error(401, 'Unauthorized');
	}
	const data = (await event.request.json()) as Body;
	if (type === 'CREATE') {
		console.log(`Creating like for user ${userId} and vacature ${data.vacature}`);
		await likeVacature(userId, data.vacature);
	} else {
		console.log(`DELETING like for user ${userId} and vacature ${data.vacature}`);
		await unlikeVacature(userId, data.vacature);
	}
	return json({}, { status: 202 });
}
