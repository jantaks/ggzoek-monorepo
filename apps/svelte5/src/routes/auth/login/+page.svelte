<script lang="ts">
	import type { ActionData } from './$types';
	import { z } from 'zod';
	import { LoaderCircle } from 'lucide-svelte';

	type Props = {
		form: ActionData,
	}

	const { form }: Props = $props();
	let email = $state('');
	let processing = $state(false);

	const emailSchema = z.string().email();

	function validatePassword(e: MouseEvent) {
		if (!emailSchema.safeParse(email).success) {
			alert('Vul een geldig emailadres in.');
			e.preventDefault();
			return;
		}

	}

	function submit(e: Event) {
		processing = !processing;
	}

</script>

{#if processing}
	<div class="flex flex-row items-center justify-center w-full">
		<LoaderCircle class="animate-spin size-14 text-secondary-800" />
	</div>
{/if}

<form action="?/login" class={processing? "hidden": "space-y-4"}`
			method="post"
			onsubmit={() => processing = !processing}>
	<h1 class="text-center font-semibold text-xl text-secondary-900">Inloggen</h1>
	{#if form?.errors}
		<p class="text-red-500 text-sm text-wrap truncate">{form.errors}</p>
	{/if}
	<div>
		<input name="next" type="hidden" value="/zoekresultaten/" />
		<label class="block mb-1  font-medium text-gray-900 dark:text-white" for="email">Email:</label>
		<input
			bind:value={email}
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
			id="email"
			name="email"
			placeholder="psychiater@example.com"
			required type="email" />
	</div>
	<div>
		<label class="block mb-1  font-medium text-gray-900 dark:text-white" for="password">Wachtwoord:</label>
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
			id="password"
			name="password"
			placeholder="Wachtwoord"
			type="password" />
	</div>
	<div>
		<button formaction="?/reset" onclick={validatePassword}>Wachtwoord vergeten?</button>
	</div>
	<button
		class="mb-8 text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
		onsubmit={() => processing = !processing} type="submit"
		value="login">
		Inloggen
	</button>
	<p>Nog geen account? <a class="text-primary" href="register">Registreer hier.</a></p>
</form>



