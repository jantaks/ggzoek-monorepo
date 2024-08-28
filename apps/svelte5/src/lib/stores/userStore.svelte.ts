import { getContext, setContext } from 'svelte';

class _User {
	constructor(email?: string, likes?: string[], savedSearches?: string[]) {
		this._email = email;
	}

	_email = $state<string | undefined>();

	get email() {
		return this._email;
	}

	set email(value) {
		this._email = value;
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
}

const CONTEXT_NAME = Symbol('USER');

export function createUser(email?: string, likes?: string[], savedSearches?: string[]) {
	return setContext(CONTEXT_NAME, new _User(email, likes, savedSearches));
}

export function getUser() {
	return getContext<_User>(CONTEXT_NAME);
}

export type User = typeof _User;
