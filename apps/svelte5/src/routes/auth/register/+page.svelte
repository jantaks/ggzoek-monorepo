<script lang="ts">


	import type { ActionData } from './$types';

	type Props = {
		form: ActionData,
	}

	const { form }: Props = $props();

</script>
<h1 class="text-center font-semibold text-xl text-secondary-900">Registreren</h1>
{#if form?.error}
	<p class="text-red-500 text-sm text-wrap truncate text-center">{form.error}</p>
{/if}
<form action="/auth/register" class="space-y-4"
			method="post">
	<div>
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

	<button
		class="mb-8 text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
		type="submit">
		Registreer nu!
	</button>

</form>
<p>Al een account? <a class="text-primary" href="login">Hier inloggen.</a></p>