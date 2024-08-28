import { authRequired } from './hooks.server';
import { describe, expect, it } from 'vitest';

describe('Protection', () => {
	it('Should protect a route', () => {
		const result = authRequired('/zoekresultaten/+page');
		expect(result.required).toBe(true);
	});
	it('Returns a message, why is route protected', () => {
		const result = authRequired('/zoekresultaten/+page');
		console.log(result);
	});
});
