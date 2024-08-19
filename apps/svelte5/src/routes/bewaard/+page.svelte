<script lang="ts">
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import { setContext } from 'svelte';

	let { data } = $props();

	let vacs = $state(data.vacatures);


	setContext('onRemove', (urlHash: string) => {
		vacs = vacs.filter(vac => vac.vacature.urlHash !== urlHash);
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
<div>
	{#if !data.vacatures}
		<p>Geen vacatures gevonden</p>
	{:else}
		{#each vacs as vacature}
			<VacatureCard hit={vacature.vacature}></VacatureCard>
		{/each}
	{/if}
</div>
