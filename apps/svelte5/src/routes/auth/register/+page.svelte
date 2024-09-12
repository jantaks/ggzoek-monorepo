<script lang="ts">


	import type { ActionData } from './$types';
	import Processing from '$lib/components/Processing.svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

	type Props = {
		form: ActionData,
	}

	const { form }: Props = $props();

	let processing = $state(false);

</script>
<Processing processing={processing} />

<form action="/auth/register"
			class={processing? "hidden": "space-y-4"}
			method="post"
			onsubmit={() => processing = !processing}>
	<div>
		<h1 class="text-center font-semibold text-xl text-secondary-900">Registreren</h1>
		{#if form?.error}
			<p class="text-red-500 text-sm text-wrap truncate text-center">{form.error}</p>
		{/if}
		<input name="next" type="hidden" value="/zoekresultaten/" />
		<label class="block mb-1  font-medium text-gray-900 dark:text-white" for="email">Email:</label>
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
			id="email"
			name="email"
			placeholder="psychiater@example.com"
			required
			type="email" value="{form?.email}" />
	</div>
	<div>
		{#if form?.passwordMismatch}
			<p class="text-red-500 text-sm">Wachtwoorden komen niet overeen</p>
		{/if}
		<label class="block mb-1  font-medium text-gray-900 dark:text-white" for="password">Wachtwoord:</label>
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
			id="password"
			name="password1"
			required
			type="password" />
	</div>
	<div>
		<label class="block mb-1 font-medium text-gray-900 dark:text-white" for="password">Herhaal wachtwoord:</label>
		<input
			class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
			id="password"
			name="password2"
			required
			type="password" />
	</div>
	<div class="flex items-start">
		<div class="flex items-center h-5">
			<input aria-describedby="terms"
						 class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
						 id="terms"
						 required
						 type="checkbox">
		</div>
		<div class="ml-3 text-sm">
			<label class="font-light text-gray-500 dark:text-gray-300" for="terms">Ik accepteer de <a
				class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">algemene voorwaarden
			</a></label>
		</div>
	</div>

	<Button3
		onsubmit={() => processing = !processing}
		size="medium"
		type="submit"
		variant="secondary">
		Registreer nu!
	</Button3>
	<p>Al een account? <a class="text-primary-600" href="login">Hier inloggen.</a></p>
</form>
