<script lang="ts">
	import type { ActionData } from './$types';
	import { z } from 'zod';
	import Processing from '$lib/components/Processing.svelte';
	import { page } from '$app/stores';
	import { Info, TriangleAlert } from 'lucide-svelte';

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
			validationErrors = 'U moet een geldig email adres invullen om uw wachtwoord te herstellen.';
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


{#snippet info(message)}
	<div class=" flex flex-row justify-items-center">
		<Info class="animate-pulse text-secondary-900 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

{#snippet error(message)}
	<div class=" flex flex-row justify-items-center">
		<TriangleAlert class="animate-pulse text-red-500 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

<Processing processing={processing} />
<section class={`${processing? "hidden": ""} space-y-4`}>
	<h1 class="text-center font-semibold text-xl text-secondary-900">Nog geen account? <a class="text-primary" href="register">Registreer hier.</h1>
	{#if message}
		{@render info(message)}
	{/if}
	{#if validationErrors}
		{@render error(validationErrors)}
	{/if}
	<form action="?/login" class="space-y-4 pt-4 pb-1"
				method="post"
				onsubmit={() => processing = !processing}
	>

		<div>
			<input name="next" type="hidden" value="/zoekresultaten/" />
			<label class="block mb-1  font-light text-gray-900 dark:text-white" for="email">Email:</label>
			<input
				bind:value={email}
				class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
				id="email"
				name="email"
				placeholder="psychiater@example.com"
				required type="email" />
		</div>
		<div>
			<label class="block mb-1  font-light text-gray-900 dark:text-white" for="password">Wachtwoord:</label>
			<input
				bind:value={password}
				class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
				id="password"
				name="password"
				placeholder="xxxxxxxxx"
				type="password" />
		</div>
		<div class="flex flex-col justify-between items-center space-y-4">
			<button
				class="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg sm:w-auto px-4 py-1.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
				onclick={validateLogin}
				onsubmit={() => processing = !processing}
				type="submit"
				value="login">
				Inloggen
			</button>
			<button class="hover:text-primary text-sm" formaction="?/reset" onclick={validateReset}
							onsubmit={() => processing = !processing}>Wachtwoord
				vergeten?
			</button>
		</div>
	</form>

</section>



