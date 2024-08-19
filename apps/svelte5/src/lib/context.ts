import { getContext, setContext } from 'svelte';

interface Context<TValue> {
	get: () => TValue | null;
	set: (currentValue: TValue) => void;
}

/**
 * Allow strongly typed Svelte context getters and setters while using a unique
 * Symbol instead of a string key to avoid any potential key conflicts.
 * @param keyDescription A descriptor for the context key.
 * @returns A get and set context function that is intrinsically tied.
 */
export function createContext<TValue>(keyDescription?: string): Context<TValue> {
	const key = Symbol(keyDescription);
	return {
		get: () => {
			const value = getContext(key);
			if (value == null) {
				console.warn(`context.get(${key.toString()}) called without context.set in parent scope`);
			}
			return (value ?? null) as TValue | null;
		},
		set: (currentValue: TValue) => setContext(key, currentValue)
	};
}
