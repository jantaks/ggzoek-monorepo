import { writable } from 'svelte/store';

export const email = writable('', () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});

function Counter(startCount: number) {
	const { subscribe, set, update } = writable(startCount);

	function increment() {
		update(count => count + 1);
	}

	function decrement() {
		update(count => count - 1);
	}

	function reset() {
		set(0);
	}

	return { subscribe, increment, decrement, reset, set };
}

export const likesCounter = Counter(0);


export const alerts = writable<string | undefined>();