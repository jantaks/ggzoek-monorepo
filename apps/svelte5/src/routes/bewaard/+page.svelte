<script lang="ts">
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import { setContext } from 'svelte';
	import { slide } from 'svelte/transition';

	let { data } = $props();

	let vacs = $state(data.vacatures);

	let found = $derived(vacs.length > 0);

	let removed = $state([]);

	setContext('onRemove', (urlHash: string) => {
		removed = [...removed, urlHash];
	});


</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<NavBar class="md:mb-4 bg-secondary-900 text-white" showLinks showLogin></NavBar>
<div class="flex flex-col justify-center items-center w-full space-y-4">
	{#if found === false}
		<p>Geen vacatures gevonden</p>
	{:else}
		{#each vacs as vacature}
			{#if !removed.includes(vacature.vacature.urlHash)}
				<div out:slide={{axis:"y", duration:300, delay:150}} in:slide={{axis:"y", duration:500}} class="max-w-3xl">
					<VacatureCard hit={vacature.vacature}></VacatureCard>
				</div>
			{/if}
		{/each}
	{/if}
</div>
