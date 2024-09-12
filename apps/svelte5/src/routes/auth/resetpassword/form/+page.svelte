<script lang="ts">

	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Eye, EyeOff } from 'lucide-svelte';
	import DelayedForward from '$lib/components/DelayedForward.svelte';

	const { form } = $props();

	let showPassword = $state(false);

</script>
<h1 class="text-center font-semibold text-xl text-secondary-900">Wachtwoord wijzigen</h1>
{#if form?.success}
	<p>Wachtwoord succesvol gewijzigd.</p>
	<DelayedForward delay= 3/>
{:else}
	<form class="space-y-4"
				method="post">
		{#if form?.error}
			<p class="text-red-500 text-sm">{form.error}</p>
		{/if}
		{@render pwField('Wachtwoord:', 'password1')}
		{@render pwField('Herhaal wachtwoord:', 'password2')}

		<button formaction="form"
						class="mb-8 text-primary-200 bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-dark"
						type="submit">
			Wijzigen
		</button>
	</form>
{/if}

{#snippet pwField(label, name)}
	<div>
		<label class="block mb-1 font-medium text-gray-900 dark:text-primary-200" for="password">{label}</label>
		<div class="relative">
			<button class="absolute right-4 inset-y-0  flex items-center"
							onclick={(e)=> {
								e.preventDefault();
								showPassword = !showPassword
							}}>
				{#if !showPassword}
					<div title="Toon wachtwoord">
						<Eye class="h-5 hover:text-primary" title="Toon wachtwoord" />
					</div>
				{:else}
					<EyeOff class="h-5 hover:text-primary" title="Verberg wachtwoord" />
				{/if}
			</button>
			<input
				class="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-primary-200 dark:focus:ring-primary dark:focus:border-primary"
				id="password"
				name={name}
				required
				type={showPassword? "text": "password"} />
		</div>
	</div>

{/snippet}