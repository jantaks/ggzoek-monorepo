<script lang="ts">
	import type { ActionData } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';

	type Props = {
		next: string,
		form: ActionData,
		action: string,
	}

	const { form, action, next }: Props = $props();

</script>

<div class="flex flex-col items-center justify-center grow h-screen">
	<div class="max-w-lg w-full  p-10	bg-white rounded-lg shadow-md shadow-pink-300">
		<h1 class="text-center text-3xl text-pink-600 font-bold px-2 border-b-1">GGZOEK</h1>
		<form action="/auth/login" class="space-y-6"
					method="post">
			{#if form?.errors}
				ERRORS: {form.errors}
			{/if}
			<div>
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email">Email</label>
				<input
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500"
					id="email"
					name="email"
					placeholder="psychiater@example.com"
					required type="email" />
			</div>
			<div>
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="password">Wachtwoord</label>
				<input
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500"
					id="password"
					name="password"
					required
					type="password" />
			</div>
			<div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-pink-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-pink-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
						id="remember" name="password"
						type="checkbox"
						value="" />
				</div>
				<label class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="remember">Onthoud mij</label>
			</div>
			<button
				class="mb-8 text-white bg-pink-500 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
				type="submit">
				Inloggen
			</button>

			<input name="next" type="hidden" value={next} />
		</form>
		<p>Nog geen account? <a class="text-pink-500" href="/register">Registreer hier.</a></p>
	</div>


</div>


