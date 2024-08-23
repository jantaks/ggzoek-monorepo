import { goto } from '$app/navigation';
import { getContext, setContext } from 'svelte';

class _User {
	constructor(email?: string, likes?: string[], savedSearches?: string[]) {
		this._email = email;
		this._likes = likes !== undefined ? likes : [];
		this._savedSearches = savedSearches !== undefined ? savedSearches : [];
	}

	_savedSearches: string[] = $state<string[]>([]);

	get savedSearches() {
		return this._savedSearches;
	}

	set savedSearches(value: string[]) {
		this._savedSearches = value;
	}

	_email = $state<string | undefined>();

	get email() {
		return this._email;
	}

	set email(value) {
		this._email = value;
	}

	_likes: string[] = $state<string[]>([]);

	get likes() {
		return this._likes;
	}

	set likes(value) {
		this._likes = value;
	}

	get authenticated() {
		return this._email !== undefined;
	}

	get initials() {
		if (this._email === undefined) {
			return '';
		}
		const name = this._email.split('@')[0];
		const parts = name.split('.');
		if (parts.length > 1) {
			return parts[0].charAt(0) + parts[1].charAt(0);
		} else {
			return parts[0].charAt(0);
		}
	}

	async toggleLike(vacature: string | undefined) {
		if (!this.authenticated) {
			await goto('/auth/login');
			return;
		}
		if (!vacature) {
			return;
		}
		const action = this._likes.includes(vacature) ? 'DELETE' : 'POST';
		const result = await fetch('/likes', {
			method: action,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				vacature: vacature
			})
		});
		if (result.redirected) {
			await goto(result.url);
		}
		if (result.ok) {
			if (action === 'POST') {
				this._likes = [...this._likes, vacature];
			} else {
				this._likes = this._likes.filter((like) => like !== vacature);
			}
		}
	}
}

const CONTEXT_NAME = Symbol('USER');

export function createUser(email?: string, likes?: string[], savedSearches?: string[]) {
	return setContext(CONTEXT_NAME, new _User(email, likes, savedSearches));
}

export function getUser() {
	return getContext<_User>(CONTEXT_NAME);
}

export type User = typeof _User;
