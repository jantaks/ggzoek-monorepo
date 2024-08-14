<script lang="ts">
	import type { ActionData } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';

	type Props = {
		next: string,
		form: ActionData,
		action: string,
	}

	const { form, action, next }: Props = $props();
	console.log(`Form, action, next: ${form}, ${action}, ${next}`);

</script>

<div class="flex flex-col items-center justify-center grow h-screen">
	<div class="max-w-lg w-full  p-10	bg-white rounded-lg shadow-md shadow-primary">
		<h1 class="text-center text-3xl text-primary font-bold px-2 border-b-1">GGZOEK - INLOGGEN</h1>
		<form action="/auth/login" class="space-y-6"
					method="post">
			{#if form?.errors}

				ERRORS: {form.errors}
			{/if}
			<div>
				<input name="next" type="hidden" value="/zoekresultaten/" />
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email">Email</label>
				<input
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
					id="email"
					name="email"
					placeholder="psychiater@example.com"
					required type="email" />
			</div>
			<div>
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="password">Wachtwoord</label>
				<input
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
					id="password"
					name="password"
					required
					type="password" />
			</div>
			<div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
						id="remember" name="password"
						type="checkbox"
						value="" />
				</div>
				<label class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="remember">Onthoud mij</label>
			</div>
			<button
				class="mb-8 text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
				type="submit">
				Inloggen
			</button>

		</form>
		<p>Nog geen account? <a class="text-primary" href="register">Registreer hier.</a></p>
	</div>


</div>


