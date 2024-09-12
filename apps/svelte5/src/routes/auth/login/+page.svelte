<script lang="ts">
	import type { ActionData } from './$types';
	import { z } from 'zod';
	import { page } from '$app/stores';
	import BasicForm from './BasicForm.svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

	type Props = {
		form: ActionData,
	}

	const { form }: Props = $props();
	let email = $state('');
	let password = $state('');
	let processing = $state(false);
	let validationErrors = $state<string>(form?.errors);

	const emailSchema = z.string().email();

	function validateReset(e: MouseEvent) {
		console.log('validatePassword');
		if (!email || !emailSchema.safeParse(email).success) {
			validationErrors = 'Vul een geldig email adres in om uw wachtwoord te herstellen.';
			e.preventDefault();
			return;
		}
	}

	function validateLogin(e: MouseEvent) {
		const errors: string[] = [];
		if (!email || !emailSchema.safeParse(email).success) {
			errors.push('Ongeldig emailadres');
		}
		if (!password) {
			errors.push('Wachtwoord is verplicht');
		}
		if (errors.length > 0) {
			validationErrors = errors.join(', ');
			e.preventDefault();
			return;
		}
	}

	let message = $page.url.searchParams.get('message');
	console.log('msg', message);

</script>

{#snippet inputs()}
	<div>
		<input name="next" type="hidden" value="/zoekresultaten/" />
		<label class="block mb-1  font-light text-gray-900 dark:text-primary-200" for="email">Email:</label>
		<input
			bind:value={email}
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-primary-200 dark:focus:ring-primary dark:focus:border-primary"
			id="email"
			name="email"
			placeholder="psychiater@example.com"
			required type="email" />
	</div>
	<div>
		<label class="block mb-1  font-light text-gray-900 dark:text-primary-200" for="password">Wachtwoord:</label>
		<input
			bind:value={password}
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-primary-200 dark:focus:ring-primary dark:focus:border-primary"
			id="password"
			name="password"
			placeholder="xxxxxxxxx"
			type="password" />
	</div>
{/snippet}
{#snippet buttons()}
	<div class="flex flex-col justify-between items-center space-y-4">
		<Button3
			variant="secondary"
			size="medium"
			type="submit"
			onclick={validateLogin}
			value="login">
			Inloggen
		</Button3>
		<button
			class="hover:text-primary text-sm"
			formaction="?/reset"
			onclick={validateReset}
		>Wachtwoord
			vergeten?
		</button>
	</div>
{/snippet}
{#snippet header()}
	<h1 class="text-center font-semibold text-xl text-secondary-900">Nog geen account? <a class="text-primary"
																																												href="register">Registreer
		hier</a></h1>
{/snippet}
<BasicForm
	buttons={buttons}
	errors={validationErrors}
	formAction={"?/login"}
	header={header}
	inputs={inputs}
	message={message}
/>



