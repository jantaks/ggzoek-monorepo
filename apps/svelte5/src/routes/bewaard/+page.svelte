<script lang="ts">
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import { setContext } from 'svelte';
	import { slide } from 'svelte/transition';

	let { data } = $props();


	let found = $state(data.vacatures.length);

	let removed = $state<string[]>([]);

	setContext('onRemove', async (urlHash: string) => {
		removed = [...removed, urlHash];
		found = found - 1;
	});


</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<div class="pt-4 flex flex-col justify-center items-center w-full space-y-4">
	<h1 class="text-xl font-bold">U heeft {found} bewaarde vacatures.</h1>
	{#each data.vacatures as vacature}
		{#if !removed.includes(vacature.vacature.urlHash)}
			<div out:slide={{axis:"y", duration:300, delay:150}} in:slide={{axis:"y", duration:500}} class="max-w-3xl">
				<VacatureCard hit={vacature.vacature}></VacatureCard>
			</div>
		{/if}
	{/each}
</div>
