import { goto } from '$app/navigation';
import { getContext, setContext } from 'svelte';

class _User {
	constructor(email?: string, likes?: string[]) {
		this._email = email;
		this._likes = likes;
	}

	_email = $state<string>();

	get email() {
		return this._email;
	}

	set email(value) {
		this._email = value;
	}

	_likes: string[] | undefined = $state<string[]>([]);

	get likes() {
		return this._likes;
	}

	set likes(value) {
		this._likes = value;
	}

	get initials() {
		if (!this._email) {
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
		if (!vacature || !this._likes) {
			console.log('no vacature or likes');
			return;
		}
		const action = this._likes.includes(vacature) ? 'DELETE' : 'POST';
		console.log('like');
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
			console.log('redirect');
			await goto(result.url);
		}
		if (result.ok) {
			if (action === 'POST') {
				this._likes = [...this._likes, vacature];
			} else {
				this._likes = this._likes.filter((like) => like !== vacature);
			}
		}
		console.log(result);
	}
}

const CONTEXT_NAME = Symbol('USER');

export function createUser(email: string, likes: string[]) {
	return setContext(CONTEXT_NAME, new _User(email, likes));
}

export function getUser() {
	return getContext<_User | undefined>(CONTEXT_NAME);
}

export type User = typeof _User;
